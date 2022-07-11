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
exports.info = exports.listByCategory = exports.searchLikeName = exports.updatePoster = exports.updateInfo = exports.remove = exports.add = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const s3Client_1 = require("../../libs/s3Client");
const movie_1 = __importDefault(require("../models/movie"));
const categoryMovie_1 = __importDefault(require("../models/categoryMovie"));
const config_1 = __importDefault(require("../config/config"));
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, category } = req.body;
        const movieFile = req.files.movieFile[0];
        const poster = req.files.poster[0];
        if (movieFile.mimetype.substr(0, 5) != "video" ||
            poster.mimetype.substr(0, 5) != "image") {
            const error = {
                successful: false,
                message: "Invalid type!",
                data: null,
            };
            return res.status(400).json(error);
        }
        //PUT MOVIE AND POSTER
        const movieUrl = yield (0, s3Client_1.uploadFile)(movieFile);
        const posterUrl = yield (0, s3Client_1.uploadFile)(poster);
        const idMovie = new mongoose_1.default.Types.ObjectId();
        const newMovie = new movie_1.default({
            idMovie,
            name,
            idCategory: category,
            description,
            movieUrl: movieUrl,
            movieFilename: movieFile.filename,
            posterUrl: posterUrl,
            posterFilename: poster.filename,
            duration: "",
            view: 0,
        });
        yield newMovie.save();
        const response = {
            successful: true,
            message: "added",
            data: null,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error: ${error}`,
            data: null,
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.add = add;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idMovie = req.params.id;
        const existingMovie = yield movie_1.default.findOne({ idMovie });
        const error = {
            successful: false,
            message: "Movie does not existing",
            data: null,
        };
        if (!existingMovie)
            return res.status(400).json(error);
        yield (0, s3Client_1.deleteFile)({
            Bucket: config_1.default.bucket.name,
            Key: existingMovie.movieFilename,
        });
        yield (0, s3Client_1.deleteFile)({
            Bucket: config_1.default.bucket.name,
            Key: existingMovie.posterFilename,
        });
        movie_1.default.deleteOne({ idMovie }, (error) => {
            if (error) {
                const e = {
                    successful: false,
                    message: error,
                    data: null,
                };
                return res.status(400).json(e);
            }
            else {
                const response = {
                    successful: true,
                    message: "delete success",
                    data: null,
                };
                return res.status(200).json(response);
            }
        });
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error: ${error}`,
            data: null,
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.remove = remove;
const updateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idMovie, name, description, idCategory } = req.body;
        yield movie_1.default.findOneAndUpdate({ idMovie }, {
            $set: {
                name,
                description,
                idCategory,
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
            message: `Error: ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
});
exports.updateInfo = updateInfo;
const updatePoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poster = req.file;
        const { idMovie, filename } = req.body;
        yield (0, s3Client_1.deleteFile)({
            Bucket: config_1.default.bucket.name,
            Key: filename,
        });
        const posterUrl = yield (0, s3Client_1.uploadFile)(poster);
        yield movie_1.default.findOneAndUpdate({ idMovie }, {
            $set: {
                posterFilename: poster.filename,
                posterUrl
            }
        });
        const response = {
            successful: true,
            message: "poster updated",
            data: null,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error: ${error}`,
            data: null,
        };
        return res.status(400).json(e);
    }
});
exports.updatePoster = updatePoster;
const searchLikeName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyword = req.params.keyword;
        const result = yield movie_1.default.find({ name: { $regex: keyword } });
        const response = {
            successful: true,
            message: `ok`,
            data: result,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error: ${error}`,
            data: null,
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.searchLikeName = searchLikeName;
const listByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idCategory = req.params.id;
        movie_1.default.find({ idCategory })
            .select("idMovie name description movieUrl posterUrl duration views")
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
                    data: data,
                };
                return res.status(200).json(response);
            }
        });
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error: ${error}`,
            data: null,
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.listByCategory = listByCategory;
const info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idMovie = req.params.id;
        const existingMovie = yield movie_1.default.findOne({ idMovie });
        const error = {
            successful: false,
            message: "Movie does not existing",
            data: null,
        };
        if (!existingMovie)
            return res.status(400).json(error);
        const category = yield categoryMovie_1.default.findOne({
            idCategory: existingMovie.idCategory,
        });
        const response = {
            idMovie: existingMovie._id,
            name: existingMovie.name,
            category: category === null || category === void 0 ? void 0 : category.name,
            description: existingMovie.description,
            movieUrl: existingMovie.movieUrl,
            posterUrl: existingMovie.posterUrl,
            duration: existingMovie.duration,
            views: 0,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Error: ${error}`,
            data: null,
        };
        console.log(e);
        return res.status(400).json(e);
    }
});
exports.info = info;
