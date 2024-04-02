const { Router } = require("express");
const { check } = require("express-validator");

const {
    postCreateMessage,
    deleteMessage,
    getMessages
} = require("../controllers/Message.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken.middleware");

const messageRouter = Router();

// route to create new message
messageRouter.post(
    "/createMessage",
    [
        check("recieverId").isLength({ min: 24, max: 24 }).isHexadecimal(),
        check("description").isLength({ min: 1, max: 500 })
    ],
    verifyAccessToken,
    postCreateMessage
);

// route to delete message
messageRouter.delete("/deleteMessage/:messageId", verifyAccessToken, deleteMessage);

// route to get all messages
messageRouter.get(
    "/messages/:recieverId",
    verifyAccessToken,
    getMessages
);

module.exports = messageRouter;