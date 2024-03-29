const { Router } = require("express");
const { check } = require("express-validator");

const {
    postCreateGroup,
    putAddParticipant,
    postExitGroup,
    putKickParticipant,
    putKickAdmin,
    putEditGroupName,
    putEditGroupProfilePic,
    putAddAdmin
} = require("../controllers/Group.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken.middleware");

const groupRouter = Router();

// route to create a group
groupRouter.post(
    "/createGroup",
    [
        check("groupName").notEmpty().isLength({ max: 50 })
    ],
    verifyAccessToken,
    postCreateGroup
);

// route to add participant
groupRouter.put(
    "/addParticipant",
    [
        check("groupId").isLength({ min: 64, max: 64 }).isHexadecimal(),
        check("participantId").isLength({ min: 64, max: 64 }).isHexadecimal()
    ],
    verifyAccessToken,
    putAddParticipant
);

// route to exit group
groupRouter.post("/exitGroup/:groupId", verifyAccessToken, postExitGroup);

// route to kick participant
groupRouter.put(
    "/kickParticipant",
    [
        check("groupId").isLength({ min: 64, max: 64 }).isHexadecimal(),
        check("participantId").isLength({ min: 64, max: 64 }).isHexadecimal()
    ],
    verifyAccessToken,
    putKickParticipant
);

// route to kick an admin
groupRouter.put(
    "/kickAdmin",
    [
        check("groupId").isLength({ min: 64, max: 64 }).isHexadecimal(),
        check("adminId").isLength({ min: 64, max: 64 }).isHexadecimal()
    ],
    verifyAccessToken,
    putKickAdmin
);

// route to edit group name
groupRouter.put(
    "/editGroupName/:groupId",
    [
        check("groupName").notEmpty().isLength({ min: 1, max: 50 })
    ],
    verifyAccessToken,
    putEditGroupName
);

// route to edit profile pic of group
groupRouter.put(
    "/editProfilePic/:groupId",
    [
        check("profilePicUrl").notEmpty().isURL()
    ],
    verifyAccessToken,
    putEditGroupProfilePic
);

// route to add a new admin
groupRouter.put(
    "/addAdmin",
    [
        check("groupId").isLength({ min: 64, max: 64 }).isHexadecimal(),
        check("participantId").isLength({ min: 64, max: 64 }).isHexadecimal()
    ],
    verifyAccessToken,
    putAddAdmin
);

module.exports = groupRouter;