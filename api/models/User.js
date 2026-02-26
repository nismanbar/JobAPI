const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    FireBaseId: {
        type: String,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    role: {
        type: String,
        required: true,
        enum: ["user", "worker", "company", "admin"] // תשנה לפי הצורך
    },

    birthdate: {
        type: String,
        required: false
    },

    address: {
        type: String,
        required: false
    }

}, {
    timestamps: true // מוסיף createdAt ו-updatedAt אוטומטית
});

module.exports = mongoose.model("User", UserSchema);