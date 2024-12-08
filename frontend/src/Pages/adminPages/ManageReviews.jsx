import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminComponents/adminHeader";
import AdminFooter from "../../components/AdminComponents/adminFooter";
import "../../Styles/adminpages/managereviews.css";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("");
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/reviews");
      if (response.data.success) {
        setReviews(response.data.reviews);
      } else {
        alert("Failed to fetch reviews.");
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      alert("Failed to fetch reviews: " + error.message);
    }
  };

  const fetchReviewsByRating = async () => {
    if (!ratingFilter) {
      fetchAllReviews();
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/reviews/rating/${ratingFilter}`
      );
      if (response.data.success) {
        setReviews(response.data.reviews);
      } else {
        alert("Failed to fetch filtered reviews.");
      }
    } catch (error) {
      console.error("Failed to fetch reviews by rating:", error);
      alert("Failed to fetch reviews: " + error.message);
    }
  };

  const handleSortByRating = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/reviews/sort/rating");
      if (response.data.success) {
        setReviews(response.data.reviews);
        setIsSorted(true);
      } else {
        alert("Failed to sort reviews.");
      }
    } catch (error) {
      console.error("Failed to sort reviews:", error);
      alert("Failed to sort reviews: " + error.message);
    }
  };

  const handleDeleteReview = async (customerEmail, reviewText) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await axios.delete("http://localhost:5000/api/admin/reviews", {
          data: { customerEmail, reviewText },
        });

        if (response.data.success) {
          setReviews(reviews.filter(
            (review) =>
              review.customerEmail !== customerEmail || review.reviewText !== reviewText
          ));
          alert("Review deleted successfully.");
        } else {
          alert("Failed to delete review: " + response.data.message);
        }
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Failed to delete review: " + error.message);
      }
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="heading">
        <h2>All Property Reviews</h2>
        <p>View and manage all reviews left by customers on your properties.</p>
      </div>

      <div className="filters">
        <input
          type="number"
          placeholder="Filter by Rating (1-5)"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        />
        <button onClick={fetchReviewsByRating} className="filter-button">
          Apply Filter
        </button>
        <button onClick={fetchAllReviews} className="reset-button">
          Reset Filters
        </button>
        <button onClick={handleSortByRating} className="sort-button">
          Sort by Rating
        </button>
      </div>

      <div className="reviews-container">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={`${review.customerEmail}-${review.reviewText}`} className="review-item">
              <p>
                <strong>Property Title:</strong> {review.propertyTitle}
              </p>
              <p>
                <strong>Property Address:</strong> {review.propertyAddress}
              </p>
              <p>
                <strong>Customer:</strong> {review.customerName}
              </p>
              <p>
                <strong>Email:</strong> {review.customerEmail}
              </p>
              <p>
                <strong>Review:</strong> {review.reviewText}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <button
                className="delete-button"
                onClick={() => handleDeleteReview(review.customerEmail, review.reviewText)}
              >
                Delete Review
              </button>
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
      <AdminFooter />
    </>
  );
};

export default ManageReviews;
