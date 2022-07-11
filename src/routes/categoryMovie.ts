import { Router } from "express";
import * as CATEGORY from '../controlllers/categoryMovie'
import { checkAuth } from "../middleware/checkAuth";

const routes = Router();
routes.post("/add", checkAuth, CATEGORY.add)
routes.get("/list", checkAuth, CATEGORY.list)
routes.post("/remove", checkAuth, CATEGORY.remove)

export default routes;