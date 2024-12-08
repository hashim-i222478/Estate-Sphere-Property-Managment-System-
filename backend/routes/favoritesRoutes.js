const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware"); // Middleware to verify JWT token
const Favorites = require("../models/Favorites");
const Property = require("../models/Properties");

// Route: Add a property to favorites
router.post("/add/:propertyId", verifyToken, async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user._id; // Extract user ID from token

  try {
    let favorite = await Favorites.findOne({ user: userId });

    if (!favorite) {
      // If no favorites document exists for the user, create one
      favorite = new Favorites({ user: userId, properties: [] });
    }

    // Check if the property is already in favorites
    if (favorite.properties.includes(propertyId)) {
      return res.status(400).json({ message: "Property is already in your favorites" });
    }
    // Add the property to the user's favorites
    favorite.properties.push(propertyId);
    await favorite.save();

    res.status(200).json({ message: "Property added to favorites", favorite });
  } catch (error) {
    console.error("Error adding property to favorites:", error);
    res.status(500).json({ message: "Failed to add property to favorites. Please try again later." });
  }
});

// Route: Remove a property from favorites
router.delete("/remove/:propertyId", verifyToken, async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user._id; // Extract user ID from token

  try {
    const favorite = await Favorites.findOne({ user: userId });

    if (!favorite) {
      return res.status(404).json({ message: "No favorites found" });
    }

    // Remove the property from the favorites list
    favorite.properties = favorite.properties.filter(
      (propId) => propId.toString() !== propertyId
    );

    await favorite.save();

    res.status(200).json({ message: "Property removed from favorites", favorite });
  } catch (error) {
    console.error("Error removing property from favorites:", error);
    res.status(500).json({ message: "Failed to remove property from favorites. Please try again later." });
  }
});

// Route: Get all favorite properties of a user
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const favorite = await Favorites.findOne({ user: userId }).populate("properties");

    if (!favorite) {
      return res.status(404).json({ message: "No favorites found" });
    }

    res.status(200).json(favorite.properties);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Failed to fetch favorites. Please try again later." });
  }
});

module.exports = router;
