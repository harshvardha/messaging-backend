const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { hash } = require("bcryptjs");

const User = require("../models/User.model");
const Message = require("../models/Message.model");
const GroupMessage = require("../models/GroupMessage.model");
const CustomError = require("../errors/CustomError");

const putEditProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Please provide correct username or profile pic url.");
        }
        const { username, profilePicUrl } = req.body;
        const userId = req.userId;
        const userExist = await User.findById(userId);
        if (!userExist) {
            throw new CustomError(StatusCodes.NOT_FOUND, "user not found.");
        }
        await userExist.updateOne({
            $set: {
                username: username,
                profilePicUrl: profilePicUrl
            }
        });
        res.status(StatusCodes.OK).json({ profilePicUrl: userExist.profilePicUrl });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const putEditAccountCredentials = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Please provide correct credentials.");
        }
        const { email, password } = req.body;
        const userId = req.userId;
        const userExist = await User.findById(userId);
        if (!userExist) {
            throw new CustomError(StatusCodes.NOT_FOUND, "user not found.");
        }
        const hashedPassword = await hash(password, 12);
        await userExist.updateOne({
            $set: {
                email: email,
                password: hashedPassword
            }
        });
        res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getUserAccountInformation = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "User not found.");
        }
        const { email, username, profilePicUrl } = user;
        const userInfo = {
            email,
            username,
            profilePicUrl
        }
        res.status(StatusCodes.OK).json(userInfo);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getUserConnections = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "User not found.");
        }
        const connectedToUsers = user.connectedTo;
        const groups = user.groups;
        const messages = [];
        let messages1;
        let messages2;

        // first we will take one to one chats then group
        for (const id of connectedToUsers) {

            // getting the count of all undelivered messages. reciever = userId and sender = id
            const undeliveredMessages = await Message.find({ sender: id, reciever: userId, seen: false });

            // senderId = userId and recieverId = id
            messages1 = await Message.find({ sender: userId, reciever: id }).sort({ createdAt: -1 }).populate("reciever");

            // senderId = id and recieverId = userId
            messages2 = await Message.find({ sender: id, reciever: userId }).sort({ createdAt: -1 }).populate("sender");

            // comparing the index: 0 value to get the most recent message
            let message;
            if (messages1.length > 0 && messages2.length > 0) {
                message = messages1[0].createdAt > messages2[0].createdAt ? {
                    userId: id,
                    profilePicUrl: messages1[0].reciever.profilePicUrl,
                    username: messages1[0].reciever.username,
                    description: messages1[0].description,
                    seen: messages1[0].seen,
                    undeliveredMessagesCount: undeliveredMessages.length,
                    delivered: messages1[0].delivered,
                    createdAt: messages1[0].createdAt
                } : {
                    userId: id,
                    profilePicUrl: messages2[0].sender.profilePicUrl,
                    username: messages2[0].sender.username,
                    description: messages2[0].description,
                    seen: messages2[0].seen,
                    undeliveredMessagesCount: undeliveredMessages.length,
                    delivered: messages2[0].delivered,
                    createdAt: messages1[0].createdAt
                };
            } else if (messages1.length > 0) {
                message = {
                    userId: id,
                    profilePicUrl: messages1[0].reciever.profilePicUrl,
                    username: messages1[0].reciever.username,
                    description: messages1[0].description,
                    seen: messages1[0].seen,
                    undeliveredMessagesCount: undeliveredMessages.length,
                    delivered: messages1[0].delivered,
                    createdAt: messages1[0].createdAt
                };
            } else {
                message = {
                    userId: id,
                    profilePicUrl: messages2[0].sender.profilePicUrl,
                    username: messages2[0].sender.username,
                    description: messages2[0].description,
                    seen: messages2[0].seen,
                    undeliveredMessagesCount: undeliveredMessages.length,
                    delivered: messages2[0].delivered,
                    createdAt: messages2[0].createdAt
                };
            }
            messages.push(message);
        }

        // now taking group chats
        for (const id of groups) {
            const groupMessages = await GroupMessage.find({ groupId: id }).sort({ createdAt: -1 }).populate("group");
            messages.push(groupMessages[0]);
        }
        res.status(StatusCodes.OK).json(messages);
    } catch (error) {
        console.log(error);
    }
}

const getUserInformation = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            throw new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Don't provide empty search query.");
        }
        const users = await User.find({ username: { $regex: `^${query}` } });
        if (!users) {
            return res.sendStatus(StatusCodes.NOT_FOUND)
        }
        res.status(StatusCodes.OK).json(users);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    putEditProfile,
    putEditAccountCredentials,
    getUserAccountInformation,
    getUserConnections,
    getUserInformation
}