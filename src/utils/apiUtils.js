/**
 * API Utility functions
 */

// Format error messages from the backend
export const formatErrorMessage = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  if (error.response) {
    // The server responded with an error status
    const { status, data } = error.response;
    
    // Handle different types of error responses
    if (data && data.message) {
      return data.message;
    } else if (data && data.error) {
      return data.error;
    } else if (status === 401) {
      return 'Authentication required. Please log in.';
    } else if (status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (status === 404) {
      return 'The requested resource was not found.';
    } else if (status >= 500) {
      return 'Server error. Please try again later.';
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Something else caused the error
  return error.message || 'An error occurred. Please try again.';
};

// Convert date strings from backend to Date objects
export const parseDateString = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Format Date objects to ISO strings for the backend
export const formatDateForApi = (date) => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString() : date;
};

// Basic field validation
export const validateField = (value, fieldName, options = {}) => {
  const { required = true, minLength, maxLength } = options;
  
  if (required && (!value || value.trim() === '')) {
    return `${fieldName} is required`;
  }
  
  if (minLength && value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  
  if (maxLength && value && value.length > maxLength) {
    return `${fieldName} cannot exceed ${maxLength} characters`;
  }
  
  return null; // No error
};

// Helper to extract token payload (without signature verification)
export const decodeJwtToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
};

export default {
  formatErrorMessage,
  parseDateString,
  formatDateForApi,
  validateField,
  decodeJwtToken
}; 