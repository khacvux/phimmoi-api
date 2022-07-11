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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const USER = __importStar(require("../controlllers/user"));
const checkAuth_1 = require("../middleware/checkAuth");
const uploadFile_1 = __importDefault(require("../middleware/uploadFile"));
const routes = (0, express_1.Router)();
routes.post("/login", USER.login);
routes.post("/register", USER.register);
routes.get("/library/list", checkAuth_1.checkAuth, USER.library);
routes.put("/library/save/:idmovie", checkAuth_1.checkAuth, USER.saveToLibrary);
routes.put("/library/unsave/:idmovie", checkAuth_1.checkAuth, USER.unsaveToLibrary);
routes.post("/password/change", checkAuth_1.checkAuth, USER.changePassword);
routes.put("/name/change/:newname", checkAuth_1.checkAuth, USER.changeName);
routes.post("/avatar/set", uploadFile_1.default.single("avatar"), checkAuth_1.checkAuth, USER.setAvatar);
routes.get("/library/check", checkAuth_1.checkAuth, USER.checkSave);
exports.default = routes;
