import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Customercomponents/Navbar";
import Footer from "../../components/Customercomponents/footer";
import MaintenanceRequestModal from "./MaintenanceRequestModal"; // Import the modal component
import "../../Styles/customer/BookedProperties.css";
import propimg from "./prop.jpg";
const BookedProperties = () => {
  const [bookedProperties, setBookedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState({});
  const [showModal, setShowModal] = useState(false); // Show/Hide Modal state
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  // Fetch booked properties
  const fetchBookedProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookedProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booked properties:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedProperties();
  }, []);

  const handleRequestMaintenance = (propertyId) => {
    setSelectedPropertyId(propertyId); // Set the propertyId for the maintenance request
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedPropertyId(null);
  };

  // Handle review text change
  const handleReviewTextChange = (propertyId, value) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [propertyId]: {
        ...prevReviews[propertyId],
        reviewText: value,
      },
    }));
  };

  // Handle star click
  const handleStarClick = (propertyId, starValue) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [propertyId]: {
        ...prevReviews[propertyId],
        rating: starValue,
      },
    }));
  };

  // Handle review submit
  const handleReviewSubmit = async (propertyId) => {
    const { reviewText, rating } = reviews[propertyId] || {};

    if (!reviewText || rating === null) {
      return alert("Review text and rating are required");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return alert("You need to be logged in to submit a review.");
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/properties/review/${propertyId}`,
        { reviewText, rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert("Review submitted successfully!");
        setReviews((prevReviews) => ({
          ...prevReviews,
          [propertyId]: { reviewText: "", rating: null },
        }));
        fetchBookedProperties(); // Refresh properties
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  // Filter properties based on search query (Check if 'property' and 'property.title' exist)
  const filteredProperties = bookedProperties.filter((property) =>
    property?.property?.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div style={{
        backgroundImage: `url(${propimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

        
      }}>
      <div className="booked-properties-container" >
        <h2>Your Booked Properties</h2>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search your booked properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading your booked properties...</p>
        ) : filteredProperties.length > 0 ? (
          <div className="properties-grid">
            {filteredProperties.map((property) => (
              <div key={property._id} className="property-card">
                <img
                  src={propimg}
                  alt={property?.property?.title || "Property Image"}
                  className="property-image"
                />
                <div className="property-details">
                  <h3>{property?.property?.title || "Untitled Property"}</h3>
                  <p>{property?.property?.address || "Address not available"}</p>
                  <p>Price: ${property?.property?.price || "Not available"}</p>
                  <p>Area: {property?.property?.area || "N/A"} sqft</p>
                </div>

                {/* Maintenance Button */}
                <button
                  className="maintenance-button"
                  onClick={() => handleRequestMaintenance(property?.property?._id)}
                >
                  Request Maintenance
                </button>

                {/* Review Section */}
                <div className="review-section">
                  <textarea
                    placeholder="Write a review..."
                    className="review-textarea"
                    value={reviews[property?.property?._id]?.reviewText || ""}
                    onChange={(e) =>
                      handleReviewTextChange(property?.property?._id, e.target.value)
                    }
                  ></textarea>

                  {/* Star Rating */}
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${
                          star <= (reviews[property?.property?._id]?.rating || 0)
                            ? "filled"
                            : ""
                        }`}
                        onClick={() => handleStarClick(property?.property?._id, star)}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleReviewSubmit(property?.property?._id)}
                    className="review-submit-button"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No booked properties found.</p>
        )}
      </div>

      {/* Modal for Maintenance Request */}
      {showModal && (
        <MaintenanceRequestModal
          propertyId={selectedPropertyId}
          onClose={handleCloseModal}
          onRequestSubmitted={fetchBookedProperties}
        />
      )}
</div>
      <Footer />
    </>
  );
};

export default BookedProperties;
