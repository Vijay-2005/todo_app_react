import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../auth/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setSuccess("");
    
    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await signUp(email, password);
      if (response.success) {
        setSuccess(
          "Account created successfully! Please check your email to verify your account before logging in."
        );
        // Give user more time to read the verification message
        setTimeout(() => navigate('/login'), 5000);
      } else {
        setError(response.error || "Failed to create account.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="auth-card">
            <div className="card-body">
              <div className="auth-header">
                <h2>Create Account</h2>
                <p>Join us to start managing your tasks</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSignup}>
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
                    <div className="form-text">
                      Password must be at least 6 characters
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="form-floating">
                    <input 
                      type="password" 
                      className="form-control custom-input" 
                      id="confirmPassword"
                      placeholder=" " 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                    />
                    <label htmlFor="confirmPassword"><i className="fas fa-lock me-2"></i>Confirm Password</label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="termsCheck"
                      required
                    />
                    <label className="form-check-label text-light" htmlFor="termsCheck">
                      I agree to the <a href="#!" className="auth-link">Terms of Service</a> and <a href="#!" className="auth-link">Privacy Policy</a>
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>Register
                    </>
                  )}
                </button>
                
                <div className="text-center mt-4">
                  <p className="text-light">
                    Already have an account? <Link to="/login" className="auth-link">Login</Link>
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

export default Register;
