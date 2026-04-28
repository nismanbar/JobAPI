const express = require("express");
const router = express.Router();

const authenticateJWT = require("../MiddleWare");
const {
    sendMessage,
    getConversationMessages
} = require("../controllers/chatController");

router.post("/messages", authenticateJWT, sendMessage);
router.get("/conversation/:conversationId", authenticateJWT, getConversationMessages);

module.exports = router;