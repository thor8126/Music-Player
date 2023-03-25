const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    password: String,
    email: String,
    name: String,
    photo: String,
    googleId: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    date: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
