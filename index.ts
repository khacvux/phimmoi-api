import express, { Express, Request, Response } from "express";
import config from "./src/config/config";
import { ConnectDB } from "./src/config/mongo";
import router from "./src/routes";
import bodyParser from 'body-parser';
import cors from 'cors'
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";


const app: Express = express();

const PORT = config.server.port;
const MONGO_URL = config.mongo.url;

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

const main = async () => {
  await ConnectDB(MONGO_URL);

  app.use(morgan('tiny'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cors());
  // app.use("/docs-api", 
  //   swaggerUi.serve,
  //   swaggerUi.setup(undefined, {
  //     swaggerOptions: {
  //       url: "/swagger.json",
  //     },
  //   })
  // )
  app.set('trust proxy', 1)

  router(app);
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
};

main().catch((error) => console.log(error));
