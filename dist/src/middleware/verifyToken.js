"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config/config"));
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (token) {
        const accessToken = token.split(" ")[1];
        (0, jsonwebtoken_1.verify)(accessToken, config_1.default.jwt.accesskey, (err, user) => {
            if (err) {
                const error = {
                    message: err,
                    successful: false,
                };
                return res.status(403).json(error);
            }
            req.user = user;
            return next();
        });
    }
    else {
        const error = {
            message: 'Access Token is required',
            successful: false,
        };
        res.status(401).json(error);
    }
};
exports.verifyToken = verifyToken;
