const mongoose = require("mongoose");

const FavoritesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members", // Reference to the Members (users)
      required: true,
    },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property", // Reference to the Property model
        required: true,
      },
    ],
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt
  }
);

module.exports = mongoose.model("Favorites", FavoritesSchema);
