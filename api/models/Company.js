const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: String,

    logoUrl: String,

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Company", CompanySchema);
