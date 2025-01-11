import { useState } from 'react';
import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Header(props) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    props.onSearch(value);
  };

  return (
    <nav className="header mb-4">
      <h1>{props.title}</h1>
      {props.searchBar && (
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
  onSearch: PropTypes.func
};