const { Router } = require("express");
const { check } = require("express-validator");

const {
    postCreateMessage,
    deleteMessage,
    getMessages
} = require("../controllers/GroupMessage.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken.middleware");

const groupMessageRouter = Router();

// route to create a new message
groupMessageRouter.post(
    "/createMessage/:groupId",
    [
        check("description").isLength({ min: 1, max: 500 })
    ],
    verifyAccessToken,
    postCreateMessage
);

// route to delete message
groupMessageRouter.delete("/deleteMessage/:groupId/:groupMessageId", verifyAccessToken, deleteMessage);

// route to get all messages
groupMessageRouter.get("/allMessages?groupId", verifyAccessToken, getMessages);

module.exports = groupMessageRouter;