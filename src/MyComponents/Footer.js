const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="mb-0">Copyright &copy; {new Date().getFullYear()} | Made with ❤️</p>
        
        {/* Social Media Links */}
        <div className="social-links mt-3">
          <a href="https://github.com/Vijay-2005" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://twitter.com/vijayk_360" target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com/in/vijayk360" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
