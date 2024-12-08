import React from "react";
import "./Footer.css"; // Include the CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About</h4>
          <ul>
            <li>
              <a href="/about">Company Info</a>
            </li>
            <li>
              <a href="/careers">Careers</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>
              <a href="/properties">Property Listings</a>
            </li>
            <li>
              <a href="/favorites">Favorites</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 PropertyZone. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
