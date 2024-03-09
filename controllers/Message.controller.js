const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const Message = require("../models/Message.model");

const postCreateMessage = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "please provide correct message.");
        }
        const { recieverId, description } = req.body;
        const userId = req.userId;
        await Message.create({
            recieverId: recieverId,
            senderId: userId,
            description: description
        });
        res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteMessage = async (req, res, next) => {
    try {
        const userId = req.userId;
        const message = await Message.exists({ senderId: userId });
        if (!message) {
            throw new CustomError(StatusCodes.NOT_FOUND, "message not found.");
        }
        await Message.deleteOne({
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