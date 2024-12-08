const express = require("express");
const router = express.Router();
const Property = require("../models/Properties"); // Import the Property model
const verifyToken = require("../middlewares/authMiddleware"); // Import the middleware for JWT verification

// Route 1: Get all properties with filters
router.get("/", async (req, res) => {
  try {
    const { location, minPrice, maxPrice, sortBy, order } = req.query;

    // Build the filter object
    const filter = {};
    if (location) filter.address = { $regex: location, $options: "i" }; // Case-insensitive location filter
    if (minPrice) filter.price = { $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    // Build the sort object (default: sort by price ascending)
    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // Fetch properties with filters and sorting
    const properties = await Property.find(filter).sort(sortOptions);

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// Route 2: Add a review to a property (requires authentication)
router.post("/review/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewText, rating } = req.body;

    // Validate input
    if (!reviewText || rating == null) {
      return res.status(400).json({ error: "Review text and rating are required" });
    }

    // Find the property by ID
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Add the review to the property
    const newReview = {
      customerName: req.user.name,
      customerEmail: req.user.email,
      reviewText,
      rating,
      createdAt: new Date(),
    };
    property.reviews.push(newReview);

    // Update the average rating
    const totalRatings = property.reviews.reduce((sum, review) => sum + review.rating, 0);
    property.avgRatings = totalRatings / property.reviews.length;

    await property.save();

    res.status(201).json({ message: "Review added successfully!", newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
});



router.get("/top-rated", async (req, res) => {
  try {
    const { limit } = req.query; // Allow client to specify the limit
    const topLimit = Number(limit) || 10; // Default to top 10 if limit not provided

    // Fetch properties sorted by avgRatings in descending order
    const topProperties = await Property.find({ availability: true }) // Only available properties
      .sort({ avgRatings: -1 }) // Sort by avgRatings (highest first)
      .limit(topLimit); // Limit the results

    if (topProperties.length === 0) {
      return res.status(404).json({ message: "No properties found." });
    }

    res.status(200).json({
      message: `Top ${topProperties.length} properties fetched successfully.`,
      properties: topProperties,
    });
  } catch (error) {
    console.error("Error fetching top-rated properties:", error);
    res.status(500).json({ error: "Failed to fetch top-rated properties." });
  }
});

// Route: Get property details by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the property by ID
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property details:", error);
    res.status(500).json({ error: "Failed to fetch property details." });
  }
});



module.exports = router;
