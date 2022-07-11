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
const MOVIE = __importStar(require("../controlllers/movie"));
const checkAuth_1 = require("../middleware/checkAuth");
const uploadFile_1 = __importDefault(require("../middleware/uploadFile"));
const routes = (0, express_1.Router)();
routes.post("/add", uploadFile_1.default.fields([
    {
        name: "movieFile",
        maxCount: 1,
    },
    {
        name: "poster",
        maxCount: 1,
    },
]), checkAuth_1.checkAuth, MOVIE.add);
routes.get("/category/:id", checkAuth_1.checkAuth, MOVIE.listByCategory);
routes.delete("/delete/:id", checkAuth_1.checkAuth, MOVIE.remove);
routes.get("/info/:id", checkAuth_1.checkAuth, MOVIE.info);
routes.post("/update/info", checkAuth_1.checkAuth, MOVIE.updateInfo);
routes.get("/search/:keyword", checkAuth_1.checkAuth, MOVIE.searchLikeName);
routes.post("/update/poster", uploadFile_1.default.single("poster"), checkAuth_1.checkAuth, MOVIE.updatePoster);
exports.default = routes;
