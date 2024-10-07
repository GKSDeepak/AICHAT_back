
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ChatHistory = require("../models/chatHistory");
const User = require("../models/user");
// const cors = require("cors");

const storeMessage = async (userId, message, sender) => {
    try {
        const chat = new ChatHistory({ message, sender });
        await chat.save() ;

        await User.findByIdAndUpdate(userId, { $push: { chatHistory: chat._id } });
    } catch (error) {
        console.error("Error storing message: ", error);
    }
}

const getChatHistory = async (userId)=> {
    try {

        const user = await User.findById(userId).populate('chatHistory').exec();
        return user.chatHistory;
    } catch (error) {
        console.error("Error retriving chat history: ", error);
        throw error;
    }
}

// const allowedOrigins = ['http://localhost:3000', 'https://ai-chat-app-fronttemp.vercel.app'];

// router.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // Include credentials like cookies
// }));

// storeMessage end-point
router.post('/storeMessage', async (req, res) => {
    const { userId, message, sender } = req.body;

    try {
        await storeMessage(userId, message, sender);
        res.status(200).send({success: "true", message: "Message stored successfully"});
    } catch (error) {
        res.status(500).send({ success : "false", message: "Failed to store message", error });
    }
});

// getChatHistory end-point
router.get('/getChatHistory/:userId', async (req, res) => {
    const {userId} = req.params ;

    try {
        const chatHistory = await getChatHistory(userId);
        if (!chatHistory || chatHistory.length === 0) {
            return res.status(404).json({ success: false, message: 'No chat history found' });
        }
        res.status(200).send({success: "true", chatHistory});
    } catch (error) {
        res.status(500).send({success: "false", message : "Failed to retrieve the chats", error});
    }
})

module.exports = router ;