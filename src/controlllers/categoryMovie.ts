import { Request, Response } from "express";
import mongoose from "mongoose";
import Category, { CategoryMovieModel } from "../models/categoryMovie";

import IResponse from "../models/response";

const add = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      const e: IResponse = {
        successful: false,
        message: "Category already exists",
        data: null,
      };
      return res.status(400).json(e);
    }
    const idCategory = new mongoose.Types.ObjectId();

    const newCategory: CategoryMovieModel = new Category({
      name,
      idCategory,
    });
    await newCategory.save();
    const response: IResponse = {
      successful: true,
      message: `Added`,
      data: null,
    };
    return res.status(200).json(response);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Server Error.. ${error}`,
      data: null,
    };
    return res.status(500).json(e);
  }
};

const list = async (req: Request, res: Response) => {
  try {
    const list = await Category.find();
    const response: IResponse = {
      successful: true,
      message: `Successful`,
      data: list,
    };
    return res.status(200).json(response);
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Server Error.. ${error}`,
      data: null,
    };
    return res.status(500).json(e);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    Category.findOneAndDelete({ _id }, (error: any) => {
      if (error) {
        const e: IResponse = {
          successful: false,
          message: error,
          data: null,
        };
        return res.status(400).json(e);
      } else {
        const response: IResponse = {
          successful: true,
          message: "delete success",
          data: null,
        };
        return res.status(200).json(response);
      }
    });
  } catch (error) {
    const e: IResponse = {
      successful: false,
      message: `Server Error.. ${error}`,
      data: null,
    };
    return res.status(500).json(e);
  }
};

export { add, list, remove };
