import { db } from '../auth/firebaseConfig';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  serverTimestamp, 
  orderBy
} from 'firebase/firestore';

// Test database connection
export const testDbConnection = async () => {
  try {
    // Check if db was initialized properly
    if (!db) {
      console.error("Database not initialized");
      return { success: false, error: "Database not initialized. Please check Firebase configuration." };
    }
    
    console.log("Testing Firestore connection...");
    
    // First attempt a simpler operation - just get a collection reference
    const testCollection = collection(db, "test_connection");
    
    try {
      // Try a simple read operation first
      const testQuery = query(testCollection, where("test", "==", "test"));
      await getDocs(testQuery);
      console.log("Read operation successful");
      
      // Then try write operation
      const testDoc = await addDoc(testCollection, { 
        timestamp: serverTimestamp(),
        test: "Connection successful" 
      });
      console.log("Test document written with ID: ", testDoc.id);
      
      // Clean up
      await deleteDoc(doc(db, "test_connection", testDoc.id));
      console.log("Test document deleted. Database connection working properly!");
      
      return { success: true };
    } catch (innerError) {
      console.error("Database operation failed:", innerError);
      
      // Provide more specific error messages
      if (innerError.code === 'permission-denied') {
        return { 
          success: false, 
          error: "Permission denied. Check your Firebase security rules." 
        };
      } else if (innerError.code === 'unavailable') {
        return { 
          success: false, 
          error: "Firebase service is unavailable. Check your internet connection." 
        };
      }
      
      return { success: false, error: innerError.message };
    }
  } catch (error) {
    console.error("Database connection test failed:", error);
    return { 
      success: false, 
      error: error.message || "Unknown database connection error" 
    };
  }
};

// Get todos for the current user
export const getUserTodos = async (userId) => {
  try {
    if (!userId) {
      console.error("No user ID provided to getUserTodos");
      return [];
    }

    // Check if db was initialized properly
    if (!db) {
      console.error("Database not initialized when trying to fetch todos");
      throw new Error("Database connection failed. Please reload the application.");
    }

    console.log("Fetching todos for user:", userId);
    const todosRef = collection(db, "todos");
    
    // Query todos for this user, ordered by creation time
    const q = query(
      todosRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    try {
      const querySnapshot = await getDocs(q);
      const todos = [];
      
      querySnapshot.forEach((doc) => {
        console.log("Todo document:", doc.id, doc.data());
        todos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Found ${todos.length} todos for user ${userId}:`, todos);
      return todos;
    } catch (innerError) {
      console.error("Firestore read error:", innerError);
      
      // Handle specific Firestore permission errors
      if (innerError.code === 'permission-denied') {
        throw new Error("Missing or insufficient permissions to access your todos. Please check your Firestore rules.");
      }
      
      throw innerError;
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
    return []; 
  }
};

// Add a new todo
export const addTodo = async (userId, title, desc) => {
  try {
    if (!userId) {
      console.error("No user ID provided to addTodo");
      return { success: false, error: "User not authenticated" };
    }
    
    if (!db) {
      console.error("Database not initialized when trying to add todo");
      return { success: false, error: "Database connection failed. Please reload the page and try again." };
    }
    
    console.log(`Adding todo for user ${userId}:`, { title, desc });
    
    const timestamp = new Date();
    const todosRef = collection(db, "todos");
    
    const newTodo = {
      userId,
      title,
      desc,
      createdAt: timestamp // Use JavaScript Date instead of serverTimestamp
    };
    
    console.log("Saving todo to Firestore:", newTodo);
    
    const docRef = await addDoc(todosRef, newTodo);
    console.log("Todo added with ID:", docRef.id);
    
    return { 
      success: true, 
      todo: {
        id: docRef.id,
        ...newTodo,
        createdAt: timestamp
      }
    };
  } catch (innerError) {
    console.error("Firestore write error:", innerError);
    
    // Handle specific Firestore errors
    if (innerError.code === 'permission-denied') {
      return {
        success: false,
        error: "Missing or insufficient permissions. Please check your Firestore rules."
      };
    }
    
    return { success: false, error: innerError.message };
  }
};

// Delete a todo
export const deleteTodo = async (todoId) => {
  try {
    if (!todoId) {
      console.error("No todo ID provided for deletion");
      return { success: false, error: "Invalid todo ID" };
    }
    
    const todoRef = doc(db, "todos", todoId);
    await deleteDoc(todoRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    return { success: false, error: error.message };
  }
};
