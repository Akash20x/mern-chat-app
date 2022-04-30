const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        message: {
            messageType: String,
            text: {
                type: String,
                require: true,
            },
        },
        users: {
            type: Array,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;
