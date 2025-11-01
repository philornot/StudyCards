import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            📚 Study Cards
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;