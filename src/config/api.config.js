/**
 * API Configuration Module
 * 
 * This file contains all API-related configuration settings and is centralized 
 * for easy management across environments. It defines:
 * 
 * - Base URL for API endpoints
 * - Endpoint paths for different API operations
 * - Request timeout settings
 * - HTTP status code constants
 * 
 * The configuration supports both development and production environments,
 * with a fallback to the production Render URL if no environment override is provided.
 */

/**
 * Base API URL
 * 
 * By default, uses the production Render URL, but can be overridden
 * by setting the REACT_APP_API_BASE_URL environment variable.
 * For local development, this might be set to localhost with the appropriate port.
 * When using npm start, a proxy may be configured in package.json to avoid CORS issues.
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://todo-web-backend-jqp2.onrender.com';

console.log("Using API base URL:", API_BASE_URL);

/**
 * API Endpoints
 * 
 * These are the specific paths appended to the base URL for different API operations.
 * They follow RESTful conventions and include:
 * - CRUD operations for tasks
 * - Search and filtering endpoints
 * - Authentication endpoints
 * 
 * Note that some endpoints have parameters (like ID, search query, or filter criteria)
 * which are provided as function arguments and properly URI-encoded.
 */
const ENDPOINTS = {
  // Task endpoints
  TASKS: '/api/tasks', // GET all, POST new
  TASK_BY_ID: (id) => `/api/tasks/${id}`, // GET one, PUT update, DELETE
  SEARCH_TASKS: (query) => `/api/tasks/?search=${encodeURIComponent(query)}`, // Search by term
  FILTER_TASKS: (completed) => `/api/tasks/?completed=${completed}`, // Filter by completion
  
  // Auth endpoints (if needed)
  AUTH: '/api/auth', // General auth endpoint
  FIREBASE_AUTH: '/api/auth/firebase' // Firebase-specific auth endpoint
};

/**
 * Request Timeout
 * 
 * Maximum time in milliseconds to wait for an API response before timing out.
 * This is particularly important for operations that might take longer or
 * for handling slow network conditions.
 */
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * HTTP Status Codes
 * 
 * Constants for common HTTP status codes used throughout the application.
 * Using these constants makes code more readable and maintainable.
 */
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