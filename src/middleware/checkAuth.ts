import { Secret, verify } from "jsonwebtoken";
import config from "../config/config";
import { Request, Response, NextFunction } from "express";
import IResponse from "../models/response";

export const checkAuth = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (token) {
    const accessToken = token.split(" ")[1];
    verify(
      accessToken,
      config.jwt.accesskey as Secret,
      async (err: any, decodedToken: any) => {
        if (err) {
          const error: IResponse = {
            message: err,
            successful: false,
            data: null
          };
          return res.status(403).json(error);
        }
        req.decodedToken = decodedToken;
        return next();
      }
    );
  } else {
    const error: IResponse = {
        message: 'Access Token is required',
        successful: false,
        data: null
      };
    res.status(401).json(error);
  }
};
