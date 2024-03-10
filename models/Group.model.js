const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 50
    },
    profilePicUrl: {
        type: String,
        default: ""
    },
    participants: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User"
        }
    ],
    admins: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User"
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);