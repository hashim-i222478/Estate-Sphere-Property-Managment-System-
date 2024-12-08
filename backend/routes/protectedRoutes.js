const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const MemberModel = require("../models/Members");

const router = express.Router();

// Example Protected Route
router.post("/verify-token", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
});
router.post("/get_id", verifyToken, async (req, res) => {
  const id = req.user._id;
  const user = await MemberModel.findById(id);
  res.status(200).json({ message: "This is a protected route", user: user });
});

module.exports = router;
