import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../Styles/vendorpages/VendorProperty.css";
import axios from "axios";

// PropertyDetails Component
const PropertyDetails = ({ property, onClose }) => {
  if (!property) return null; // If no property is passed, return null
  const [replies, setReplies] = useState({}); // To store replies for each review
  const [updatedproperty, setUpdatedproperty] = useState(property); // To update property data dynamically
  const [highlightedFields, setHighlightedFields] = useState({});

  const addReplyToReview = async (
    propertyId,
    reviewIndex,
    replyText,
    repliedBy
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/vendor/replies/${propertyId}/review/${reviewIndex}/reply`,
        {
          replyText,
          repliedBy,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply. Please try again.");
      return null;
    }
  };

  const handleReplyChange = (index, value) => {
    setReplies({ ...replies, [index]: value });
  };

  const handleReplySubmit = async (index) => {
    if (!replies[index]) {
      // Highlight the input field if empty
      setHighlightedFields({ ...highlightedFields, [index]: true });
      setTimeout(() => {
        setHighlightedFields({ ...highlightedFields, [index]: false });
      }, 2000); // Remove the highlight after 2 seconds
      return;
    }

    const repliedBy = "Vendor"; // Replace with the current user's name or role
    const propertyId = property._id;

    const result = await addReplyToReview(
      propertyId,
      index,
      replies[index],
      repliedBy
    );

    if (result) {
      // Update property's state with the new reply
      const updatedReviews = [...updatedproperty.reviews];
      updatedReviews[index].replies.push({
        replyText: replies[index],
        repliedBy,
      });

      setUpdatedproperty({ ...updatedproperty, reviews: updatedReviews });
      setReplies({ ...replies, [index]: "" }); // Clear the reply input field
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
            src={`http://localhost:5000/uploads/${property.picture}`}
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

        {/* Render Reviews */}
        <div className="reviews-section">
          <h3 className="reviews-title">Customer Reviews</h3>
          <div className="review-box">
            {updatedproperty.reviews.length > 0 ? (
              updatedproperty.reviews.map((review, index) => (
                <div className="review" key={index}>
                  <h4 className="review-customer-name">
                    {review.customerName}
                  </h4>
                  <p className="review-text">{review.reviewText}</p>
                  {/* Replies Section */}
                  <div className="replies-list">
                    {review.replies &&
                      review.replies.map((reply, replyIndex) => (
                        <p key={replyIndex} className="reply">
                          <strong>{reply.repliedBy}:</strong> {reply.replyText}
                        </p>
                      ))}
                  </div>
                  <div className="reply-section">
                    <div className="input-container">
                      <input
                        type="text"
                        value={replies[index] || ""}
                        onChange={(e) =>
                          handleReplyChange(index, e.target.value)
                        }
                        className={`reply-input ${
                          highlightedFields[index] ? "highlighted" : ""
                        }`}
                        placeholder="Write a reply..."
                      />
                      <button
                        onClick={() => handleReplySubmit(index)}
                        className="reply-button"
                      >
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>{" "}
                        {/* Send icon */}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PropertyDetails.propTypes = {
  property: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default PropertyDetails;
