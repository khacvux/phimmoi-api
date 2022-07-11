"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const admin_1 = __importDefault(require("./admin"));
const categoryMovie_1 = __importDefault(require("./categoryMovie"));
const movie_1 = __importDefault(require("./movie"));
function router(app) {
    app.use('/user', user_1.default);
    app.use('/admin', admin_1.default);
    app.use('/category', categoryMovie_1.default);
    app.use('/movie', movie_1.default);
}
exports.default = router;
