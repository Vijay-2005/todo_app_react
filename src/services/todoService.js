/**
 * Todo Service Module
 * 
 * This module provides higher-level services for todo-related operations.
 * It acts as a bridge between the frontend components and the API service,
 * handling data transformation, error handling, and business logic.
 * 
 * The service includes functions for:
 * - Testing backend connectivity
 * - Fetching todos for a user
 * - Adding, editing, deleting, and completing todos
 * - Field mapping between frontend and backend models
 */
import { TaskService } from './apiService';

/**
 * Test database connection
 * Performs a simple API request to check if the backend is accessible
 * @returns {Object} Success indicator and error message if applicable
 */
export const testDbConnection = async () => {
  try {
    console.log("Testing API connection...");
    
    // Check if Firebase token exists
    const token = localStorage.getItem('firebaseToken');
    if (!token) {
      console.log("No Firebase token available for API testing");
      // Return success even without token, as the user might not be logged in yet
      return { success: true };
    }
    
    // Just make a simple request to check if the API is accessible
    try {
      await TaskService.getAllTasks();
      console.log("API connection test successful");
      return { success: true };
    } catch (error) {
      console.error("API test request failed:", error.message);
      // Check if it's a network error
      if (error.message && error.message.includes('Network Error')) {
        return { 
          success: false, 
          error: "Cannot connect to backend server. Please ensure the server is running." 
        };
      }
      // Check if it's a timeout
      if (error.message && error.message.includes('timeout')) {
        return { 
          success: false, 
          error: "Connection to backend timed out. Please ensure the server is running and accessible." 
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("API connection test failed:", error);
    return { 
      success: false, 
      error: error.message || "Could not connect to the backend service" 
    };
  }
};

/**
 * Get todos for the current user
 * Fetches tasks from the backend and maps them to the frontend model
 * @param {string} userId - Firebase user ID
 * @returns {Array} Array of todo objects formatted for the frontend
 */
export const getUserTodos = async (userId) => {
  try {
    if (!userId) {
      console.error("No user ID provided to getUserTodos");
      return [];
    }

    console.log("Fetching todos for user:", userId);
    
    // Get the Firebase token and set it (should be handled by apiService interceptor)
    const token = localStorage.getItem('firebaseToken');
    if (!token) {
      console.error("No Firebase token found");
      return [];
    }
    
    console.log(`Calling TaskService.getAllTasks() to fetch tasks for user ${userId}`);
    try {
      // Use the API service to get tasks
      const tasks = await TaskService.getAllTasks();
      console.log(`API returned ${tasks ? tasks.length : 0} tasks for user ${userId}:`, tasks);
      
      // Map the backend structure to the frontend structure
      return tasks.map(task => ({
        id: task.id,
        userId: task.userId,
        title: task.title,
        desc: task.description, // Map description to desc for frontend compatibility
        completed: task.completed,
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : null
      }));
    } catch (apiError) {
      console.error("API Error in getAllTasks:", apiError);
      if (apiError.response) {
        console.error(`API Response Error (${apiError.response.status}):`, apiError.response.data);
      }
      throw apiError; // Re-throw to be caught by outer handler
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
    return []; 
  }
};

/**
 * Add a new todo
 * Creates a new task in the backend and maps the response to frontend format
 * @param {string} userId - Firebase user ID
 * @param {string} title - Todo title
 * @param {string} desc - Todo description
 * @returns {Object} Success indicator and created todo object
 */
export const addTodo = async (userId, title, desc) => {
  try {
    if (!userId) {
      console.error("No user ID provided to addTodo");
      return { success: false, error: "User not authenticated" };
    }
    
    // Check if Firebase token exists
    const token = localStorage.getItem('firebaseToken');
    if (!token) {
      return { success: false, error: "No authentication token found. Please log in again." };
    }
    
    // Create task data with the correct field names for the backend
    const taskData = {
      title: title,
      description: desc, // Map desc to description for backend compatibility
      completed: false
    };
    
    // Use the TaskService to create the task instead of direct fetch
    try {
      const savedTask = await TaskService.createTask(taskData);
      
      // Map the task back to frontend structure
      return { 
        success: true, 
        todo: {
          id: savedTask.id,
          userId: savedTask.userId,
          title: savedTask.title,
          desc: savedTask.description, // Map description back to desc for frontend
          completed: savedTask.completed,
          createdAt: savedTask.createdAt ? new Date(savedTask.createdAt) : new Date()
        }
      };
    } catch (apiError) {
      console.error("API Error in createTask:", apiError);
      throw apiError;
    }
  } catch (error) {
    console.error("Error adding todo:", error.message);
    return { 
      success: false, 
      error: error.message || "Failed to add todo. Please try again."
    };
  }
};

/**
 * Delete a todo
 * Removes a task from the backend
 * @param {string|number} todoId - ID of the todo to delete
 * @returns {Object} Success indicator and error message if applicable
 */
export const deleteTodo = async (todoId) => {
  try {
    if (!todoId) {
      console.error("No todo ID provided for deletion");
      return { success: false, error: "Invalid todo ID" };
    }
    
    // Use the API service to delete the task
    await TaskService.deleteTask(todoId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Edit a todo
 * Updates a task in the backend and maps the response to frontend format
 * @param {string|number} todoId - ID of the todo to edit
 * @param {string} title - New title
 * @param {string} desc - New description
 * @returns {Object} Success indicator and updated todo object
 */
export const editTodo = async (todoId, title, desc) => {
  try {
    if (!todoId) {
      console.error("No todo ID provided for editing");
      return { success: false, error: "Invalid todo ID" };
    }
    
    // Get the current task first
    const currentTask = await TaskService.getTaskById(todoId);
    
    // Update with new values
    const taskData = {
      ...currentTask,
      title: title,
      description: desc // Map desc to description for backend compatibility
    };
    
    // Use the API service to update the task
    const updatedTask = await TaskService.updateTask(todoId, taskData);
    
    return { 
      success: true,
      todo: {
        id: updatedTask.id,
        userId: updatedTask.userId,
        title: updatedTask.title,
        desc: updatedTask.description, // Map description back to desc for frontend
        completed: updatedTask.completed,
        updatedAt: updatedTask.updatedAt ? new Date(updatedTask.updatedAt) : new Date()
      }
    };
  } catch (error) {
    console.error("Error editing todo:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Complete a todo
 * Updates the completion status of a task in the backend
 * @param {string|number} todoId - ID of the todo to update
 * @param {boolean} completed - New completion status
 * @returns {Object} Success indicator and updated todo object
 */
export const completeTodo = async (todoId, completed) => {
  try {
    if (!todoId) {
      console.error("No todo ID provided for completion status update");
      return { success: false, error: "Invalid todo ID" };
    }
    
    // Get the current task first
    const currentTask = await TaskService.getTaskById(todoId);
    
    // Update the completion status
    const taskData = {
      ...currentTask,
      completed: completed
    };
    
    // Use the API service to update the task
    const updatedTask = await TaskService.updateTask(todoId, taskData);
    
    return { 
      success: true,
      todo: {
        id: updatedTask.id,
        userId: updatedTask.userId,
        title: updatedTask.title,
        desc: updatedTask.description, // Map description back to desc for frontend
        completed: updatedTask.completed,
        completedAt: completed ? new Date() : null
      }
    };
  } catch (error) {
    console.error("Error updating completion status:", error);
    return { success: false, error: error.message };
  }
};
