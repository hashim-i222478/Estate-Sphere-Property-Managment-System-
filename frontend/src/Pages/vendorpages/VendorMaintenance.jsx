import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../Styles/vendorpages/vendormaintenance.css";

const VendorMaintenance = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract vendorId from query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vendor/maintenance/maintenance-requests/${vendorId}`
        );
        setProperties(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching maintenance requests:", err);
        setError("Failed to load maintenance requests.");
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleStatusChange = async (propertyId, requestId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/vendor/maintenance/maintenance-requests/${propertyId}/request/${requestId}/status`,
        { status: newStatus }
      );
      // Update the property data after status change
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property._id === propertyId
            ? {
                ...property,
                maintenanceRequests: property.maintenanceRequests.map(
                  (request) =>
                    request._id === requestId
                      ? { ...request, status: newStatus }
                      : request
                ),
              }
            : property
        )
      );
    } catch (error) {
      console.error("Error updating maintenance request status:", error);
    }
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <br />
      <div className="maintenance-page-container">
        {/* Main Header */}
        <h1>Maintenance Requests</h1>

        {/* Featured Properties */}
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="property-section">
              {/* Property Information */}
              <div className="property-card_2">
                <img
                  src={`http://localhost:5000/uploads/${property.picture}`}
                  alt={property.title}
                  className="property-image_2"
                />
                <div className="property-details_2">
                  <h2>{property.title}</h2>
                  <p>
                    <strong>Address:</strong> {property.address}
                  </p>
                  <p>
                    <strong>Area:</strong> {property.area} sqft
                  </p>
                  <p>
                    <strong>Price:</strong> ${property.price}
                  </p>
                </div>
              </div>

              {/* Maintenance Requests */}
              <div className="maintenance-requests">
                <h3>Maintenance Requests</h3>
                {property.maintenanceRequests.length > 0 ? (
                  property.maintenanceRequests.map((request) => (
                    <div className="request-card" key={request._id}>
                      <p>
                        <strong>Request:</strong> {request.requestText}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <select
                          value={request.status}
                          onChange={(e) =>
                            handleStatusChange(
                              property._id,
                              request._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </p>
                      <p>
                        <strong>Requested By:</strong>{" "}
                        {request.requestedBy
                          ? `${request.requestedBy.name} (${request.requestedBy.email})`
                          : "Unknown"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No requests found for this property.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No properties found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VendorMaintenance;
