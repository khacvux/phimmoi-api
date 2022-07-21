import { Router } from "express";
import { createAWSStream } from "../../libs/s3Client";
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
routes.get("/list", checkAuth, MOVIE.list);
routes.get("/newest", checkAuth, MOVIE.newest);
routes.get("/newest/list", checkAuth, MOVIE.top10Newest);
routes.get("/category/:id", checkAuth, MOVIE.listByCategory);
routes.delete("/delete/:id", checkAuth, MOVIE.remove);
routes.get("/info/:id", checkAuth, MOVIE.info);
routes.post("/update/info", checkAuth, MOVIE.updateInfo);
routes.get("/search/:keyword", checkAuth, MOVIE.searchLikeName);
routes.post(
  "/update/poster",
  upload.single("poster"),
  checkAuth,
  MOVIE.updatePoster
);
routes.get("/play/:filename", MOVIE.play);
// routes.get("/play", async (req, res) => {
//   const stream = await createAWSStream("1658321300619-964087142-IMG_1240.MOV");
//   console.log(stream)
//   stream.pipe(res);
// });

export default routes;
