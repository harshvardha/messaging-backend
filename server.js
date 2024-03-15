const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./database/DBConnect");
const authenticationRoutes = require("./routes/Authentication.routes");
const userRoutes = require("./routes/User.routes");
const groupRoutes = require("./routes/Group.routes");
const messageRoutes = require("./routes/Message.routes");
const groupMessageRoutes = require("./routes/GroupMessage.routes");
const {
    userOnline,
    userOffline
} = require("./socketUtils/onlineUsers");

connectDB();

const app = express();
const EXPRESS_PORT = process.env.EXPRESS_PORT || 5000;
const SOCKET_PORT = process.env.SOCKET_PORT || 5050;
const io = new Server({
    cors: {
        origin: "*"
    }
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors({
    origin: "*"
}));

app.use("/auth", authenticationRoutes);
app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use("/group", groupRoutes);
app.use("/groupMessage", groupMessageRoutes);

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Server error. We are fixing it.";
    res.status(status).json({
        success: false,
        status,
        message
    });
});

io.on("connection", (socket) => {
    try {
        const { userId } = socket.data;
        if (!userId) {
            throw Error("User id not provided.");
        }
        userOnline(userId, socket);
        socket.on("disconnect", (userId) => {
            if (!userId) {
                throw Error("User id not provided.");
            }
            userOffline(userId);
        });
        // events related to one to one messaging remaining to get registered
    } catch (error) {
        console.log(error);
    }
});

mongoose.connection.on("open", () => {
    console.log("MONGO DB CONNECTED");
    app.listen(EXPRESS_PORT, () => console.log(`Server running on port ${EXPRESS_PORT}`));
});

io.listen(SOCKET_PORT);