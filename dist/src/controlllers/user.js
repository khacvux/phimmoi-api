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
exports.changeName = exports.setAvatar = exports.changePassword = exports.checkSave = exports.unsaveToLibrary = exports.saveToLibrary = exports.library = exports.register = exports.login = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../utils/auth");
const mongoose_1 = __importDefault(require("mongoose"));
const movie_1 = __importDefault(require("../models/movie"));
const config_1 = __importDefault(require("../config/config"));
const s3Client_1 = require("../../libs/s3Client");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        //CHECK EMAIL
        const existingUser = yield user_1.default.findOne({ email });
        const error = {
            successful: false,
            message: "Email or password is incorrect",
            data: null,
        };
        if (!existingUser)
            return res.status(400).json(error);
        if (existingUser.admin)
            return res.status(400).json(error);
        //CHECK PASSWORD
        const validPassword = yield bcrypt_1.default.compare(password, existingUser.password);
        //IF NOT CORRECT
        if (!validPassword)
            return res.status(400).json(error);
        // ELSE GENERATE TOKEN
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
            library: existingUser.library,
            _id: existingUser._id,
            data: null,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Server error ${error}`,
            data: null,
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, contactNumber, name } = req.body;
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            const error = {
                successful: false,
                message: `Email already exists`,
                data: null,
            };
            return res.status(400).json(error);
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const _id = new mongoose_1.default.Types.ObjectId();
        const newUser = new user_1.default({
            _id,
            admin: false,
            email,
            password: hashed,
            name,
            avatarUrl: "",
            contactNumber,
        });
        yield newUser.save();
        const response = {
            successful: true,
            message: `Register Successfully`,
            data: null,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Server error ${error}`,
            data: null,
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.register = register;
const library = (req, res) => {
    try {
        const { id } = req.decodedToken;
        user_1.default.findOne({ _id: id })
            .select("library")
            .exec((error, data) => {
            if (error) {
                const e = {
                    successful: false,
                    message: `Error: ${error}`,
                    data: null,
                };
                console.log(e);
                return res.status(400).json(e);
            }
            else {
                const response = {
                    successful: true,
                    message: `ok`,
                    data: data === null || data === void 0 ? void 0 : data.library,
                };
                return res.status(200).json(response);
            }
        });
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
};
exports.library = library;
const saveToLibrary = (req, res) => {
    try {
        const { id } = req.decodedToken;
        const idMovie = req.params.idmovie;
        movie_1.default.findOne({ idMovie })
            .select("name posterUrl")
            .exec((error, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                const e = {
                    successful: false,
                    message: `Error: ${error}`,
                    data: null,
                };
                return res.status(400).json(e);
            }
            else {
                user_1.default.findOne({ _id: id }).exec((error, data) => {
                    if (error) {
                        const e = {
                            message: `Error: ${error}`,
                            successful: false,
                            data: null,
                        };
                        return res.status(400).json(e);
                    }
                    else {
                        const filter = data.library.map((item) => {
                            if (item._id == idMovie)
                                return idMovie;
                        });
                        if (filter[0]) {
                            user_1.default.findOneAndUpdate({ _id: id }, { $push: { library: data } }).exec((error) => {
                                if (error) {
                                    const e = {
                                        successful: false,
                                        message: `Error: ${error}`,
                                        data: null,
                                    };
                                    return res.status(400).json(e);
                                }
                                else {
                                    const response = {
                                        successful: true,
                                        message: `added`,
                                        data: null,
                                    };
                                    return res.status(200).json(response);
                                }
                            });
                        }
                        else {
                            const e = {
                                message: `previously saved movies`,
                                successful: false,
                                data: null,
                            };
                            return res.status(400).json(e);
                        }
                    }
                });
            }
        }));
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
};
exports.saveToLibrary = saveToLibrary;
const unsaveToLibrary = (req, res) => {
    try {
        const { id } = req.decodedToken;
        const idMovie = req.params.idmovie;
        user_1.default.findOneAndUpdate({ _id: id }, { $pull: { library: { _id: idMovie } } }).exec((error) => {
            if (error) {
                const e = {
                    successful: false,
                    message: `Error: ${error}`,
                    data: null,
                };
                console.log(e);
                return res.status(400).json(e);
            }
            else {
                const response = {
                    successful: true,
                    message: `unsaved`,
                    data: null,
                };
                return res.status(200).json(response);
            }
        });
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
};
exports.unsaveToLibrary = unsaveToLibrary;
const checkSave = (req, res) => {
    try {
        const { id } = req.decodedToken;
        const idMovie = req.params.idmovie;
        user_1.default.findOne({ _id: id }).exec((error, data) => {
            if (error) {
                const e = {
                    message: `Error: ${error}`,
                    successful: false,
                    data: null,
                };
                return res.status(400).json(e);
            }
            else {
                const filter = data.library.map((item) => {
                    if (item._id == idMovie)
                        return idMovie;
                });
                if (filter[0]) {
                    const response = {
                        successful: true,
                        message: `saved`,
                        data: true,
                    };
                    return res.status(200).json(response);
                }
                else {
                    const response = {
                        message: `unsaved`,
                        successful: false,
                        data: false,
                    };
                    return res.status(200).json(response);
                }
            }
        });
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
};
exports.checkSave = checkSave;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.decodedToken;
        const { password, newPassword } = req.body;
        const existingUser = yield user_1.default.findOne({ _id: id });
        const error = {
            successful: false,
            message: "password is incorrect",
            data: null,
        };
        if (!existingUser)
            return res.status(400).json(error);
        const validPassword = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!validPassword)
            return res.status(400).json(error);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(newPassword, salt);
        yield user_1.default.findOneAndUpdate({ _id: id }, {
            $set: {
                password: hashed,
            },
        });
        const response = {
            successful: true,
            message: "updated",
            data: null,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
});
exports.changePassword = changePassword;
const setAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const avatar = req.file;
        const avatarFilename = req.body.avatarFilename || undefined;
        const { id } = req.decodedToken;
        if (avatarFilename) {
            yield (0, s3Client_1.deleteFile)({
                Bucket: config_1.default.bucket.name,
                Key: avatarFilename,
            });
        }
        const avatarUrl = yield (0, s3Client_1.uploadFile)(avatar);
        yield user_1.default.findOneAndUpdate({ _id: id }, {
            $set: {
                avatarUrl,
                avatarFilename: avatar.filename,
            },
        });
        const response = {
            successful: true,
            message: "ok",
            data: null,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
});
exports.setAvatar = setAvatar;
const changeName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newName = req.params.newname;
        const { id } = req.decodedToken;
        yield user_1.default.findOneAndUpdate({ _id: id }, {
            $set: {
                name: newName,
            },
        });
        const response = {
            successful: true,
            message: "ok",
            data: null,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
});
exports.changeName = changeName;
