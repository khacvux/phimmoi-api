import { Document, Schema, model as MongooseModel } from "mongoose";

export interface ICategoryMovie {
  name: string;
  idCategory: any;
}

export interface CategoryMovieModel extends ICategoryMovie, Document {}

const categorySchema = new Schema(
  {
    name: { type: String, require: true },
  },
  { timestamps: true }
);

export default MongooseModel<CategoryMovieModel>("Category", categorySchema);
