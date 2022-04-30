const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 3,
            max: 20,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            min: 4,
            max: 30,
        },
        password: {
            type: String,
            required: true,
            min: 3,
            max: 30,
        },
        isAvatarImage: {
            type: Boolean,
            default: false,
        },
        avatarImage: {
            type: String,
            default: "",
        },
        profilePhoto: {
            type: String,
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
