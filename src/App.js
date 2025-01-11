import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './MyComponents/Header';
import Header from './MyComponents/Header';
import {Todos} from './MyComponents/Todos';
import Footer from './MyComponents/Footer';
import { useState, useEffect } from 'react';  // Remove React import
import AddTodo from './MyComponents/AddTodo';

function App() {
  let initTodo ; 
  if(localStorage.getItem("todos") === null){
    initTodo = [];
  }else{
    initTodo = JSON.parse(localStorage.getItem("todos"));
  }

  const [todos, setTodos] = useState(initTodo); // Remove the array wrapper
  const [filteredTodos, setFilteredTodos] = useState(todos);

  // Add useEffect to handle localStorage updates
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    setFilteredTodos(todos); // Update filtered todos when todos change
  }, [todos]); // This will run whenever todos changes

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

  const onDelete = (todo) => {
    const updatedTodos = todos.filter((e) => e !== todo);
    setTodos(updatedTodos);
    // Remove this as useEffect handles it
    // localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  const addTodoItem = (title, desc) => {
    let sno;
    if (todos.length === 0) {
      sno = 1;
    } else {
      sno = todos[todos.length - 1].sno + 1;
    }
    
    const myTodo = {
      sno: sno,
      title: title,
      desc: desc
    }
    
    setTodos([...todos, myTodo]);
    // Remove this as useEffect handles it
    // localStorage.setItem("todos", JSON.stringify([...todos, myTodo]));
  }

  return (
    <div className="app-wrapper">
      <div className="container py-4">
        <Header 
          title={"My Todos List"} 
          searchBar={true} 
          onSearch={handleSearch}
        />
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg">
              <div className="card-body">
                <AddTodo AddTodo={addTodoItem}/>
                <Todos todos={filteredTodos} onDelete={onDelete} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
