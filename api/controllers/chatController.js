const ChatMessage = require("../models/ChatMessage");
const Job = require("../models/Job");

module.exports = {
    sendMessage: async (req, res) => {
        try {
            const {
                conversationId,
                jobId,
                seekerId,
                employerId,
                senderId,
                text,
                timestamp
            } = req.body;

            if (!conversationId || !jobId || !seekerId || !employerId || !senderId || !text) {
                return res.status(400).json({
                    message: "conversationId, jobId, seekerId, employerId, senderId and text are required"
                });
            }

            if (!req.user || req.user.FireBaseId !== senderId) {
                return res.status(403).json({
                    message: "You are not allowed to send this message"
                });
            }

            const job = await Job.findById(jobId);
            if (!job) {
                return res.status(404).json({
                    message: "Job not found"
                });
            }

            const message = await ChatMessage.create({
                conversationId,
                jobId,
                seekerId,
                employerId,
                senderId,
                text,
                timestamp: timestamp || Date.now()
            });

            const populated = await ChatMessage.findById(message._id).populate({
                path: "jobId",
                populate: {
                    path: "company"
                }
            });

            return res.status(201).json({
                message: "Message sent successfully",
                chatMessage: populated
            });
        } catch (error) {
            console.error("sendMessage error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    },

    getConversationMessages: async (req, res) => {
        try {
            const { conversationId } = req.params;

            if (!conversationId) {
                return res.status(400).json({
                    message: "conversationId is required"
                });
            }

            const messages = await ChatMessage.find({ conversationId })
                .populate({
                    path: "jobId",
                    populate: {
                        path: "company"
                    }
                })
                .sort({ timestamp: 1 });

            return res.status(200).json(messages);
        } catch (error) {
            console.error("getConversationMessages error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }
};