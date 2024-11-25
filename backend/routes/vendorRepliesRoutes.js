const express = require("express");
const Property = require("../models/Properties");

const router = express.Router();

router.post("/:propertyId/add-review", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { customerName, customerEmail, reviewText, rating } = req.body;

    // Validate input
    if (!customerName || !customerEmail || !reviewText || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Find the property by ID
    const property = await Property.findById(propertyId);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }

    // Add the new review
    property.reviews.push({ customerName, customerEmail, reviewText, rating });

    // Update average ratings
    const totalRatings = property.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    property.avgRatings = totalRatings / property.reviews.length;

    // Save the property
    await property.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully!",
      property,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Add a reply to a specific review
router.post("/:propertyId/review/:reviewIndex/reply", async (req, res) => {
  try {
    const { propertyId, reviewIndex } = req.params;
    const { replyText, repliedBy } = req.body;

    if (!replyText || !repliedBy) {
      return res.status(400).json({
        success: false,
        message: "Reply text and repliedBy are required.",
      });
    }

    // Find the product by ID
    const property = await Property.findById(propertyId);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Validate review index
    if (!property.reviews[reviewIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    // Add the reply to the specified review
    const reply = {
      replyText,
      repliedBy,
      createdAt: new Date(),
    };
    property.reviews[reviewIndex].replies.push(reply);

    // Save the product
    await property.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully!",
      review: property.reviews[reviewIndex],
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
