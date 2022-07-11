"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    admin: { type: Boolean, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    contactNumber: { type: String, required: false },
    token: { type: String, required: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
