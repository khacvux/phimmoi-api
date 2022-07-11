import { sign, Secret } from "jsonwebtoken";
import config from "../config/config";
import { Types } from "mongoose";
import { Response } from "express";
import { IUserModel } from "../models/user";

export const createToken = (id: Types.ObjectId) => {
  return sign({ id }, config.jwt.accesskey as Secret, {
    expiresIn: "24h",
  });
};

export const sendRefreshToken = (res: Response, user: IUserModel) => {
    res.cookie(config.jwt.refreshkey as string, createToken(user._id), {
        secure: true,
        sameSite: 'lax',
        path: '/refresh_token'
    });
};
