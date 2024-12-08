import React from "react";
import "../Styles/components/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-about">
          <img
            src="https://www.realproperty.pk/assets/4eda390c/rp-whit-n-green-logo.png"
            alt="RealProperty Logo"
            className="footer-logo"
          />
          <p>
            Realproperty.pk - Pakistan's best free property listings website.
            Trusted place to investing, renting, buying & selling online.
          </p>
          <p>Follow us on:</p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/realproperty.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.pinterest.com/realpropertypk/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-pinterest-p"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/realproperty-pk/?originalSubdomain=pk"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Quick Links Searches</h4>
          <ul>
            <li>Property for Rent</li>
            <li>Property for Sale</li>
            <li>Society Maps</li>
            <li>News & Guide</li>
          </ul>
        </div>
        <div className="footer-company">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Place Free Ad</li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>1st Floor Habib Tower, Main Boulevard</p>
          <p>Valencia Town, Lahore</p>
          <p>Email: info@realproperty.pk</p>
          <p>Phone: +92 320 145 00 92</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© RealProperty.pk 2024. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
