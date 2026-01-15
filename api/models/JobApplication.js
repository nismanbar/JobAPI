const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["SENT", "REVIEWED", "ACCEPTED", "REJECTED"],
        default: "SENT"
    },

    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
