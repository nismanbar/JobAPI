const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    salaryFrom: {
        type: Number,
        default: 0
    },

    salaryTo: {
        type: Number,
        default: 0
    },

    salary: {
        type: Number,
        default: 0
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Number,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("Job", JobSchema);