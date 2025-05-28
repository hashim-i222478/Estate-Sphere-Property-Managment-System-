const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

dotenv.config();
const connectDB = require("./config/dbConnection");
const authRoutes = require("./routes/authRoutes");
const protectedRoute = require("./routes/protectedRoutes");
const propertyRoutes = require("./routes/VendorpropertyRoute");
const userProfileRoutes = require("./routes/userProfileRoutes");
const vendorRepliesRoutes = require("./routes/vendorRepliesRoutes");
const viewPropertiesRoute = require("./routes/viewProperties");
const bookingRoutes = require("./routes/bookingRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const manageReviews = require("./routes/manageReviews");
const analytics = require("./routes/analytics");

const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this port (React frontend)
  methods: ["GET", "POST", "DELETE"],  // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

const app = express();

app.use(cors(corsOptions)); // Apply CORS options
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/protected", protectedRoute);
app.use("/api/auth", authRoutes);
app.use("/api/vendor/properties", propertyRoutes);
app.use("/api/vendor/userprofile", userProfileRoutes);
app.use("/api/vendor/replies", vendorRepliesRoutes);
app.use("/api/properties", viewPropertiesRoute);
app.use("/api/bookings", bookingRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/admin", manageReviews);
app.use("/api/booking", analytics);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
