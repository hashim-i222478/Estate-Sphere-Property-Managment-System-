import React from "react";
import AdminFooter from "../../components/AdminComponents/adminFooter";
import AdminHeader from "../../components/AdminComponents/adminHeader";
import "../../Styles/adminpages/adminlandingpage.css";

const AdminLandingPage = () => {
  return (
    <div className="landing-page">
        <div
          className="hero"
          style={{
            background:
          "url('https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') no-repeat center center fixed",
            backgroundSize: 'cover',
            width: '100%',
            height: '100vh',
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
