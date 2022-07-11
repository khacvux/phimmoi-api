import { Request, Response } from "express";
import User, { IUserModel } from "../models/user";
import IResponse from "../models/response";
import bcrypt from "bcrypt";
import { sendRefreshToken, createToken } from "../utils/auth";
import { LoginType } from "../models/auth";
import mongoose from "mongoose";
import Movie from "../models/movie";
import config from "../config/config";
import { uploadFile, deleteFile } from "../../libs/s3Client";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    //CHECK EMAIL
    const existingUser = await User.findOne({ email });
    const error: IResponse = {
      successful: false,
      message: "Email or password is incorrect",
      data: null,
    };
    if (!existingUser) return res.status(400).json(error);
    if (existingUser.admin) return res.status(400).json(error);

    //CHECK PASSWORD
    const validPassword = await bcrypt.compare(password, existingUser.password);
    //IF NOT CORRECT
    if (!validPassword) return res.status(400).json(error);

    // ELSE GENERATE TOKEN
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
      library: existingUser.library,
      _id: existingUser._id,
      data: null,
    };
    return res.status(200).json(response);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Server error ${error}`,
      data: null,
    };
    console.log(e);
    return res.status(400).json(e);
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, contactNumber, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: IResponse = {
        successful: false,
        message: `Email already exists`,
        data: null,
      };
      return res.status(400).json(error);
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const _id = new mongoose.Types.ObjectId();

    const newUser: IUserModel = new User({
      _id,
      admin: false,
      email,
      password: hashed,
      name,
      avatarUrl: "",
      contactNumber,
    });
    await newUser.save();
    const response: IResponse = {
      successful: true,
      message: `Register Successfully`,
      data: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Server error ${error}`,
      data: null,
    };
    console.log(e);
    return res.status(400).json(e);
  }
};

const library = (req: any, res: Response) => {
  try {
    const { id } = req.decodedToken;
    User.findOne({ _id: id })
      .select("library")
      .exec((error, data) => {
        if (error) {
          const e: IResponse = {
            successful: false,
            message: `Error: ${error}`,
            data: null,
          };
          console.log(e);
          return res.status(400).json(e);
        } else {
          const response: IResponse = {
            successful: true,
            message: `ok`,
            data: data?.library,
          };
          return res.status(200).json(response);
        }
      });
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Error ${error}`,
      data: null,
    };
    return res.status(400).json(e);
  }
};

const saveToLibrary = (req: any, res: Response) => {
  try {
    const { id } = req.decodedToken;
    const idMovie = req.params.idmovie;

    Movie.findOne({ idMovie })
      .select("name posterUrl")
      .exec(async (error, data) => {
        if (error) {
          const e: IResponse = {
            successful: false,
            message: `Error: ${error}`,
            data: null,
          };
          return res.status(400).json(e);
        } else {
          User.findOne({ _id: id }).exec((error, data: any) => {
            if (error) {
              const e: IResponse = {
                message: `Error: ${error}`,
                successful: false,
                data: null,
              };
              return res.status(400).json(e);
            } else {
              const filter = data.library.map((item: any) => {
                if (item._id == idMovie) return idMovie;
              });
              if (filter[0]) {
                User.findOneAndUpdate(
                  { _id: id },
                  { $push: { library: data } }
                ).exec((error) => {
                  if (error) {
                    const e: IResponse = {
                      successful: false,
                      message: `Error: ${error}`,
                      data: null,
                    };
                    return res.status(400).json(e);
                  } else {
                    const response: IResponse = {
                      successful: true,
                      message: `added`,
                      data: null,
                    };
                    return res.status(200).json(response);
                  }
                });
              } else {
                const e: IResponse = {
                  message: `previously saved movies`,
                  successful: false,
                  data: null,
                };
                return res.status(400).json(e);
              }
            }
          });
        }
      });
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Error ${error}`,
      data: null,
    };
    return res.status(400).json(e);
  }
};

const unsaveToLibrary = (req: any, res: Response) => {
  try {
    const { id } = req.decodedToken;
    const idMovie = req.params.idmovie;

    User.findOneAndUpdate(
      { _id: id },
      { $pull: { library: { _id: idMovie } } }
    ).exec((error) => {
      if (error) {
        const e: IResponse = {
          successful: false,
          message: `Error: ${error}`,
          data: null,
        };
        console.log(e);
        return res.status(400).json(e);
      } else {
        const response: IResponse = {
          successful: true,
          message: `unsaved`,
          data: null,
        };
        return res.status(200).json(response);
      }
    });
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Error ${error}`,
      data: null,
    };
    return res.status(400).json(e);
  }
};

const checkSave = (req: any, res: Response) => {
  try {
    const { id } = req.decodedToken;
    const idMovie = req.params.idmovie;

    User.findOne({ _id: id }).exec((error, data: any) => {
      if (error) {
        const e: IResponse = {
          message: `Error: ${error}`,
          successful: false,
          data: null,
        };
        return res.status(400).json(e);
      } else {
        const filter = data.library.map((item: any) => {
          if (item._id == idMovie) return idMovie;
        });
        if (filter[0]) {
          const response: IResponse = {
            successful: true,
            message: `saved`,
            data: true,
          };
          return res.status(200).json(response);
        } else {
          const response: IResponse = {
            message: `unsaved`,
            successful: false,
            data: false,
          };
          return res.status(200).json(response);
        }
      }
    });
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Error ${error}`,
      data: null,
    };
    return res.status(400).json(e);
  }
};

const changePassword = async (req: any, res: Response) => {
  try {
    const { id } = req.decodedToken;
    const { password, newPassword } = req.body;

    const existingUser = await User.findOne({ _id: id });
    const error: IResponse = {
      successful: false,
      message: "password is incorrect",
      data: null,
    };
    if (!existingUser) return res.status(400).json(error);

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) return res.status(400).json(error);

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          password: hashed,
        },
      }
    );

    const response: IResponse = {
      successful: true,
      message: "updated",
      data: null,
    };
    return res.status(200).json(response);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Error ${error}`,
      data: null,
    };
    return res.status(400).json(e);
  }
};

const setAvatar = async (req: any, res: Response) => {
  try {
    const avatar = req.file;
    const avatarFilename = req.body.avatarFilename || undefined;
    const { id } = req.decodedToken;

    if (avatarFilename) {
      await deleteFile({
        Bucket: config.bucket.name,
        Key: avatarFilename,
      });
    }
    const avatarUrl = await uploadFile(avatar);

    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          avatarUrl,
          avatarFilename: avatar.filename,
        },
      }
    );

    const response: IResponse = {
      successful: true,
      message: "ok",
      data: null,
    };
    return res.status(200).json(response);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Error ${error}`,
      data: null,
    };
    return res.status(400).json(e);
  }
};

const changeName = async (req: any, res: Response) => {
  try {
    const newName = req.params.newname;
    const { id } = req.decodedToken;

    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: newName,
        },
      }
    );

    const response: IResponse = {
      successful: true,
      message: "ok",
      data: null,
    };
    return res.status(200).json(response);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Error ${error}`,
      data: null,
    };
    return res.status(400).json(e);
  }
};



export {
  login,
  register,
  library,
  saveToLibrary,
  unsaveToLibrary,
  checkSave,
  changePassword,
  setAvatar,
  changeName,
};
