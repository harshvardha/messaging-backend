const Message = require("../models/Message.model");
const { getOnlineUserSocketInstance } = require("../socketUtils/onlineUsers");

const createdMessageEventHandler = async (data) => {
    try {
        const { recieverId, senderId } = data;
        if (!recieverId || !senderId) {
            throw new Error("recieverId or senderId not provided.");
        }
        const message = await Message.findOne({ senderId: senderId, recieverId: recieverId });
        if (!message) {
            throw Error("message does not exist.");
        }
        const recieverSocketObj = getOnlineUserSocketInstance(recieverId);
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
        await Message.updateOne({ _id: data._id }, {
            $set: { delivered: true }
        });
        const senderSocketObj = getOnlineUserSocketInstance(senderId);
        if (!senderSocketObj) {
            throw Error("user is offline.");
        }
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
        await Message.updateOne({ _id: data._id }, {
            $set: { seen: true }
        });
        const senderSocketObj = getOnlineUserSocketInstance(senderId);
        if (!senderSocketObj) {
            throw Error("user is offline.");
        }
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