const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String, // User or AI
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    },
});

const ChatHistory = mongoose.model("ChatHistory", chatSchema);
module.exports = ChatHistory;