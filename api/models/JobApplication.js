const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  userId: {
    type: String,
    required: true,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["pending", "offered", "accepted", "rejected"],
    default: "pending"
  },
  appliedAt: {
    type: Number,
    default: function () {
      return Date.now();
    }
  }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);