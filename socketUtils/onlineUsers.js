const usersOnline = {};

const userOnline = (userId, socketObj) => {
    try {
        if (!userId || !socketObj) {
            throw Error("userId or socketObj not provided.");
        }
        if (usersOnline.hasOwnProperty(userId)) {
            throw new Error("User already online.");
        }
        usersOnline[userId] = socketObj;
    } catch (error) {
        console.log(error);
    }
}

const userOffline = (userId) => {
    try {
        if (!userId) {
            throw Error("userId not acceptable.");
        }
        if (!usersOnline.hasOwnProperty(userId)) {
            throw new Error("User already offline.");
        }
        delete usersOnline[userId];
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    userOnline,
    userOffline
};