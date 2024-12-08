import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
    

    } else {
      axios
        .post(
          "http://localhost:5000/api/protected/verify-token",
          {},
          { headers: { Authorization: `Bearer ${token}` } } // Pass token in Authorization header
        )
        .then((response) => {
          setIsLoggedIn(true);
          setUserImage(response.data.user.picture);

        })
        .catch(() => {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, []);
 
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img
              src="https://www.realproperty.pk/assets/4eda390c/rp-whit-n-green-logo.png"
              alt="RealProperty Logo"
            />
          </Link>
        </div>

        {/* Hamburger Menu */}
        <div className="navbar-hamburger" onClick={toggleMenu}>
          {isOpen ? "✖" : "☰"}
        </div>

        {/* Links */}
        <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/ViewProperties">Properties</Link>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Link to="/favorites">Favorites</Link>
              </li>
              <li>
                <Link to="/bookedproperties">Booked Properties</Link>
              </li>
              <li className="navbar-profile">
                {userImage ? (
                  <img
                    src={`http://localhost:5000/${userImage}`}
                    alt="User"
                    className="profile-image"
                  />
                ) : (
                  <span className="profile-icon" aria-label="Default User Icon">🧓</span>
                )}
                <div className="dropdown-menu">
                  <Link to="/customerprofile">Edit Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/aboutus">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li className="navbar-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
