/**
 * API Configuration
 * This file contains all API-related configuration settings.
 * Centralized for easy management across environments.
 */

// Base API URL - Using direct URL for production and proxy for development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                     (process.env.NODE_ENV === 'production' 
                      ? 'https://todowebbackend-production.up.railway.app' 
                      : '/api');

console.log("Using API base URL:", API_BASE_URL);

// API endpoints
const ENDPOINTS = {
  // Task endpoints
  TASKS: '/tasks',
  TASK_BY_ID: (id) => `/tasks/${id}`,
  SEARCH_TASKS: (query) => `/tasks/?search=${encodeURIComponent(query)}`,
  FILTER_TASKS: (completed) => `/tasks/?completed=${completed}`,
  
  // Auth endpoints (if needed)
  AUTH: '/auth',
  FIREBASE_AUTH: '/auth/firebase'
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