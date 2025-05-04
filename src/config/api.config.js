/**
 * API Configuration
 * This file contains all API-related configuration settings.
 * Centralized for easy management across environments.
 */

// Base API URL - Using direct URL for production and proxy for development
// In development, we use an empty string because the proxy in package.json handles the forwarding
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                     (process.env.NODE_ENV === 'production' 
                      ? 'https://todo-web-backend-jqp2.onrender.com' 
                      : '');

console.log("Using API base URL:", API_BASE_URL);

// API endpoints - these are appended to the API_BASE_URL
const ENDPOINTS = {
  // Task endpoints
  TASKS: '/api/tasks',
  TASK_BY_ID: (id) => `/api/tasks/${id}`,
  SEARCH_TASKS: (query) => `/api/tasks/?search=${encodeURIComponent(query)}`,
  FILTER_TASKS: (completed) => `/api/tasks/?completed=${completed}`,
  
  // Auth endpoints (if needed)
  AUTH: '/api/auth',
  FIREBASE_AUTH: '/api/auth/firebase'
};

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// HTTP Status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export {
  API_BASE_URL,
  ENDPOINTS,
  REQUEST_TIMEOUT,
  HTTP_STATUS
};