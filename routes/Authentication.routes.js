const { Router } = require("express");
const { check } = require("express-validator");

const {
    postRegisterNewUser,
    postLoginUser
} = require("../controllers/Authentication.controller");

const authenticationRouter = Router();

// route for registering new user
authenticationRouter.post(
    "/register",
    [
        check("email").notEmpty().isEmail(),
        check("username").notEmpty().isLength({ max: 50 }),
        check("password").isLength({ min: 6 })
    ],
    postRegisterNewUser
);

// route for login user
authenticationRouter.post(
    "/login",
    [
        check("email").notEmpty().isEmail(),
        check("password").isLength({ min: 6 })
    ],
    postLoginUser
);

module.exports = authenticationRouter;