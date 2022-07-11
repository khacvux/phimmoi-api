import { Router } from "express";
import * as MOVIE from "../controlllers/movie";
import { checkAuth } from "../middleware/checkAuth";
import upload from "../middleware/uploadFile";

const routes = Router();
routes.post(
  "/add",
  upload.fields([
    {
      name: "movieFile",
      maxCount: 1,
    },
    {
      name: "poster",
      maxCount: 1,
    },
  ]),
  checkAuth,
  MOVIE.add
);

routes.get("/category/:id", checkAuth, MOVIE.listByCategory);
routes.delete("/delete/:id", checkAuth, MOVIE.remove);
routes.get("/info/:id", checkAuth, MOVIE.info);
routes.post("/update/info", checkAuth, MOVIE.updateInfo);
routes.get("/search/:keyword", checkAuth, MOVIE.searchLikeName)
routes.post(
  "/update/poster",
  upload.single("poster"),
  checkAuth,  
  MOVIE.updatePoster
);

export default routes;
