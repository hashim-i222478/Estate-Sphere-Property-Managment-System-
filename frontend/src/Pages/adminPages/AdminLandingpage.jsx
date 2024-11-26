import React from "react";
import AdminFooter from "../../components/AdminComponents/adminFooter";
import AdminHeader from "../../components/AdminComponents/adminHeader";
import "../../Styles/adminpages/adminlandingpage.css";

const AdminLandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div
        className="hero"
        style={{
          backgroundImage:
            "url('https://www.investopedia.com/thmb/XPnvXjFTJnA8j8VBEtNc7DfduN4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/INV_Real_Property_GettyImages-200478960-001-080ea7835ec1444881eddbe3b2a5a632.jpg')",
        }}
      >
        <AdminHeader />

        <div className="hero-overlay">
          <h1>Welcome to the Admin Dashboard</h1>
          <p>Manage your real estate portfolio effectively and efficiently.</p>
        </div>
      </div>

      {/* Admin Module Section */}
      <div className="admin-module">
        <div className="container">
          <h2>Admin Tools</h2>
          <div className="features-grid">
            {['Property Management', 'Vendor Management', 'Customer Management', 'Location-Based Analytics', 'Reporting'].map((item, index) => (
              <div className="feature-item" key={index}>
                <h3>{item}</h3>
                <p>{getFeatureDescription(item)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdminFooter />
    </div>
  );
};

// Helper function to return descriptions based on feature name
const getFeatureDescription = (feature) => {
  const descriptions = {
    'Property Management': 'Update and delete property listings to keep your database current and accurate.',
    'Vendor Management': 'Register and manage vendor accounts, ensuring all your vendor information is up-to-date.',
    'Customer Management': 'Oversee customer profiles and manage interactions to enhance customer satisfaction.',
    'Location-Based Analytics': 'Utilize Google Maps for real-time insights on property popularity based on geographical data.',
    'Reporting': 'Generate and customize reports to track properties, bookings, and other essential metrics.'
  };
  return descriptions[feature];
};

export default AdminLandingPage;
