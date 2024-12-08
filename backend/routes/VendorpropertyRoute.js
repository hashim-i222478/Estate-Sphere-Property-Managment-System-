const express = require("express");
const multer = require("multer");
const Property = require("../models/Properties");
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file naming
  },
});
const upload = multer({ storage });

// Middleware to validate required fields
const validateProperty = (req, res, next) => {
  const { title, description, price, address } = req.body;
  if (!title || !description || !price || !address) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled." });
  }
  next();
};

// Add a new property
router.post("/add-property", upload.single("picture"), (req, res) => {
  const { title, description, price, address, _id, area } = req.body;
  const picture = req.file ? req.file.filename : null;

  try {
    const newProperty = new Property({
      title: title,
      description: description,
      price: price,
      address: address,
      owner: _id,
      area: area,
      picture: picture,
    });
    newProperty.save();
    res.status(201).json({
      message: "Property added successfully!",
      property: newProperty,
    });
  } catch (err) {
    console.error("Error adding property:", err);
    res.status(500).json({ message: "Server error while adding property." });
  }
});

// Fetch all properties
router.get("/get_properties/:vendorId", async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.params.vendorId });
    res.status(200).json({ properties });
  } catch (err) {
    console.error("Error fetching properties:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching properties." });
  }
});

// Update property details
router.post("/edit-property", upload.single("picture"), async (req, res) => {
  try {
    const {
      editProperty,
      title,
      description,
      price,
      address,
      availability,
      area,
    } = req.body;
    if (!editProperty) {
      return res
        .status(400)
        .json({ message: "Property ID is required for updating." });
    }

    // Set the picture if a new one is provided
    const updatedData = {
      title,
      description,
      price,
      address,
      availability,
      area,
    };

    const _id = editProperty;

    if (req.file) {
      updatedData.picture = req.file ? req.file.filename : null; // Store file path
    }

    // Update the property in the database
    const updatedProperty = await Property.findByIdAndUpdate(_id, updatedData, {
      new: true, // Return updated property after the update
    });

    res.status(200).json({
      message: "Property updated successfully!",
      property: updatedProperty,
    });
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ message: "Server error while updating property." });
  }
});

// Delete a property
router.post("/delete-property", async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ message: "Property ID is required for deletion." });
    }
    const deletedProperty = await Property.findByIdAndDelete(_id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found." });
    }
    res.status(200).json({ message: "Property deleted successfully!" });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ message: "Server error while deleting property." });
  }
});

module.exports = router;
