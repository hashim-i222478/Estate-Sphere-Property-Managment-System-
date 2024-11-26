import React, { useState } from "react";
import "./Navbar.css"; // Include the CSS file for styling
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); //this is a state variable that will be used to toggle the navbar menu usestate is a react hook that allows you to add state to functional components "use satre is a react hook that allows you to add state to functional components and "

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-logo">
          <img
            src="https://www.realproperty.pk/assets/4eda390c/rp-whit-n-green-logo.png "
            alt="RealProperty Logo"
          />

        </div>

        {/* Hamburger Menu (Mobile View) */}
        <div className="navbar-hamburger" onClick={toggleMenu}>
          {isOpen ? "✖" : "☰"}
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/ViewProperties">Properties</a> 
          </li>
          <li>
            <a href="/favorites">Favorites</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li className="navbar-buttons">
            <a href="/login" className="btn btn-outline">
              Login
            </a>
            <a href="/SignUp" className="btn btn-primary">
              Register
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
