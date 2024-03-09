const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
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