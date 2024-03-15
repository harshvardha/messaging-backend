const Group = require("../models/Group.model");
const { userOnline } = require("../socketUtils/onlineUsers");

const newParticipantEventHandler = async (data, socket) => {
    try {

    } catch (error) {
        console.log(error);
    }
}

const kickedParticipantEventHandler = async (data, socket) => {
    try {

    } catch (error) {
        console.log(error);
    }
}

const participantExitedEventHandler = async (data, socket) => {
    try {

    } catch (error) {
        console.log(error);
    }
}

const dismissedAdminEventHandler = async (data, socket) => {
    try {

    } catch (error) {
        console.log(error);
    }
}

const addAdminEventHandler = async (data, socket) => {
    try {

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    newParticipantEventHandler,
    kickedParticipantEventHandler,
    participantExitedEventHandler,
    dismissedAdminEventHandler,
    addAdminEventHandler
}