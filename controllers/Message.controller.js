const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const Message = require("../models/Message.model");
const User = require("../models/User.model");
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
            reciever: recieverId,
            sender: userId,
            description: description
        });
        const sender = await User.findById(userId);
        const reciever = await User.findById(recieverId);
        if (!sender.connectedTo.includes(recieverId)) {
            await sender.updateOne({ $push: { connectedTo: recieverId } });
        }
        if (!reciever.connectedTo.includes(userId)) {
            await reciever.updateOne({ $push: { connectedTo: userId } });
        }
        await message.populate("reciever");
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
        const { recieverId } = req.params;
        const userId = req.userId;

        // messages1 includes messages where senderId = userId and recieverId = recieverId
        const messages1 = await Message.find({ reciever: recieverId, sender: userId });

        // messages2 includes messages where senderId = recieverId and recieverId = senderId
        const messages2 = await Message.find({ reciever: userId, sender: recieverId });

        const messages = messages1.concat(messages2);
        messages.sort((message1, message2) => message1.createdAt - message2.createdAt);

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