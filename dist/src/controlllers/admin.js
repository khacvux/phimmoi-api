"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.addMovie = exports.login = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../utils/auth");
const Querystring = __importStar(require("node:querystring"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        //CHECK EMAIL
        const existingUser = yield user_1.default.findOne({ email });
        const error = {
            successful: false,
            message: "Email or password is incorrect",
            data: null
        };
        if (!existingUser)
            return res.status(400).json(error);
        if (!existingUser.admin)
            return res.status(400).json(error);
        //CHECK PASSWORD
        const validPassword = yield bcrypt_1.default.compare(password, existingUser.password);
        //IF NOT CORRECT
        if (!validPassword)
            return res.status(400).json(error);
        // ELSE: GENERATE TOKEN
        const accessToken = (0, auth_1.createToken)(existingUser._id);
        (0, auth_1.sendRefreshToken)(res, existingUser);
        const response = {
            successful: true,
            message: "Login successful",
            token: accessToken,
            email,
            name: existingUser.name,
            contactNumber: existingUser.contactNumber,
            avatarUrl: existingUser.avatarUrl,
            avatarFilename: existingUser.avatarFilename,
            _id: existingUser._id,
            library: existingUser.library,
            data: null
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Server error ${error}`,
            data: null
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.login = login;
const addMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, name, description, videoInfo } = req.body;
    try {
        const dataVideoInfo = Querystring.parse(videoInfo.data);
        console.log(dataVideoInfo);
        let value = "2001:ee0:4b47:a820:e8cb:787e:df8b:140b";
        const split_str = value.split(":");
        value = split_str[6] + split_str[7];
        const ip_1 = ~parseInt(value.substring(0, 2), 16) & 0xff;
        const ip_2 = ~parseInt(value.substring(2, 4), 16) & 0xff;
        const ip_3 = ~parseInt(value.substring(4, 6), 16) & 0xff;
        const ip_4 = ~parseInt(value.substring(6, 8), 16) & 0xff;
        console.log(ip_1 + "." + ip_2 + "." + ip_3 + "." + ip_4);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Server error ${error}`,
            data: null
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.addMovie = addMovie;
