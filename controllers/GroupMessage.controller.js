const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");

const GroupMessage = require("../models/GroupMessage.model");
const Group = require("../models/Group.model");
const CustomError = require("../errors/CustomError");

const postCreateMessage = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "provide correct description.");
        }
        const { groupId } = req.params;
        if (groupId.length !== 64) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "provide correct groupId.");
        }
        const userId = req.userId;
        const group = await Group.exists({ _id: groupId });
        if (!group || !group.participants.includes(userId)) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Either group does not exist or you are not a participant.");
        }
        const { description } = req.body;
        const groupMessage = await GroupMessage.create({
            senderId: userId,
            groupId: groupId,
            description: description
        });
        res.status(StatusCodes.CREATED).json(groupMessage);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteMessage = async (req, res, next) => {
    try {
        const { groupId, groupMessageId } = req.params;
        const userId = req.userId;
        if (groupId.length !== 64) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Please provide correct groupId.");
        }
        const group = await Group.exists({ _id: groupId });
        if (!group) {
            throw new CustomError(StatusCodes.NOT_FOUND, "group does not exist.");
        }
        if (group.admins.includes(userId)) {
            await GroupMessage.deleteOne({ _id: groupMessageId });
            return res.sendStatus(StatusCodes.OK);
        }
        if (group.participants.includes(userId)) {
            const groupMessage = await GroupMessage.findById(groupMessageId);
            if (groupMessage.senderId.toString() !== userId) {
                throw new CustomError(StatusCodes.UNAUTHORIZED, "You can only delete your messages.");
            }
            await GroupMessage.deleteOne({ _id: groupMessageId });
            return res.sendStatus(StatusCodes.OK);
        }
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getMessages = async (req, res, next) => {
    try {
        const { groupId } = req.query;
        if (!groupId.length !== 64 && !Group.exists(groupId)) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "provide correct groupId.");
        }
        const groupMessages = await GroupMessage.find({ groupId: groupId });
        if (!groupMessages) {
            throw new CustomError(StatusCodes.NOT_FOUND, "no group messages found.");
        }
        res.status(StatusCodes.OK).json(groupMessages);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    postCreateMessage,
    deleteMessage,
    getMessages
}