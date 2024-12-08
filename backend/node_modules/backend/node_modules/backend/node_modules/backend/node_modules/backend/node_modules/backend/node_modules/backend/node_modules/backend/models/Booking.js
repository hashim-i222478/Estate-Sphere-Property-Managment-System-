const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members", // Link to the Members schema
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property", // Link to the Properties schema
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("Booking", BookingSchema);