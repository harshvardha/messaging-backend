const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    reciever: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    description: {
        type: String,
        required: true,
        max: 500
    },
    seen: {
        type: Boolean,
        default: false
    },
    delivered: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);