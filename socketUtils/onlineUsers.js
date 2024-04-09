const User = require("../models/User.model");

const usersOnline = {};
const groups = {};

const userOnline = (userId, socketObj) => {
    try {
        if (!userId || !socketObj) {
            throw new Error("userId or socketObj not provided.");
        }
        if (usersOnline.hasOwnProperty(userId)) {
            throw new Error("User already online.");
        }
        usersOnline[userId] = socketObj;
    } catch (error) {
        console.log(error);
    }
}

const userOffline = (userId) => {
    try {
        if (!userId) {
            throw new Error("userId not acceptable.");
        }
        if (!usersOnline.hasOwnProperty(userId)) {
            throw new Error("User already offline.");
        }
        delete usersOnline[userId];
        console.log(`users online: ${usersOnline[userId]}`);
    } catch (error) {
        console.log(error);
    }
}

const groupUserOnline = async (userId, socketObj) => {
    try {
        if (!userId) {
            throw new Error("userId not provided.");
        }
        if (!usersOnline.hasOwnProperty(userId)) {
            throw new Error("offline user cannot be added to group.");
        }
        const user = await User.findById(userId);
        const userGroups = user.groups;
        if (!userGroups) {
            throw new Error("user is not part of any group.");
        }
        userGroups.forEach(groupId => {
            if (!groups.hasOwnProperty(groupId)) {
                throw new Error("Group not found.");
            }
            groups[groupId].push(userId);
            socketObj.join(groupId);
        });
    } catch (error) {
        console.log(error);
    }
}

const groupUserOffline = async (userId, socketObj) => {
    try {
        if (!userId) {
            throw new Error("userId not found");
        }
        if (usersOnline.hasOwnProperty(userId)) {
            throw new Error("online users cannot be removed from groups.");
        }
        const user = await User.findById(userId);
        const userGroups = user.groups;
        if (userGroups) {
            userGroups.forEach(groupId => {
                if (!groups.hasOwnProperty(groupId)) {
                    throw new Error("Group not found.");
                }
                groups[groupId] = groups[groupId].filter(memberId => memberId !== userId);
                socketObj.leave(groupId);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const getNoOfOnlineUsersInGroup = (groupId) => {
    try {
        if (!groupId || !groups.hasOwnProperty(groupId)) {
            throw new Error("Either groupId is invalid or group does not exist.");
        }
        return groups[groupId].length;
    } catch (error) {
        console.log(error);
    }
}

const getOnlineUserSocketInstance = (userId) => {
    if (usersOnline.hasOwnProperty(userId))
        return usersOnline[userId];
    else
        return false;
}

module.exports = {
    userOnline,
    userOffline,
    groupUserOnline,
    groupUserOffline,
    getNoOfOnlineUsersInGroup,
    getOnlineUserSocketInstance
}