const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  seekerId: {
    type: String,
    required: true
  },
  employerId: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    default: ""
  },
  senderRole: {
    type: String,
    default: ""
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Number,
    default: function () {
      return Date.now();
    }
  }
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);