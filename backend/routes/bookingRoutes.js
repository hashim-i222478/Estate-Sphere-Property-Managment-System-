const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Property = require("../models/Properties");
const Booking = require("../models/Booking");

// Endpoint to book a property
router.post("/:propertyId/book", verifyToken, async (req, res) => {
  const { propertyId } = req.params;
  const customerId = req.user._id; // Retrieved from the token

  try {
    // Fetch the property to ensure it exists and is available
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (!property.availability) {
      return res.status(400).json({ error: "Property is not available for booking" });
    }

    // Check if the property is already booked by the user
    const existingBooking = await Booking.findOne({
      user: customerId,
      property: propertyId,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: "You have already booked this property" });
    }

    // Create the booking
    const booking = new Booking({
      user: customerId,
      property: propertyId,
      startDate: req.body.startDate || new Date(), // Default to today if not provided
      endDate: req.body.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to one week from now if not provided
      status: "pending",
    });

    // Save the booking
    await booking.save();

    // Mark the property as unavailable
    property.availability = false;
    await property.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to book property" });
  }
});


//get all bookings for the customer

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; // Get the logged-in user ID from the token
    const bookings = await Booking.find({ user: userId }).populate("property");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;
