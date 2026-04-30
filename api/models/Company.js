const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  logoUrl: {
    type: String,
    default: "",
    trim: true
  },
  ownerId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  createdAt: {
    type: Number,
    default: function () {
      return Date.now();
    }
  }
});

module.exports = mongoose.model("Company", CompanySchema);