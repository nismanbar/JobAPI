require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const uri = process.env.MONGO_STR;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDB();

// Load models early so populate/create work reliably
require("./api/models/User");
require("./api/models/Company");
require("./api/models/Job");
require("./api/models/JobApplication");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const UserRouter = require("./api/routes/userRoutes");
app.use("/users", UserRouter);

const CompanyRouter = require("./api/routes/companyRoutes");
app.use("/company", CompanyRouter);

const JobRouter = require("./api/routes/jobRoutes");
app.use("/job", JobRouter);

const JobApplicationRouter = require("./api/routes/jobApplicationRoutes");
app.use("/job_app", JobApplicationRouter);

const ChatRouter = require("./api/routes/chatRoutes");
app.use("/chat", ChatRouter);

// 404
app.use(function (req, res, next) {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

module.exports = app;