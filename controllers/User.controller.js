const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { hash } = require("bcryptjs");

const User = require("../models/User.model");
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
        res.status(StatusCodes.OK).json({ username: userExist.username, profilePicUrl: userExist.profilePicUrl });
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

module.exports = {
    putEditProfile,
    putEditAccountCredentials
}