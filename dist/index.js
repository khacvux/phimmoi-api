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
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./src/config/config"));
const mongo_1 = require("./src/config/mongo");
const routes_1 = __importDefault(require("./src/routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const PORT = config_1.default.server.port;
const MONGO_URL = config_1.default.mongo.url;
// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       version: "1.0.0",
//       title: "phimmoi",
//       description: "phoake"
//     },
//     servers: [
//       {
//         url: 'http://localhost:8000/'
//       }
//     ],
//     apis: ["./routes/*.ts"]
//   }
// }
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_1.ConnectDB)(MONGO_URL);
    app.use((0, morgan_1.default)('tiny'));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb' }));
    app.use((0, cors_1.default)());
    // app.use("/docs-api", 
    //   swaggerUi.serve,
    //   swaggerUi.setup(undefined, {
    //     swaggerOptions: {
    //       url: "/swagger.json",
    //     },
    //   })
    // )
    app.set('trust proxy', 1);
    (0, routes_1.default)(app);
    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
});
main().catch((error) => console.log(error));
