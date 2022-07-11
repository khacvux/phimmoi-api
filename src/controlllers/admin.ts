import { Request, Response } from "express";
import User from "../models/user";
import IResponse from "../models/response";
import bcrypt from "bcrypt";
import { sendRefreshToken, createToken } from "../utils/auth";
import { LoginType } from "../models/auth";
import * as Querystring from "node:querystring";


const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    //CHECK EMAIL
    const existingUser = await User.findOne({ email });
    const error: IResponse = {
      successful: false,
      message: "Email or password is incorrect",
      data: null
    };
    if (!existingUser) return res.status(400).json(error);
    if (!existingUser.admin) return res.status(400).json(error);

    //CHECK PASSWORD
    const validPassword = await bcrypt.compare(password, existingUser.password);
    //IF NOT CORRECT
    if (!validPassword) return res.status(400).json(error);

    // ELSE: GENERATE TOKEN
    const accessToken = createToken(existingUser._id);
    sendRefreshToken(res, existingUser);
    const response: LoginType = {
      successful: true,
      message: "Login successful",
      token: accessToken,
      email,
      name: existingUser.name,
      contactNumber: existingUser.contactNumber,
      avatarUrl: existingUser.avatarUrl,
      avatarFilename: existingUser.avatarFilename,
      _id: existingUser._id,
      library: existingUser.library,
      data: null
    };

    return res.status(200).json(response);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Server error ${error}`,
      data: null
    };
    console.log(e);
    return res.status(400).json(e);
  }
};

const addMovie = async (req: Request, res: Response) => {
  const { image, name, description, videoInfo } = req.body;
  try {
    const dataVideoInfo = Querystring.parse(videoInfo.data);
    console.log(dataVideoInfo);
   

    let value = "2001:ee0:4b47:a820:e8cb:787e:df8b:140b";

    const split_str = value.split(":");
    value = split_str[6] + split_str[7];

    const ip_1 = ~parseInt(value.substring(0, 2), 16) & 0xff;
    const ip_2 = ~parseInt(value.substring(2, 4), 16) & 0xff;
    const ip_3 = ~parseInt(value.substring(4, 6), 16) & 0xff;
    const ip_4 = ~parseInt(value.substring(6, 8), 16) & 0xff;

    console.log(ip_1 + "." + ip_2 + "." + ip_3 + "." + ip_4);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Server error ${error}`,
      data: null
    };
    console.log(e);
    return res.status(400).json(e);
  }
};

export { login, addMovie };
