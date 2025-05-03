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
});

// Add a request interceptor for Firebase authentication
apiClient.interceptors.request.use(
  async (config) => {
    // Get Firebase token from local storage
    const firebaseToken = localStorage.getItem('firebaseToken');
    console.log("API Request to:", config.baseURL + config.url);
    console.log("Token available:", !!firebaseToken);
    
    if (firebaseToken) {
      console.log("Setting Authorization header with token");
      // Firebase tokens should be sent as-is, without the Bearer prefix
      // The Spring Boot backend expects just the raw Firebase token
      config.headers.Authorization = firebaseToken;
      console.log("Authorization header set with token length:", firebaseToken.length);
    } else {
      console.log("⚠️ No token available for request - authentication will likely fail");
      console.log("User auth state:", auth?.currentUser ? "Logged in" : "Not logged in");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response success from:", response.config.url);
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      console.error('API Error:', {
        status,
        url: error.config.url,
        message: data?.message || 'Unknown error',
        data: data
      });
      
      // Handle authentication errors
      if (status === 401) {
        // Clear token and redirect to login if unauthorized
        console.error("Authentication error - clearing token");
        localStorage.removeItem('firebaseToken');
        // You could dispatch an event or use a central auth state manager here
      }
    } else if (error.request) {
      // Network error or no response
      console.error('Network Error:', error.message);
      console.error('Request details:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout
      });
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Task API functions
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

  // Get task by ID
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

  // Create a new task
  createTask: async (taskData) => {
    try {
      console.log("Creating new task:", taskData);
      console.log("Endpoint:", API_BASE_URL + ENDPOINTS.TASKS);
      console.log("Request data:", JSON.stringify(taskData));
      
      const task = taskData instanceof Task ? taskData : taskData;
      const response = await apiClient.post(ENDPOINTS.TASKS, task);
      console.log("Task created response:", response.data);
      return Task.fromJSON ? Task.fromJSON(response.data) : response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle specific status codes
      if (error.response && error.response.status === 405) {
        console.error('Method Not Allowed: This endpoint does not support POST requests');
        console.error('Endpoint details:', {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers
        });
      }
      throw error;
    }
  },

  // Update a task
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

  // Delete a task
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

  // Search tasks
  searchTasks: async (query) => {
    try {
      const response = await apiClient.get(ENDPOINTS.SEARCH_TASKS(query));
      return response.data.map(task => Task.fromJSON(task));
    } catch (error) {
      console.error(`Error searching tasks with query "${query}":`, error);
      throw error;
    }
  },

  // Get tasks by completion status
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

// Auth helper for Firebase
export const FirebaseAuthService = {
  // Set Firebase token
  setToken: (token) => {
    console.log("Setting Firebase token");
    localStorage.setItem('firebaseToken', token);
  },
  
  // Clear Firebase token
  clearToken: () => {
    console.log("Clearing Firebase token");
    localStorage.removeItem('firebaseToken');
  },
  
  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('firebaseToken');
  }
};

export default {
  TaskService,
  FirebaseAuthService
}; 