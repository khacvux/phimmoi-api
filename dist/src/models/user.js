"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    admin: { type: Boolean, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    avatarFilename: { type: String, required: false },
    contactNumber: { type: String, required: false },
    library: {
        type: [
            {
                idMovie: String,
                name: String,
                posterUrl: String
            },
        ],
        required: false,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", userSchema);
