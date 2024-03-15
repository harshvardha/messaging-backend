const Message = require("../models/Message.model");
const { userOnline } = require("../socketUtils/onlineUsers");

const createdMessageEventHandler = async (data, socket) => {
    try {
        const { recieverId, senderId } = data;
        if (!recieverId || !senderId) {
            throw new Error("recieverId or senderId not provided.");
        }
        const message = await Message.findOne({ senderId: senderId, recieverId: recieverId });
        if (!message) {
            throw Error("message does not exist.");
        }
        const recieverSocketObj = userOnline[recieverId];
        if (!recieverSocketObj) {
            throw Error("User offline");
        }
        recieverSocketObj.emit("new_message", message);
    } catch (error) {
        console.log(error);
    }
}

const recievedMessageEventHandler = async (data) => {
    try {
        const { senderId, delivered } = data;
        if (!delivered) {
            throw Error("Message not delivered.");
        }
        const senderSocketObj = userOnline[senderId];
        if (!senderSocketObj) {
            throw Error("user is offline.");
        }
        await Message.updateOne({ _id: data._id }, {
            $set: { delivered: true }
        });
        senderSocketObj.emit("message_delivered", data);
    } catch (error) {
        console.log(error);
    }
}

const messageSeenEventHandler = async (data) => {
    try {
        const { senderId, seen, delivered } = data;
        if (!delivered || !seen) {
            throw Error("Message is either not delivered or not seen.");
        }
        const senderSocketObj = userOnline[senderId];
        if (!senderSocketObj) {
            throw Error("user is offline.");
        }
        await Message.updateOne({ _id: data._id }, {
            $set: { seen: true }
        });
        senderSocketObj.emit("message_seen", data);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createdMessageEventHandler,
    recievedMessageEventHandler,
    messageSeenEventHandler
}