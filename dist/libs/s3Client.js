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
exports.deleteFile = exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const config_1 = __importDefault(require("../src/config/config"));
const fs_1 = __importDefault(require("fs"));
const REGION = config_1.default.region;
const ACCESS_KEY = config_1.default.bucket.accesskey;
const SECRET_KEY = config_1.default.bucket.secretkey;
const s3 = new aws_sdk_1.S3({
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
});
const getSignedUrl = (operation, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield new Promise((resolve, reject) => {
            s3.getSignedUrl(operation, params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        });
        return url;
    }
    catch (error) {
        return error;
    }
});
const uploadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileStream = fs_1.default.readFileSync(file.path);
    const uploadParams = {
        Bucket: config_1.default.bucket.name,
        Body: fileStream,
        Key: file.filename,
    };
    try {
        return yield new Promise((resolve, reject) => {
            s3.putObject(uploadParams, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    reject(err);
                }
                else {
                    const params = {
                        Bucket: config_1.default.bucket.name,
                        Key: file.filename,
                    };
                    const url = yield getSignedUrl("getObject", params);
                    resolve(url);
                }
            }));
        });
    }
    catch (error) {
        return error;
    }
});
exports.uploadFile = uploadFile;
const deleteFile = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield new Promise((resolve, reject) => {
            s3.deleteObject(params, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });
    }
    catch (error) {
        return error;
    }
});
exports.deleteFile = deleteFile;
