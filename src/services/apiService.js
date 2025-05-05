/**
 * API Service Module
 * 
 * This module handles all communication with the backend API through Axios.
 * It provides services for task-related CRUD operations and Firebase authentication.
 * The module configures Axios with interceptors for authentication and error handling.
 */
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, REQUEST_TIMEOUT } from '../config/api.config';
import Task from '../models/Task';
import { auth } from '../auth/firebaseConfig';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable credentials for cross-origin requests
});

/**
 * Request Interceptor for Authentication
 * 
 * This interceptor attaches the Firebase token to outgoing requests.
 * It gets the token from localStorage and adds it to the Authorization header.
 * Important: The Spring Boot backend expects the raw Firebase token without Bearer prefix.
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Get Firebase token from local storage
    const firebaseToken = localStorage.getItem('firebaseToken');
    
    if (firebaseToken) {
      // Firebase tokens should be sent as-is, without the Bearer prefix
      // The Spring Boot backend expects just the raw Firebase token
      config.headers.Authorization = firebaseToken;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor for Error Handling
 * 
 * This interceptor handles common API error cases:
 * - 401 Unauthorized: Clears the token and could redirect to login
 * - Other errors are passed through to be handled by the services
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        // Clear token and redirect to login if unauthorized
        console.error("Authentication error - clearing token");
        localStorage.removeItem('firebaseToken');
        // You could dispatch an event or use a central auth state manager here
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Task Service
 * 
 * Provides methods for interacting with the task-related API endpoints:
 * - Getting all tasks (with optional filtering)
 * - Getting a single task by ID
 * - Creating new tasks
 * - Updating existing tasks
 * - Deleting tasks
 * - Searching and filtering tasks
 */
export const TaskService = {
  // Get all tasks (with optional filtering)
  getAllTasks: async (options = {}) => {
    try {
      console.log("Fetching all tasks with options:", options);
      let endpoint = ENDPOINTS.TASKS;
      
      // Handle search query
      if (options.search) {
        endpoint = ENDPOINTS.SEARCH_TASKS(options.search);
      }
      // Handle completion status filter
      else if (options.completed !== undefined) {
        endpoint = ENDPOINTS.FILTER_TASKS(options.completed);
      }
      
      console.log("Making request to endpoint:", API_BASE_URL + endpoint);
      console.log("Authorization header available:", !!localStorage.getItem('firebaseToken'));
      const response = await apiClient.get(endpoint);
      console.log("Response received:", response.status, response.statusText);
      console.log("Tasks in response:", response.data.length, "tasks");
      return response.data.map(task => Task.fromJSON ? Task.fromJSON(task) : task);
    } catch (error) {
      console.error('Error getting tasks:', error.message);
      if (error.response) {
        console.error(`Server responded with status ${error.response.status}:`, error.response.data);
      } else if (error.request) {
        console.error('No response received from server. Request details:', {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        });
      }
      throw error;
    }
  },

  /**
   * Get a single task by ID
   * @param {string|number} taskId - The ID of the task to retrieve
   * @returns {Object} The task object
   */
  getTaskById: async (taskId) => {
    try {
      console.log("Fetching task by ID:", taskId);
      const response = await apiClient.get(ENDPOINTS.TASK_BY_ID(taskId));
      return Task.fromJSON ? Task.fromJSON(response.data) : response.data;
    } catch (error) {
      console.error(`Error getting task ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new task
   * @param {Object} taskData - The task data to create
   * @returns {Object} The created task
   */
  createTask: async (taskData) => {
    try {
      const task = taskData instanceof Task ? taskData : taskData;
      const response = await apiClient.post(ENDPOINTS.TASKS, task);
      return Task.fromJSON ? Task.fromJSON(response.data) : response.data;
    } catch (error) {
      console.error('Error creating task:', error.message);
      throw error;
    }
  },

  /**
   * Update an existing task
   * @param {string|number} taskId - The ID of the task to update
   * @param {Object} taskData - The updated task data
   * @returns {Object} The updated task
   */
  updateTask: async (taskId, taskData) => {
    try {
      console.log("Updating task:", taskId, taskData);
      const task = taskData instanceof Task ? taskData : taskData;
      const response = await apiClient.put(ENDPOINTS.TASK_BY_ID(taskId), task);
      return Task.fromJSON ? Task.fromJSON(response.data) : response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a task
   * @param {string|number} taskId - The ID of the task to delete
   * @returns {Object} Success indicator and task ID
   */
  deleteTask: async (taskId) => {
    try {
      console.log("Deleting task:", taskId);
      await apiClient.delete(ENDPOINTS.TASK_BY_ID(taskId));
      return { success: true, id: taskId };
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Search tasks by query string
   * @param {string} query - The search query
   * @returns {Array} Array of tasks matching the query
   */
  searchTasks: async (query) => {
    try {
      const response = await apiClient.get(ENDPOINTS.SEARCH_TASKS(query));
      return response.data.map(task => Task.fromJSON(task));
    } catch (error) {
      console.error(`Error searching tasks with query "${query}":`, error);
      throw error;
    }
  },

  /**
   * Get tasks filtered by completion status
   * @param {boolean} completed - Whether to get completed or incomplete tasks
   * @returns {Array} Array of filtered tasks
   */
  getTasksByStatus: async (completed) => {
    try {
      const response = await apiClient.get(ENDPOINTS.FILTER_TASKS(completed));
      return response.data.map(task => Task.fromJSON(task));
    } catch (error) {
      console.error(`Error getting ${completed ? 'completed' : 'incomplete'} tasks:`, error);
      throw error;
    }
  }
};

/**
 * Firebase Authentication Service
 * 
 * Provides methods for handling Firebase authentication:
 * - Setting the Firebase token
 * - Clearing the token
 * - Checking if the user is authenticated
 */
export const FirebaseAuthService = {
  /**
   * Set Firebase token in localStorage
   * @param {string} token - The Firebase authentication token
   */
  setToken: (token) => {
    console.log("Setting Firebase token");
    localStorage.setItem('firebaseToken', token);
  },
  
  /**
   * Clear Firebase token from localStorage
   */
  clearToken: () => {
    console.log("Clearing Firebase token");
    localStorage.removeItem('firebaseToken');
  },
  
  /**
   * Check if user is authenticated based on token presence
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('firebaseToken');
  }
};

export default {
  TaskService,
  FirebaseAuthService
};