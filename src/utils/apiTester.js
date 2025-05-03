import axios from 'axios';

/**
 * Simple utility to test API connectivity
 */
const testAPIConnection = async () => {
  console.log("Testing API connection...");
  
  // Try to access the backend directly
  try {
    const response = await axios.get('http://localhost:8081/api', { 
      timeout: 5000,
      validateStatus: function (status) {
        // Consider any response a success for testing connectivity
        return status < 500; 
      }
    });
    console.log("API connectivity test response:", response.status);
    return { 
      success: true, 
      status: response.status, 
      message: "Connection to backend successful!" 
    };
  } catch (error) {
    console.error("API connectivity test failed:", error.message);
    
    // Determine the exact cause of failure
    if (error.code === 'ECONNREFUSED') {
      return { 
        success: false, 
        error: "Cannot connect to the backend server. Make sure the backend is running on http://localhost:8081." 
      };
    }
    
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      return { 
        success: false, 
        error: "Connection to backend timed out. The server might be down or not responsive." 
      };
    }
    
    return { 
      success: false, 
      error: `Connection failed: ${error.message}` 
    };
  }
};

// Check if we need to use a proxy because of CORS issues
const checkCORSIssues = async () => {
  console.log("Checking for potential CORS issues...");
  
  try {
    // Send an OPTIONS request to check CORS preflight
    const response = await axios({
      method: 'OPTIONS',
      url: 'http://localhost:8081/api',
      timeout: 3000
    });
    console.log("CORS preflight response:", response.status);
    return { 
      success: true, 
      message: "CORS preflight check passed" 
    };
  } catch (error) {
    console.error("CORS check failed:", error.message);
    
    // If it's specifically a CORS error
    if (error.message.includes('CORS')) {
      return { 
        success: false, 
        error: "CORS issue detected. The backend server needs to allow requests from your frontend." 
      };
    }
    
    return { 
      success: false, 
      error: "Could not perform CORS check. Backend might be down."
    };
  }
};

// Test POST to tasks endpoint specifically
const testTaskCreation = async (token) => {
  console.log("Testing task creation API endpoint...");
  
  if (!token) {
    console.error("No token provided for task creation test");
    return {
      success: false,
      error: "Firebase token is required to test task creation"
    };
  }
  
  // Create a test task
  const testTask = {
    title: "Test Task",
    description: "This is a test task to verify API connectivity",
    completed: false
  };
  
  try {
    // Remove Bearer prefix if present - Firebase tokens should be sent as-is
    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': cleanToken
    };
    
    // Try a direct POST request to the backend
    console.log("Sending direct POST request to task endpoint");
    console.log("Headers:", {
      'Content-Type': headers['Content-Type'],
      'Authorization': `Token length: ${cleanToken.length}`
    });
    console.log("Data:", testTask);
    
    const response = await axios.post('http://localhost:8081/api/tasks', testTask, { 
      timeout: 5000,
      headers: headers
    });
    
    console.log("Task creation test response:", response.status, response.data);
    return { 
      success: true, 
      status: response.status, 
      message: "Task creation endpoint is working!",
      data: response.data
    };
  } catch (error) {
    console.error("Task creation test failed:", error.message);
    
    // Check for specific authentication errors
    if (error.response && error.response.status === 401) {
      console.error("Authentication error detected. Token may be invalid or expired.");
      // Debug token format but don't print actual token content
      console.log("Token length:", token.length);
      if (token.includes('.')) {
        console.log("Token contains periods, which is expected for a JWT");
        const parts = token.split('.');
        console.log("Token has", parts.length, "parts separated by periods");
      } else {
        console.log("WARNING: Token does not contain periods, which is unexpected for a JWT");
      }
    }
    
    // Provide detailed error information
    const errorInfo = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? {
          contentType: error.config?.headers['Content-Type'],
          authorization: "present but hidden for security"
        } : null
      }
    };
    
    console.error("Detailed error info:", errorInfo);
    
    return { 
      success: false, 
      error: `Task creation failed: ${error.message}`,
      errorDetails: errorInfo
    };
  }
};

export { testAPIConnection, checkCORSIssues, testTaskCreation }; 