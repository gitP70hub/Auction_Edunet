const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Import routes
const authRoutes = require("./routes/authRoutes");
const signupRoutes = require("./routes/signupRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://edunet:edunet1234@cluster12.i0qxr0h.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/auctions", auctionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});