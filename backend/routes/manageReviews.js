const express = require("express");
const Property = require("../models/Properties.js");

const router = express.Router();

// Get reviews for a specific property by property ID
router.get("/reviews/:propertyId", async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId, "reviews");

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    res.status(200).json({
      success: true,
      reviews: property.reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews for property:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});
// Get all reviews with property information
router.get("/reviews", async (req, res) => {
  try {
    const properties = await Property.find({}, "title address reviews");

    // Combine reviews with corresponding property information
    const allReviews = properties.reduce((acc, property) => {
      const propertyReviews = property.reviews.map((review) => ({
        ...review.toObject(),
        propertyTitle: property.title,
        propertyAddress: property.address,
      }));
      return acc.concat(propertyReviews);
    }, []);

    res.status(200).json({
      success: true,
      reviews: allReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews with property information:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});


// Get reviews filtered by rating
router.get("/reviews/rating/:rating", async (req, res) => {
  const rating = parseInt(req.params.rating);

  try {
    const properties = await Property.find({ "reviews.rating": rating }, "reviews");

    const filteredReviews = properties.reduce((acc, property) => {
      const matchingReviews = property.reviews.filter(review => review.rating === rating);
      return acc.concat(matchingReviews);
    }, []);

    res.status(200).json({
      success: true,
      reviews: filteredReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews by rating:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get reviews sorted by rating
router.get("/reviews/sort/rating", async (req, res) => {
  try {
    const properties = await Property.find({}, "reviews");

    const allReviews = properties.reduce((acc, property) => {
      return acc.concat(property.reviews);
    }, []);

    const sortedReviews = allReviews.sort((a, b) => b.rating - a.rating);

    res.status(200).json({
      success: true,
      reviews: sortedReviews,
    });
  } catch (error) {
    console.error("Error sorting reviews by rating:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});
// Delete a review by matching its details
router.delete("/reviews", async (req, res) => {
  const { customerEmail, reviewText } = req.body;

  if (!customerEmail || !reviewText) {
    return res.status(400).json({
      success: false,
      message: "Customer email and review text are required to identify the review.",
    });
  }

  try {
    // Find the property containing the review
    const property = await Property.findOne({
      "reviews.customerEmail": customerEmail,
      "reviews.reviewText": reviewText,
    });

    if (!property) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    // Filter out the specific review
    const initialReviewsCount = property.reviews.length;

    property.reviews = property.reviews.filter(
      (review) => review.customerEmail !== customerEmail || review.reviewText !== reviewText
    );

    if (property.reviews.length === initialReviewsCount) {
      return res.status(404).json({
        success: false,
        message: "No matching review found to delete.",
      });
    }

    // Save updated property
    await property.save();

    res.status(200).json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Server error occurred." });
  }
});



module.exports = router;