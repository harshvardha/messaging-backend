const { Router } = require("express");
const { check } = require("express-validator");

const {
    putEditProfile,
    putEditAccountCredentials,
    getUserAccountInformation,
    getUserConnections,
    getUserInformation
} = require("../controllers/User.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken.middleware");

const userRouter = Router();

// route for editing profile
userRouter.put(
    "/editProfile",
    [
        check("username").notEmpty().isLength({ max: 50 }),
        check("profilePicUrl").notEmpty().isURL()
    ],
    verifyAccessToken,
    putEditProfile
);

// route for editing account credentials
userRouter.put(
    "/editAccountCredentials",
    [
        check("email").notEmpty().isEmail().isLength({ max: 50 }),
        check("password").isLength({ min: 6 })
    ],
    verifyAccessToken,
    putEditAccountCredentials
);

// route for getting user account information
userRouter.get("/accountInfo", verifyAccessToken, getUserAccountInformation);

// route for getting user connections
userRouter.get("/connections", verifyAccessToken, getUserConnections);

// route for searching a user
userRouter.get("/search", verifyAccessToken, getUserInformation);

module.exports = userRouter;