import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../Styles/customerpages/PropertyDetails.css";
import axios from "axios";

const PropertyDetails = ({ property, onClose }) => {
  if (!property) return null; // Return null if no property is passed

  const [reviewText, setReviewText] = useState(""); // Review text input
  const [rating, setRating] = useState(0); // Rating input
  const [updatedProperty, setUpdatedProperty] = useState(property); // Dynamically update property state

  const handleAddReview = async () => {
    if (!reviewText || rating <= 0) {
      alert("Please provide both review text and a valid rating.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to add a review.");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.post(
        `/api/properties/review/${property._id}`,
        {
          reviewText,
          rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update property state with new review
      const newReview = {
        customerName: response.data.customerName,
        customerEmail: response.data.customerEmail,
        reviewText,
        rating,
        createdAt: new Date().toISOString(),
      };

      setUpdatedProperty((prevState) => ({
        ...prevState,
        reviews: [...prevState.reviews, newReview],
      }));

      // Clear inputs
      setReviewText("");
      setRating(0);
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        {property.picture && (
          <img
            src={property.picture || "https://via.placeholder.com/500"}
            alt={property.title}
            className="modal-image"
          />
        )}
        <h2>{property.title}</h2>
        <p>
          <strong>Location:</strong> {property.address}
        </p>
        <p>
          <strong>Area:</strong> {property.area} sqft
        </p>
        <p>
          <strong>Price:</strong> ${property.price}
        </p>
        <p>
          <strong>Description:</strong> {property.description}
        </p>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3>Customer Reviews</h3>
          {updatedProperty.reviews && updatedProperty.reviews.length > 0 ? (
            updatedProperty.reviews.map((review, index) => (
              <div key={index} className="review">
                <h4>{review.customerName}</h4>
                <p>{review.reviewText}</p>
                <p>
                  <strong>Rating:</strong> {review.rating} / 5
                </p>
                <p>
                  <em>
                    Reviewed on:{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </em>
                </p>
                <hr />
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this property!</p>
          )}
        </div>

        {/* Add Review Section */}
        <div className="add-review-section">
          <h3>Add Your Review</h3>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} Star{value > 1 && "s"}
              </option>
            ))}
          </select>
          <button onClick={handleAddReview} className="add-review-button">
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

PropertyDetails.propTypes = {
  property: PropTypes.object.isRequired, // The property object
  onClose: PropTypes.func.isRequired, // Function to close the modal
};

export default PropertyDetails;
