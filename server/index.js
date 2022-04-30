const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoute");
const messagesRoutes = require("./routes/messageRoute");
const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const httpSever = createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/chat/", messagesRoutes);

const io = new Server(httpSever, {
    cors: {
        origin: "http://localhost:3000",
    },
});

global.currentUsers = new Map();

io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
        currentUsers.set(userId, socket.id);
    });
    socket.on("send-message", (msg) => {
        const sendUserSocket = currentUsers.get(msg.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("receive-message", msg);
        }
    });
    socket.on("add-friend", (data) => {
        const sendUserSocket = currentUsers.get(data.to);
        socket.to(sendUserSocket).emit("insert-friend", data.user);
    });
});

const PORT= process.env.PORT || 5000

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB connected successfully");
        httpSever.listen(PORT, () => {
            console.log("Server is up and running");
        });
    })
    .catch((err) => console.log(err));
