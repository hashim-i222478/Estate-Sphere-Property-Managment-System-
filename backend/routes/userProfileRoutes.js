const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const MemberModel = require("../models/Members");

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

router.post("/upload-profile-picture",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const email = req.body.email;
      const profilePicPath = `uploads\\${req.file.filename}`;

      const result = await MemberModel.updateOne(
        { email: email },
        {
          $set: { profilePicture: profilePicPath },
        }
      );

      if (result.nModified === 0) {
        return res.json({
          message: "User not found or profile picture was not updated",
        });
      }
      res.json({
        message: "Profile picture uploaded successfully!",
        profilePicPath,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({
        message: "An error occurred while uploading the profile picture",
        error: error.message,
      });
    }
  }
);

// Update Profile Route
router.post("/update-profile", async (req, res) => {
  const { name, username, email, phone, address, bio, role } = req.body;

  try {
    // Find the user by their email
    console.log(username);
    const user = await MemberModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile
    if (name) user.name = name;
    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (bio) user.bio = bio;
    if (role) user.role = role;

    console.log(user);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
});

// Route to update password
router.post("/update-password", async (req, res) => {
  const { currentPassword, newPassword, email } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    // Find the user by email
    const user = await MemberModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Update account settings
router.post("/update-account-settings", async (req, res) => {
  try {
    const { email, notifications, accountVisibility, accountStatus } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const updatedUser = await MemberModel.findOneAndUpdate(
      { email }, // Match user by email
      {
        notifications,
        accountVisibility,
        accountStatus,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.json({
      success: true,
      message: "Account settings updated successfully.",
    });
  } catch (error) {
    console.error("Error updating account settings:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get User Profile Route
router.get("/profile", async (req, res) => {
  const { email } = req.query;

  try {
    // Find the user by their email
    const user = await MemberModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's profile
    res.status(200).json({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      profilePicture: user.profilePicture,
      notifications: user.notifications,
      accountVisibility: user.accountVisibility,
      accountStatus: user.accountStatus,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "An error occurred while fetching the profile." });
  }
});

// Get All Users Route
router.get("/all-users", async (req, res) => {
  try {
    const users = await MemberModel.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "An error occurred while fetching all users." });
  }
});

// Delete a user
router.post("/delete-user", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required for deletion." });
    }
    const deletedUser = await MemberModel.findOneAndDelete({ email });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user." });
  }
});


// Add a new user
router.post("/add-user", async (req, res) => {
  const { name, username, email, phone, address, bio, password, role } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {
    // Check if the user already exists
    const existingUser = await MemberModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new MemberModel({
      name,
      username,
      email,
      phone,
      address,
      role,
      bio,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "An error occurred while adding the user." });
  }
});


module.exports = router;
