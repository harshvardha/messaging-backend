const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const Group = require("../models/Group.model");
const CustomError = require("../errors/CustomError");

const postCreateGroup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "Group name or profile pic url not correct.");
        }
        const userId = req.userId;
        const { groupName, profilePicUrl } = req.body;
        const group = await Group.create({
            name: groupName,
            profilePicUrl: profilePicUrl ? profilePicUrl : "",
            participants: [userId],
            admins: [userId]
        });
        res.status(StatusCodes.CREATED).json(group);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const putAddParticipant = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "not correct participant id or group id.");
        }
        const { groupId, participantId } = req.body;
        const userId = req.userId;
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError(StatusCodes.NOT_FOUND, "group not found.");
        }
        if (!group.admins.includes(userId)) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "you are not admin of the group.");
        }
        await group.updateOne({
            $push: { participants: participantId }
        });
        res.status(StatusCodes.OK).json(group);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const postExitGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        if (!groupId.length === 64) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "incorrect group id.");
        }
        const userId = req.userId;
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError(StatusCodes.NOT_FOUND, "group does not exist.");
        }
        if (!group.participants.includes(userId)) {
            throw new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "user is not part of the group.");
        }
        if (group.admins.includes(userId)) {
            await group.updateOne({
                $pull: { admins: userId }
            });
        }
        await group.updateOne({
            $pull: { participants: userId }
        });
        res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const putKickParticipant = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "not correct groupId or participantId.");
        }
        const { groupId, participantId } = req.body;
        const userId = req.userId;
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError(StatusCodes.NOT_FOUND, "group does not exist.");
        }
        if (!group.admins.includes(userId)) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "you are not group admin.");
        }
        if (!group.participants.includes(participantId)) {
            throw new CustomError(StatusCodes.NOT_FOUND, "participant not found.");
        }
        if (group.admins.includes(participantId)) {
            await group.updateOne({
                $pull: { admins: participantId }
            });
        }
        await group.updateOne({
            $pull: { participants: participantId }
        });
        res.status(StatusCodes.OK).json(group);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const putKickAdmin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "not correct groupId or adminId.");
        }
        const { groupId, adminId } = req.body;
        const userId = req.userId;
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError(StatusCodes.NOT_FOUND, "group does not exist.");
        }
        if (!group.admins.includes(userId)) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "you are not the admin of the group.");
        }
        if (!group.admins.includes(adminId)) {
            throw new CustomError(StatusCodes.NOT_FOUND, "admin you want to delete not found.");
        }
        await group.updateOne({
            $pull: { admins: adminId }
        });
        res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const putEditGroupName = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "group name cannot be empty.");
        }
        const { groupId } = req.params;
        const { groupName } = req.body;
        if (groupId.length !== 64) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "incorrect group id.");
        }
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError(StatusCodes.NOT_FOUND, "group not found.");
        }
        const userId = req.userId;
        if (!group.admins.includes(userId)) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "Only group admin is allowed to change group name.");
        }
        await group.updateOne({
            $set: { name: groupName }
        });
        res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const putEditGroupProfilePic = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "incorrect url.");
        }
        const { groupId } = req.params;
        if (groupId.length !== 64) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "incorrect groupId.");
        }
        const { profilePicUrl } = req.body;
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError(StatusCodes.NOT_FOUND, "group does not exist.");
        }
        const userId = req.userId;
        if (!group.admins.includes(userId)) {
            throw new CustomError(StatusCodes.UNAUTHORIZED, "Only group admin can edit profile pic.")
        }
        await group.updateOne({
            $set: { profilePicUrl: profilePicUrl }
        });
        res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const putAddAdmin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomError(StatusCodes.NOT_ACCEPTABLE, "not correct groupId or participantId");
        }
        const { groupId, participantId } = req.body;
        const userId = req.userId;
        const group = await Group.findById(groupId);
        if (!group) {
            throw new CustomError(StatusCodes.NOT_FOUND, "group does not exist.");
        }
        if (!group.admins.includes(userId)) {
            throw new CustomError(StatusCodes.NOT_FOUND, "you are not group admin.");
        }
        if (!group.participants.includes(participantId)) {
            throw new CustomError(StatusCodes.NOT_FOUND, "participant does not exist.");
        }
        await group.updateOne({
            $push: { admins: participantId }
        });
        res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    postCreateGroup,
    putAddParticipant,
    postExitGroup,
    putKickParticipant,
    putKickAdmin,
    putEditGroupName,
    putEditGroupProfilePic,
    putAddAdmin
}