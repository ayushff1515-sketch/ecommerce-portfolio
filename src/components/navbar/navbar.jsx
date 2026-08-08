// src/components/Navbar/Navbar.jsx
import { NavLink } from 'react-router-dom';
import { FaHome, FaStore, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" end className="nav-link">
              <FaHome /> Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/products" className="nav-link">
              <FaStore /> Products
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className="nav-link">
              <FaInfoCircle /> About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-link">
              <FaEnvelope /> Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
