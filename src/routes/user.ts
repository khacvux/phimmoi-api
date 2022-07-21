import { Router } from "express";
import * as USER from "../controlllers/user";
import { checkAuth } from "../middleware/checkAuth";
import upload from "../middleware/uploadFile";

const routes = Router();

routes.post("/login", USER.login);
routes.post("/register", USER.register);
routes.get("/library/list", checkAuth, USER.library);
routes.get("/library/save/:idmovie", checkAuth, USER.saveToLibrary);
routes.get("/library/unsave/:idmovie", checkAuth, USER.unsaveToLibrary);
routes.get("/library/check/:idmovie", checkAuth, USER.checkSave)
routes.post("/password/change", checkAuth, USER.changePassword);
routes.get("/name/change/:newname", checkAuth, USER.changeName);
routes.post("/avatar/set", upload.single("avatar"), checkAuth, USER.setAvatar);


export default routes;
