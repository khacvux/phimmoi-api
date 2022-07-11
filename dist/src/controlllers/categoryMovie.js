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
exports.remove = exports.list = exports.add = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categoryMovie_1 = __importDefault(require("../models/categoryMovie"));
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const existingCategory = yield categoryMovie_1.default.findOne({ name });
        if (existingCategory) {
            const e = {
                successful: false,
                message: "Category already exists",
                data: null,
            };
            return res.status(400).json(e);
        }
        const idCategory = new mongoose_1.default.Types.ObjectId();
        const newCategory = new categoryMovie_1.default({
            name,
            idCategory,
        });
        yield newCategory.save();
        const response = {
            successful: true,
            message: `Added`,
            data: null,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Server Error.. ${error}`,
            data: null,
        };
        return res.status(500).json(e);
    }
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const list = yield categoryMovie_1.default.find();
        const response = {
            successful: true,
            message: `Successful`,
            data: list,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        const e = {
            successful: false,
            message: `Server Error.. ${error}`,
            data: null,
        };
        return res.status(500).json(e);
    }
});
exports.list = list;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        categoryMovie_1.default.findOneAndDelete({ _id }, (error) => {
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
            message: `Server Error.. ${error}`,
            data: null,
        };
        return res.status(500).json(e);
    }
});
exports.remove = remove;
