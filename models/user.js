const mongoose =require("mongoose");
const { isEmail } = require("validator");
const ChatHistory = require("./chatHistory");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "please enter an email"],
        unique: true,
        vlidate: [(isEmail, "Please enter a valid email ID")],
    },
    password: {
        type: String,
        required: [true, "please enter an password"],
        minLength: [8, "Minimum password length is 8 characters"],
    },
    chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: ChatHistory}],
})

const User = mongoose.model('User', userSchema);

module.exports = User ;