const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    firebaseId: {
        type: String, // Firebase UID
        required: true
    },

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        enum: ["JOB_SEEKER", "EMPLOYER"],
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("User", UserSchema);