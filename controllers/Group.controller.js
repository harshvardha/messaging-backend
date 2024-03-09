const { StatusCodes } = require("http-status-codes");

const Group = require("../models/Group.model");

const postCreateGroup = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const postJoinGroup = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const postExitGroup = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const putAddAdmin = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    postCreateGroup,
    postJoinGroup,
    postExitGroup,
    putAddAdmin
}