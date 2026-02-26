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
        default: ""
    },

    ownerId: {
        type: String,
        required: true,
        ref: "User" // FireBaseId של המשתמש
    },

    createdAt: {
        type: Number,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("Company", CompanySchema);