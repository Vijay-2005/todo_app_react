import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './MyComponents/Header';
import Footer from './MyComponents/Footer';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { auth } from './auth/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserTodos, addTodo, deleteTodo, testDbConnection } from './services/todoService';

function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [dbError, setDbError] = useState(null);
  
  // Helper function to get user-specific localStorage key
  const getTodosStorageKey = (userId) => {
    return `todos_${userId}`;
  };

  // Listen for authentication state changes
  useEffect(() => {
    console.log("Setting up auth listener");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser ? "User logged in" : "No user");
      setUser(currentUser);
      
      if (currentUser) {
        // Load cached todos from localStorage immediately after login
        const storageKey = getTodosStorageKey(currentUser.uid);
        const cachedTodos = localStorage.getItem(storageKey);
        
        if (cachedTodos) {
          try {
            const parsedTodos = JSON.parse(cachedTodos);
            console.log("Loaded cached todos for user:", currentUser.uid, parsedTodos);
            setTodos(parsedTodos);
            setFilteredTodos(parsedTodos);
          } catch (e) {
            console.error("Error parsing cached todos:", e);
          }
        }
      }
      
      setLoading(false);
      setAuthChecked(true);
    }, (error) => {
      console.error("Auth state change error:", error);
      setLoading(false);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Test database connection when app loads
  useEffect(() => {
    const testDb = async () => {
      const result = await testDbConnection();
      if (!result.success) {
        console.error("Database connection test failed:", result.error);
        setDbError("Failed to connect to database. Please check your connection.");
      }
    };
    testDb();
  }, []);

  // Fetch todos when user changes
  useEffect(() => {
    const fetchTodos = async () => {
      if (user) {
        console.log("Fetching todos for user:", user.uid);
        setLoading(true);
        
        try {
          const userTodos = await getUserTodos(user.uid);
          console.log("Fetched todos from Firebase:", userTodos);
          
          if (Array.isArray(userTodos) && userTodos.length > 0) {
            // Store todos in localStorage with user-specific key
            const storageKey = getTodosStorageKey(user.uid);
            localStorage.setItem(storageKey, JSON.stringify(userTodos));
            console.log("Saved todos to localStorage with key:", storageKey);
            
            setTodos(userTodos);
            setFilteredTodos(userTodos);
          } else {
            console.log("No todos fetched from Firebase or empty array received");
            
            // Try to recover from localStorage only if Firebase returned empty
            const storageKey = getTodosStorageKey(user.uid);
            const savedTodos = localStorage.getItem(storageKey);
            
            if (savedTodos) {
              const parsedTodos = JSON.parse(savedTodos);
              if (Array.isArray(parsedTodos) && parsedTodos.length > 0) {
                console.log("Using cached todos from localStorage:", parsedTodos);
                setTodos(parsedTodos);
                setFilteredTodos(parsedTodos);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching todos:", error);
          setDbError("Failed to load your todos. Please try again.");
          
          // Try to recover from localStorage
          const storageKey = getTodosStorageKey(user.uid);
          const savedTodos = localStorage.getItem(storageKey);
          
          if (savedTodos) {
            try {
              const parsedTodos = JSON.parse(savedTodos);
              console.log("Recovered todos from localStorage:", parsedTodos);
              setTodos(parsedTodos);
              setFilteredTodos(parsedTodos);
            } catch (e) {
              console.error("Error parsing saved todos:", e);
            }
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Clear todos when user is logged out
        setTodos([]);
        setFilteredTodos([]);
      }
    };

    fetchTodos();
  }, [user]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredTodos(todos);
      return;
    }
    
    const filtered = todos.filter(todo => 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTodos(filtered);
  };

  const onDelete = async (todo) => {
    if (!user) return;
    
    try {
      console.log("Attempting to delete todo:", todo.id);
      const response = await deleteTodo(todo.id);
      
      if (response.success) {
        console.log("Todo deleted successfully");
        const updatedTodos = todos.filter((t) => t.id !== todo.id);
        
        // Update state
        setTodos(updatedTodos);
        setFilteredTodos(updatedTodos);
        
        // Update localStorage with user-specific key
        const storageKey = getTodosStorageKey(user.uid);
        localStorage.setItem(storageKey, JSON.stringify(updatedTodos));
        console.log("Updated localStorage after delete with key:", storageKey);
      } else {
        console.error("Error deleting todo:", response.error);
      }
    } catch (error) {
      console.error("Error in delete operation:", error);
    }
  };

  const addTodoItem = async (title, desc) => {
    if (!user) return;
    
    try {
      console.log("Adding todo:", { title, desc });
      const response = await addTodo(user.uid, title, desc);
      
      if (response.success) {
        console.log("Todo added successfully:", response.todo);
        const newTodos = [response.todo, ...todos];
        
        // Update state
        setTodos(newTodos);
        setFilteredTodos(newTodos);
        
        // Update localStorage with user-specific key
        const storageKey = getTodosStorageKey(user.uid);
        localStorage.setItem(storageKey, JSON.stringify(newTodos));
        console.log("Updated localStorage after add with key:", storageKey);
      } else {
        console.error("Error adding todo:", response.error);
        alert("Failed to add todo: " + response.error);
      }
    } catch (error) {
      console.error("Error in add operation:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    console.log("ProtectedRoute check - User:", !!user, "AuthChecked:", authChecked, "Loading:", loading);
    
    if (!authChecked || loading) {
      return <div className="container text-center py-5">
        <div className="card">
          <div className="card-body">
            <h3>Loading...</h3>
            <p>Please wait while we set up your experience.</p>
          </div>
        </div>
      </div>;
    }
    
    if (!user) {
      console.log("No user found, redirecting to login");
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };
  
  // If still initializing auth, show loading
  if (!authChecked) {
    return <div className="container text-center py-5">Initializing app...</div>;
  }

  return (
    <Router>
      <div className="app-wrapper">
        <Header 
          title="My Todos List" 
          searchBar={user ? true : false} 
          onSearch={handleSearch}
          user={user} 
        />
        
        {dbError && (
          <div className="container">
            <div className="alert alert-danger text-center" role="alert">
              {dbError}
              <button 
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home 
                  todos={filteredTodos} 
                  addTodoItem={addTodoItem} 
                  onDelete={onDelete} 
                  loading={loading}
                />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
