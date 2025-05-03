import React, { useState, useEffect } from 'react';
import { TaskService, FirebaseAuthService } from '../services/apiService';
import { formatErrorMessage } from '../utils/apiUtils';
import Task from '../models/Task';

/**
 * Example component demonstrating the use of the Task API Service with Firebase Auth
 */
const FirebaseTaskExample = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(null); // null = all, true = completed, false = incomplete

  // Set the Firebase token when available from Firebase Auth
  // This is just an example - you should integrate with your actual Firebase Auth
  useEffect(() => {
    // This simulates retrieving a Firebase token
    // In a real app, you'd get this from the Firebase Auth SDK
    const setFirebaseAuthToken = async () => {
      // Example: Get token from Firebase
      // const currentUser = firebase.auth().currentUser;
      // if (currentUser) {
      //   const token = await currentUser.getIdToken();
      //   FirebaseAuthService.setToken(token);
      // }
      
      // For demonstration purposes - you should replace this
      // with actual Firebase integration
      const mockToken = localStorage.getItem('firebaseToken');
      if (!mockToken) {
        console.warn('No Firebase token found. API calls will fail authentication.');
      }
    };
    
    setFirebaseAuthToken();
  }, []);

  // Load tasks when component mounts
  useEffect(() => {
    if (FirebaseAuthService.isAuthenticated()) {
      fetchTasks();
    }
  }, [filterCompleted]); // Refetch when filter changes

  // Fetch tasks based on current filters
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let taskList;
      
      if (searchQuery) {
        // Search tasks
        taskList = await TaskService.searchTasks(searchQuery);
      } else if (filterCompleted !== null) {
        // Filter by completion status
        taskList = await TaskService.getTasksByStatus(filterCompleted);
      } else {
        // Get all tasks
        taskList = await TaskService.getAllTasks();
      }
      
      setTasks(taskList);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  // Create a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const newTask = new Task({
        title: newTaskTitle,
        description: newTaskDesc
        // userId is handled by the backend based on token
      });
      
      const createdTask = await TaskService.createTask(newTask);
      setTasks([createdTask, ...tasks]);
      
      // Clear form
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Update task completion by toggling status
  const handleToggleComplete = async (taskId, task) => {
    setLoading(true);
    
    try {
      const updatedTaskData = {
        ...task,
        completed: !task.completed
      };
      
      const updatedTask = await TaskService.updateTask(taskId, updatedTaskData);
      
      // Update task in state
      setTasks(tasks.map(t => 
        t.id === taskId ? updatedTask : t
      ));
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      await TaskService.deleteTask(taskId);
      
      // Remove task from state
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!FirebaseAuthService.isAuthenticated()) {
    return (
      <div className="alert alert-warning">
        You need to be logged in with Firebase to use this component.
        <div className="mt-3">
          <button className="btn btn-primary" onClick={() => {
            // In a real app, trigger Firebase login here
            // For demo purposes, we'll just set a mock token
            FirebaseAuthService.setToken('mock-firebase-token');
            window.location.reload();
          }}>
            Login with Firebase
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="firebase-task-example">
      <h2>Task API with Firebase Auth Example</h2>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Search and filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Search and Filters</h5>
          
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>
          
          <div className="btn-group" role="group">
            <button 
              className={`btn ${filterCompleted === null ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilterCompleted(null)}
            >
              All
            </button>
            <button 
              className={`btn ${filterCompleted === false ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilterCompleted(false)}
            >
              Incomplete
            </button>
            <button 
              className={`btn ${filterCompleted === true ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilterCompleted(true)}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      {/* Create task form */}
      <form onSubmit={handleCreateTask} className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Task</h5>
          <div className="mb-3">
            <label htmlFor="taskTitle" className="form-label">Task Title</label>
            <input
              type="text"
              className="form-control"
              id="taskTitle"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="taskDesc" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="taskDesc"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
      
      {/* Task list */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Your Tasks</h5>
          
          {loading && tasks.length === 0 && (
            <p className="text-muted">Loading tasks...</p>
          )}
          
          {!loading && tasks.length === 0 && (
            <p className="text-muted">No tasks found. Create one!</p>
          )}
          
          <ul className="list-group">
            {tasks.map(task => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => handleToggleComplete(task.id, task)}
                    className="form-check-input me-3"
                  />
                  <div>
                    <h6 className={task.completed ? 'text-decoration-line-through mb-0' : 'mb-0'}>
                      {task.title}
                    </h6>
                    <p className="text-muted small mb-0">{task.description}</p>
                  </div>
                </div>
                <div className="btn-group">
                  <button 
                    onClick={() => handleDeleteTask(task.id)} 
                    className="btn btn-sm btn-danger"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTaskExample; 