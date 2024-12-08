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
            "url('https://png.pngtree.com/thumb_back/fh260/background/20231008/pngtree-d-rendering-a-virtual-home-on-a-tablet-perfect-for-property-image_13568648.png')",
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
