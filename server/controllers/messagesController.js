const Messages = require("../model/messageModel");

module.exports.addMessage = (req, res, next) => {
    try {
        const { from, to, text, messageType } = req.body;
        const data = Messages.create({
            message: {
                messageType: messageType,
                text: text,
            },
            users: [from, to],
            sender: from,
        });
        if (data) {
            res.json({ msg: "Message added", status: true });
        } else {
            res.json({ msg: "Failed to add message", status: false });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.getMessage = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const data = await Messages.find({ users: { $all: [from, to] } }).sort({
            updatedAt: 1,
        });
        const messages = data.map((msg) => {
            return {
                self: msg.sender.toString() === from,
                message: msg.message,
            };
        });
        if (messages) {
            res.json({ msg: "success", messages: messages, status: true });
            return;
        }
        res.json({ msg: "failed to fetch message from database" });
    } catch (error) {
        next(error);
    }
};
