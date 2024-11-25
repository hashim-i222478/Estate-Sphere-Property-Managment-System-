import React from "react";
import "../../Styles/vendorpages/vendorlandingpage.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VendorLandingpage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div
        className="hero"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg')",
        }}
      >
        <Header />

        <div className="hero-overlay">
          <h1>Properties For Sale & Rent In Pakistan</h1>
          <p>
            Find your dream home, apartments, and commercial properties with
            trusted real estate solutions.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorLandingpage;
