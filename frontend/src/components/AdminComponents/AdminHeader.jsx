import React, { useEffect, useState } from "react";
import "../../Styles/components/header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import DefaultProfileIcon from "../../assets/profile-icon.png"; // Default profile icon image

const AdminHeader = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(DefaultProfileIcon);
  const [menuOpen, setMenuOpen] = useState(false); // State for side menu toggle
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please log in.");
      navigate("/login");
    } else {
      axios
        .post(
          "http://localhost:5000/api/protected/verify-token",
          {},
          { headers: { Authorization: `Bearer ${token}` } } // Pass token in Authorization header
        )
        .then((response) => {
          setEmail(response.data.user.email);
          setRole(response.data.user.role);
          setProfilePicture(response.data.user.picture);
        })
        .catch(() => {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, []);


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/adminprofile");
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <img
            src="https://www.realproperty.pk/assets/4eda390c/rp-whit-n-green-logo.png"
            alt="RealProperty Logo"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <a href="./adminlandingpage">Home</a>
          <a href="./propertymanagement">Property Management</a>
          <a href="./usermanagement">User Management</a>
          <a href="./PropertyAnalytics">Analytics</a>
          <a href="./reports">Reports</a>
          <a href="./Reviews">Reviews</a>
          <a href="./login">Logout</a>

          <div className="profile-container">
            <img
              src={profilePicture ? `http://localhost:5000/${profilePicture}` : DefaultProfileIcon}
              alt="Admin Profile"
              className="profile-icon"
              onClick={handleProfileClick}
            />
          </div>
        </nav>

        {/* Hamburger Icon */}
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="overlay show"
            onClick={closeMenu} // Close menu when clicking outside
          ></div>
        )}

        {/* Side Menu */}
        <div className={`side-menu ${menuOpen ? "open" : ""}`}>
          <a href="./adminlandingpage" onClick={closeMenu}>Home</a>
          <a href="./propertymanagement" onClick={closeMenu}>Property Management</a>
          <a href="./usermanagement" onClick={closeMenu}>User Management</a>
          <a href="./analytics" onClick={closeMenu}>Analytics</a>
          <a href="./reports" onClick={closeMenu}>Reports</a>
          <a href="./Reviews" onClick={closeMenu}>Reviews</a>
          <a href="./login" onClick={closeMenu}>Logout</a>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
