const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        min: 6,
        required: true
    },
    profilePicUrl: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("User", userSchema);