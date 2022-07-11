"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config/config"));
const createToken = (id) => {
    return (0, jsonwebtoken_1.sign)({ id }, config_1.default.jwt.accesskey, {
        expiresIn: "24h",
    });
};
exports.createToken = createToken;
const sendRefreshToken = (res, user) => {
    res.cookie(config_1.default.jwt.refreshkey, (0, exports.createToken)(user._id), {
        secure: true,
        sameSite: 'lax',
        path: '/refresh_token'
    });
};
exports.sendRefreshToken = sendRefreshToken;
