"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    name: { type: String, require: true },
    idCategory: { type: String, require: true },
    description: { type: String, require: false },
    movieUrl: { type: String, require: true },
    movieFilename: { type: String, require: true },
    posterUrl: { type: String, require: true },
    posterFilename: { type: String, require: true },
    duration: { type: String, require: false },
    views: { type: Number, require: false },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Movie", movieSchema);
