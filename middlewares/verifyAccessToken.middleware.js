const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const CustomError = require("../errors/CustomError");

const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader.startsWith("Bearer")) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "not authorized");
        }
        const token = authHeader.split(" ")[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (error, decoded) => {
                if (error) {
                    console.log(error);
                    return res.sendStatus(StatusCodes.UNAUTHORIZED);
                }
                req.userId = decoded.id;
                next();
            }
        )
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = verifyAccessToken;