import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logOut } from '../auth/authService';

export default function Header(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    props.onSearch(value);
  };
  
  const handleLogout = async () => {
    try {
      const response = await logOut();
      if (response.success) {
        navigate('/login');
      } else {
        alert("Failed to logout. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="header mb-4">
      <h1>{props.title}</h1>
      
      <div className="d-flex justify-content-center my-3">
        {props.user ? (
          <div className="d-flex align-items-center">
            <div className="profile-container me-3">
              <div className="profile-icon" title={props.user.email}>
                <i className="fas fa-user-circle"></i>
                <span className="email-tooltip">{props.user.email}</span>
              </div>
            </div>
            <button 
              className="btn btn-outline-light" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
            <Link to="/register" className="btn btn-outline-light">Register</Link>
          </div>
        )}
      </div>
      
      {props.searchBar && props.user && (
        <div className="search-container mt-3">
          <div className="input-group" style={{maxWidth: '400px', margin: '0 auto'}}>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  searchBar: PropTypes.bool.isRequired,
  onSearch: PropTypes.func,
  user: PropTypes.object
};