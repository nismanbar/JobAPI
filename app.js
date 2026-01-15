require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

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


// Enable CORS for all routes
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse request body JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parse request body


const UserRouter = require('./api/routes/userRoutes');
app.use("/users",UserRouter);

const JobApplicationRouter = require('./api/routes/jobApplicationRoutes');
app.use("/job_app",JobApplicationRouter);

const JobRouter = require('./api/routes/jobRoutes');
app.use("/job",JobRouter);

const CompanyRouter = require('./api/routes/companyRoutes');
app.use("/company",CompanyRouter);





module.exports = app;
