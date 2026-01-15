const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: {  
        type: String, 
        required: true
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    salaryFrom: {
        type: Number,
        default: 0
    },

    salaryTo: {
        type: Number,
        default: 0
    },

    category: {
        type: String,
        required: true
    },

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Job", JobSchema);
