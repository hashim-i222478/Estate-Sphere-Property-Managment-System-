const mongoose = require("mongoose");

// Define the Reply schema
const replySchema = new mongoose.Schema(
  {
    replyText: {
      type: String,
      required: [true, "Reply text is required"],
      maxlength: [500, "Reply cannot exceed 500 characters"],
    },
    repliedBy: {
      type: String, // The person who replied (could be the owner or admin)
      required: [true, "Replied by field is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Prevent Mongoose from automatically adding an _id field for replies
);

// Define the Review schema
const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
    },
    reviewText: {
      type: String,
      required: [true, "Review text is required"],
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    replies: [replySchema],
  },
  { _id: false } // Prevent Mongoose from automatically adding an _id field for reviews
);

// Define the Property schema
const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String, // Stores the URL or file path of the property picture
      required: false, // Optional field
    },
    area: {
      type: Number, // Area in square feet or square meters
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members", // Reference to the User model
      required: true,
    },
    availability: {
      type: Boolean,
      default: true, // Property is available by default
    },
    reviews: [reviewSchema], // Add reviews field
    avgRatings: {
      type: Number,
      default: 0,
      min: [0, "Ratings cannot be less than 0"],
      max: [5, "Ratings cannot be more than 5"],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Property", PropertySchema);
