import { Router } from "express";
import * as USER from "../controlllers/user";
import { checkAuth } from "../middleware/checkAuth";
import upload from "../middleware/uploadFile";

const routes = Router();

routes.post("/login", USER.login);
routes.post("/register", USER.register);
routes.get("/library/list", checkAuth, USER.library);
routes.put("/library/save/:idmovie", checkAuth, USER.saveToLibrary);
routes.put("/library/unsave/:idmovie", checkAuth, USER.unsaveToLibrary);
routes.post("/password/change", checkAuth, USER.changePassword);
routes.put("/name/change/:newname", checkAuth, USER.changeName);
routes.post("/avatar/set", upload.single("avatar"), checkAuth, USER.setAvatar);
routes.get("/library/check", checkAuth, USER.checkSave)


export default routes;
