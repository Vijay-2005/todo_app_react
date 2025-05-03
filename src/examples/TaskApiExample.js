import React, { useState, useEffect } from 'react';
import { TaskService } from '../services/apiService';
import { formatErrorMessage } from '../utils/apiUtils';
import Task from '../models/Task';

/**
 * Example component demonstrating the use of the Task API Service
 */
const TaskApiExample = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Load tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const taskList = await TaskService.getAllTasks();
      setTasks(taskList);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const newTask = new Task({
        title: newTaskTitle,
        description: newTaskDesc,
        userId: localStorage.getItem('userId') // Assume userId is stored in localStorage
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

  // Toggle task completion status
  const handleToggleComplete = async (taskId, currentStatus) => {
    setLoading(true);
    
    try {
      const updatedTask = await TaskService.completeTask(taskId, !currentStatus);
      
      // Update task in state
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
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

  return (
    <div className="task-api-example">
      <h2>Task API Example</h2>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Create task form */}
      <form onSubmit={handleCreateTask} className="mb-4">
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
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      
      {/* Task list */}
      <div className="task-list">
        <h3>Your Tasks</h3>
        
        {loading && tasks.length === 0 && (
          <p>Loading tasks...</p>
        )}
        
        {!loading && tasks.length === 0 && (
          <p>No tasks found. Create one!</p>
        )}
        
        <ul className="list-group">
          {tasks.map(task => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => handleToggleComplete(task.id, task.completed)}
                  className="me-2"
                />
                <span className={task.completed ? 'text-decoration-line-through' : ''}>
                  {task.title}
                </span>
                <p className="text-muted small mb-0">{task.description}</p>
              </div>
              <button 
                onClick={() => handleDeleteTask(task.id)} 
                className="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskApiExample; 