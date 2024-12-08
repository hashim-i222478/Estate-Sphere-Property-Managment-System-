import React from "react";

import "../../Styles/customer/ContactUs.css";
import Header from "../../components/Customercomponents/Navbar";
import Footer from "../../components/Customercomponents/footer";

const ContactUs = () => {
  return (
    // Contact Us Page
      

    <>
    <Header />
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you. Whether you have a question, feedback, or
          just want to say hi, feel free to reach out to us!
        </p>
      </div>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form">
          <h2>Send us a message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" placeholder="Enter your name" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="Write your message"></textarea>
            </div>

            <button type="submit" className="btn-submit">
              Submit
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>
            Feel free to contact us directly via phone or email. You can also
            find us on our social media platforms.
          </p>
          <ul>
            <li>
              <strong>Phone:</strong> +1 234 567 890
            </li>
            <li>
              <strong>Email:</strong> support@propertyzone.com
            </li>
            <li>
              <strong>Address:</strong> 123 Main Street, PropertyCity, PC 45678
            </li>
          </ul>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
     <Footer />
    </>
  );
};

export default ContactUs;
