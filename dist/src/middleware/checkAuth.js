"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config/config"));
const checkAuth = (req, res, next) => {
    const token = req.header("Authorization");
    if (token) {
        const accessToken = token.split(" ")[1];
        (0, jsonwebtoken_1.verify)(accessToken, config_1.default.jwt.accesskey, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                const error = {
                    message: err,
                    successful: false,
                    data: null
                };
                return res.status(403).json(error);
            }
            req.decodedToken = decodedToken;
            return next();
        }));
    }
    else {
        const error = {
            message: 'Access Token is required',
            successful: false,
            data: null
        };
        res.status(401).json(error);
    }
};
exports.checkAuth = checkAuth;
