const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const User = require("../models/User.model");
const CustomError = require("../errors/CustomError");

const postRegisterNewUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Please provide correct details.");
        }
        const { email, username, password } = req.body;
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            throw new CustomError(StatusCodes.CONFLICT, "User already exist.");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email: email,
            username: username,
            password: hashedPassword
        });
        if (!newUser) {
            throw new CustomError(StatusCodes.EXPECTATION_FAILED, "Signup failed.")
        }
        res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const postLoginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Please provide correct login credentials.");
        }
        const { email, password } = req.body;
        const userExist = await User.findOne({ email: email });
        if (!userExist) {
            throw new CustomError(StatusCodes.NOT_FOUND, "user does not exist.");
        }
        const correctPassword = await bcrypt.compare(password, userExist.password);
        if (!correctPassword) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "please provide correct login credentials.");
        }
        const accessToken = jwt.sign(
            {
                id: userExist._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "24h" }
        );
        res.status(StatusCodes.OK).json({ accessToken, username: userExist.username, profilePicUrl: userExist.profilePicUrl });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    postRegisterNewUser,
    postLoginUser
}