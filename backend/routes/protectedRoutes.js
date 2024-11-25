const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Example Protected Route
router.post("/verify-token", verifyToken, (req, res) => {
  console.log(req.user);
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
});
router.post("/get_id", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
