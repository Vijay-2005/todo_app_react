import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logIn, resendVerificationEmail } from '../auth/authService';
import { auth } from '../auth/firebaseConfig';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { FirebaseAuthService } from '../services/apiService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();
  
  // Check if already logged in
  useEffect(() => {
    console.log("Login page - checking auth status");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User already logged in, redirecting to home");
        navigate('/');
      }
      setAuthChecking(false);
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationSent(false);
    
    console.log("Login attempt with:", email);
    
    try {
      console.log("Calling logIn function...");
      const response = await logIn(email, password);
      console.log("Login response:", response);
      
      if (response.success) {
        // Login successful
        console.log("Login successful, getting Firebase token");
        
        try {
          // Get the Firebase token manually and store it
          const token = await getIdToken(response.user);
          console.log("Got Firebase token:", token.substring(0, 10) + "...");
          
          // Store the token in localStorage
          FirebaseAuthService.setToken(token);
          
          // Navigate to home
          console.log("Token saved, navigating to home");
          navigate('/');
        } catch (tokenError) {
          console.error("Error getting Firebase token:", tokenError);
          setError("Failed to authenticate with the server. Please try again.");
        }
      } else if (response.emailVerification) {
        // Email not verified case
        setError(response.error);
        setCurrentUser(response.user);
      } else {
        // Other login failures
        console.error("Login failed:", response.error);
        setError(response.error || 'Failed to login. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const result = await resendVerificationEmail(currentUser);
      if (result.success) {
        setVerificationSent(true);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to resend verification email.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="container text-center py-5 fade-in">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-light">Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="auth-card">
            <div className="card-body">
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Log in to access your todos</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                  {currentUser && (
                    <div className="mt-2">
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleResendVerification}
                        disabled={loading || verificationSent}
                      >
                        Resend Verification Email
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {verificationSent && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Verification email sent! Please check your inbox.
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <div className="form-floating">
                    <input 
                      type="email" 
                      className="form-control custom-input" 
                      id="email"
                      placeholder=" " 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                    <label htmlFor="email"><i className="fas fa-envelope me-2"></i>Email address</label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-floating">
                    <input 
                      type="password" 
                      className="form-control custom-input" 
                      id="password"
                      placeholder=" " 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                    <label htmlFor="password"><i className="fas fa-lock me-2"></i>Password</label>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="rememberMe" 
                    />
                    <label className="form-check-label text-light" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#!" className="auth-link">Forgot password?</a>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>Login
                    </>
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-light">
                    Don't have an account? <Link to="/register" className="auth-link">Register</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
