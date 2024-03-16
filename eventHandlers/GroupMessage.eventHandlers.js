const GroupMessage = require("../models/GroupMessage.model");
const {
    getOnlineUserSocketInstance,
    getNoOfOnlineUsersInGroup
} = require("../socketUtils/onlineUsers");

const createdGroupMessageEventHandler = async (data, socket) => {
    try {
        const { senderId, groupId } = data;
        if (!senderId || !groupId) {
            throw new Error("senderId or groupId not provided.");
        }
        if (getNoOfOnlineUsersInGroup(groupId) > 1) {
            const groupMessage = await GroupMessage.findOne({
                senderId: senderId,
                groupId: groupId
            });
            if (!groupMessage) {
                throw new Error("Group Message does not exist.");
            }
            socket.to(groupId).emit("new_groupMessage", groupMessage);
        }
    } catch (error) {
        console.log(error);
    }
}

const recievedGroupMessageEventHandler = async (data) => {
    try {
        const { senderId, delivered } = data;
        if (!delivered) {
            throw new Error("Group Message not delivered.");
        }
        const groupMessage = await GroupMessage.findById(data._id);
        if (!groupMessage.delivered) {
            await groupMessage.updateOne({
                $set: { delivered: true }
            });
            const senderSocketObj = getOnlineUserSocketInstance(senderId);
            if (!senderSocketObj) {
                throw new Error("user is offline.");
            }
            senderSocketObj.emit("groupMessage_delivered", data);
        }
    } catch (error) {
        console.log(error);
    }
}

const seenGroupMessageEventHandler = async (data) => {
    try {
        const { senderId, seen, delivered } = data;
        if (!delivered || !seen) {
            throw new Error("Message is either not delivered or not seen.");
        }
        const groupMessage = await GroupMessage.findById(data._id);
        if (groupMessage.delivered && !groupMessage.seen) {
            await groupMessage.updateOne({
                $set: { seen: true }
            });
            const senderSocketObj = getOnlineUserSocketInstance(senderId);
            if (!senderSocketObj) {
                throw new Error("user is offline");
            }
            senderSocketObj.emit("groupMessage_seen", data);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createdGroupMessageEventHandler,
    seenGroupMessageEventHandler,
    recievedGroupMessageEventHandler
}