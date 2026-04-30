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
    enum: ["JOB_SEEKER", "EMPLOYER"]
  },
  birthdate: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  photoUrl: {
    type: String,
    default: ""
  },
  resumeUrl: {
    type: String,
    default: ""
  },
  resumeName: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);