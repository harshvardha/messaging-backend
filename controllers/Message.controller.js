const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const Message = require("../models/Message.model");
const CustomError = require("../errors/CustomError");

const postCreateMessage = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "please provide correct message.");
        }
        const { recieverId, description } = req.body;
        const userId = req.userId;
        const message = await Message.create({
            recieverId: recieverId,
            senderId: userId,
            description: description
        });
        res.status(StatusCodes.CREATED).json(message);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteMessage = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { messageId } = req.params;
        if (messageId.length !== 64) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Please provide correct message id.");
        }
        const message = await Message.exists({ _id: messageId });
        if (!message) {
            throw new CustomError(StatusCodes.NOT_FOUND, "message not found.");
        }
        if (message.senderId.toString() !== userId) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "You can only delete your messages.");
        }
        await Message.deleteOne({
            _id: messageId,
            senderId: userId
        });
        res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getMessages = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Please provide correct reciever id.");
        }
        const { recieverId } = req.body;
        const userId = req.userId;
        const messages = await Message.find({ recieverId: recieverId, senderId: userId });
        if (!messages) {
            throw new CustomError(StatusCodes.NOT_FOUND, "messages not found.");
        }
        res.status(StatusCodes.OK).json(messages);
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