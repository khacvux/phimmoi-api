import { Document, Schema, model as MongooseModel } from "mongoose";

export interface IMovie {
  idMovie: any;
  name: string;
  description: string;
  movieUrl: string;
  posterUrl: string;
  duration: string;
  views: number;
}

export interface infoMovieModel extends IMovie {
  category: any,
}

export interface MovieModel extends IMovie, Document {
  posterFilename: string;
  movieFilename: string;
  idCategory: string;

}

const movieSchema = new Schema(
  {
    name: { type: String, require: true },
    idCategory: { type: String, require: true },
    description: { type: String, require: false },
    movieUrl: { type: String, require: true },
    movieFilename: { type: String, require: true },
    posterUrl: { type: String, require: true },
    posterFilename: { type: String, require: true },
    duration: { type: String, require: false },
    views: { type: Number, require: false },
  },
  {
    timestamps: true,
  }
);

export default MongooseModel<MovieModel>("Movie", movieSchema);
