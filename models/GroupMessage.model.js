const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupMessageSchema = new Schema({
    messageDescription: {
        type: String,
        max: 500,
        required: true
    },
    sender: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    group: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Group"
    },
    delivered: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("GroupMessage", groupMessageSchema);