import React, { useState, useEffect } from 'react';
import { testAPIConnection, checkCORSIssues, testTaskCreation } from '../utils/apiTester';
import { FirebaseAuthService } from '../services/apiService';
import { auth } from '../auth/firebaseConfig';
import { getIdToken } from 'firebase/auth';

const Debug = () => {
  const [apiTestResult, setApiTestResult] = useState(null);
  const [corsTestResult, setCorsTestResult] = useState(null);
  const [taskTestResult, setTaskTestResult] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Get token from localStorage
    const firebaseToken = localStorage.getItem('firebaseToken');
    if (firebaseToken) {
      setToken(firebaseToken);
    }
  }, []);

  const runApiTest = async () => {
    setLoading(true);
    try {
      const result = await testAPIConnection();
      setApiTestResult(result);
    } catch (error) {
      setApiTestResult({ 
        success: false, 
        error: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const runCorsTest = async () => {
    setLoading(true);
    try {
      const result = await checkCORSIssues();
      setCorsTestResult(result);
    } catch (error) {
      setCorsTestResult({ 
        success: false, 
        error: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const runTaskTest = async () => {
    setLoading(true);
    try {
      const result = await testTaskCreation(token);
      setTaskTestResult(result);
    } catch (error) {
      setTaskTestResult({ 
        success: false, 
        error: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setRefreshing(true);
    try {
      // Check if user is logged in
      if (!auth.currentUser) {
        alert('No user is logged in. Please log in first.');
        setRefreshing(false);
        return;
      }
      
      // Force token refresh
      try {
        await auth.currentUser.getIdToken(true); // Force refresh
        const newToken = await getIdToken(auth.currentUser);
        
        // Update state and localStorage
        setToken(newToken);
        FirebaseAuthService.setToken(newToken);
        
        alert('Firebase token refreshed successfully!');
      } catch (error) {
        console.error('Error refreshing token:', error);
        alert(`Error refreshing token: ${error.message}`);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const updateToken = () => {
    if (token) {
      FirebaseAuthService.setToken(token);
      alert('Token updated in localStorage');
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4>API Debugging Tools</h4>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <h5>Authentication Status</h5>
            <p>Current user: {auth.currentUser ? auth.currentUser.email : 'Not logged in'}</p>
            <div className="d-flex">
              <button 
                className="btn btn-warning me-2" 
                onClick={refreshToken}
                disabled={refreshing || !auth.currentUser}
              >
                {refreshing ? 'Refreshing...' : 'Refresh Firebase Token'}
              </button>
              <a href="/login" className="btn btn-outline-primary">
                Go to Login
              </a>
            </div>
          </div>
          
          <hr />
          
          <div className="mb-4">
            <h5>1. Test Basic API Connection</h5>
            <p>Tests if the backend API is reachable</p>
            <button 
              className="btn btn-outline-primary" 
              onClick={runApiTest}
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Run Test'}
            </button>
            
            {apiTestResult && (
              <div className={`alert mt-2 ${apiTestResult.success ? 'alert-success' : 'alert-danger'}`}>
                <strong>{apiTestResult.success ? 'Success!' : 'Failed!'}</strong>
                <p>{apiTestResult.message || apiTestResult.error}</p>
                {apiTestResult.status && <p>Status: {apiTestResult.status}</p>}
                <pre className="mt-2 bg-light p-2 rounded">
                  {JSON.stringify(apiTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h5>2. Test CORS Configuration</h5>
            <p>Checks if CORS is properly configured on the backend</p>
            <button 
              className="btn btn-outline-primary" 
              onClick={runCorsTest}
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Run Test'}
            </button>
            
            {corsTestResult && (
              <div className={`alert mt-2 ${corsTestResult.success ? 'alert-success' : 'alert-danger'}`}>
                <strong>{corsTestResult.success ? 'Success!' : 'Failed!'}</strong>
                <p>{corsTestResult.message || corsTestResult.error}</p>
                <pre className="mt-2 bg-light p-2 rounded">
                  {JSON.stringify(corsTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h5>3. Test Task Creation</h5>
            <p>Tests the POST endpoint for creating tasks</p>
            
            <div className="mb-3">
              <label htmlFor="token" className="form-label">Firebase Token:</label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control"
                  id="token"
                  value={token}
                  onChange={handleTokenChange}
                  placeholder="Enter Firebase token"
                />
                <button className="btn btn-secondary" onClick={updateToken}>
                  Update in Storage
                </button>
              </div>
              <div className="form-text">
                Current token: {token ? token.substring(0, 15) + '...' : 'None'}
              </div>
            </div>
            
            <button 
              className="btn btn-outline-primary" 
              onClick={runTaskTest}
              disabled={loading || !token}
            >
              {loading ? 'Testing...' : 'Test Task Creation'}
            </button>
            
            {taskTestResult && (
              <div className={`alert mt-2 ${taskTestResult.success ? 'alert-success' : 'alert-danger'}`}>
                <strong>{taskTestResult.success ? 'Success!' : 'Failed!'}</strong>
                <p>{taskTestResult.message || taskTestResult.error}</p>
                <pre className="mt-2 bg-light p-2 rounded">
                  {JSON.stringify(taskTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug; 