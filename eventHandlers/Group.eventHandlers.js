const User = require("../models/User.model");
const {
    getNoOfOnlineUsersInGroup,
    getOnlineUserSocketInstance
} = require("../socketUtils/onlineUsers");

const newParticipantEventHandler = async (data, socket) => {
    try {
        const { participantId, groupId } = data;
        if (!participantId || !groupId) {
            throw Error("either participantId or groupId not provided.");
        }
        if (getNoOfOnlineUsersInGroup(groupId) > 1) {
            const user = await User.findById(participantId);
            const participantSocketObj = getOnlineUserSocketInstance(participantId);
            if (participantSocketObj) {
                participantSocketObj.join(groupId);
            }
            socket.to(groupId).emit("new_member", { username: user.username });
        }
    } catch (error) {
        console.log(error);
    }
}

const kickedParticipantEventHandler = async (data, socket) => {
    try {
        const { participantId, groupId } = data;
        if (!participantId || !groupId) {
            throw new Error("eiher participantId or groupId not provided.");
        }
        if (getNoOfOnlineUsersInGroup(groupId) > 1) {
            const user = await User.findById(participantId);
            const participantSocketObj = getOnlineUserSocketInstance(participantId);
            if (participantSocketObj) {
                participantSocketObj.leave(groupId);
            }
            socket.to(groupId).emit("member_removed", { username: user.username });
        }
    } catch (error) {
        console.log(error);
    }
}

const participantExitedEventHandler = async (data, socket) => {
    try {
        const { participantId, groupId } = data;
        if (!participantId || !groupId) {
            throw new Error("either participantId or groupId not provided");
        }
        if (getNoOfOnlineUsersInGroup(groupId) > 1) {
            const user = await User.findById(participantId);
            const participantSocketObj = getOnlineUserSocketInstance(participantId);
            if (participantSocketObj) {
                participantSocketObj.leave(groupId);
            }
            socket.to(groupId).emit("member_left", { username: user.username });
        }
    } catch (error) {
        console.log(error);
    }
}

const dismissedAdminEventHandler = async (data, socket) => {
    try {
        const { adminId, groupId } = data;
        if (!adminId || !groupId) {
            throw new Error("either adminId or groupId not provided.");
        }
        if (getNoOfOnlineUsersInGroup(groupId)) {
            const admin = await User.findById(adminId);
            socket.to(groupId).emit("admin_dismissed", { username: admin.username });
        }
    } catch (error) {
        console.log(error);
    }
}

const addAdminEventHandler = async (data, socket) => {
    try {
        const { adminId, groupId } = data;
        if (!adminId || !groupId) {
            throw new Error("either adminId or groupId not provided.");
        }
        if (getNoOfOnlineUsersInGroup(groupId)) {
            const admin = await User.findById(adminId);
            socket.to(groupId).emit("new_admin", { username: admin.username });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    newParticipantEventHandler,
    kickedParticipantEventHandler,
    participantExitedEventHandler,
    dismissedAdminEventHandler,
    addAdminEventHandler
}