const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },

    userId: {
        type: String, // FireBaseId
        required: true,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },

    appliedAt: {
        type: Number,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);