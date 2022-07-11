import { Router } from "express";
import * as ADMIN from "../controlllers/admin";

const routes = Router();
routes.post("/login", ADMIN.login);

export default routes;
