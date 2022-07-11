import { Document, Schema, model as MongooseModel } from "mongoose";

export interface LibraryModel {
  idMovie: any;
  name: string;
  posterUrl: string;
}

export interface IUser {
  admin: boolean;
  email: string;
  password: string;
  name: string | undefined;
  avatarUrl: string;
  avatarFilename: string;
  contactNumber: string;
  library: Array<LibraryModel>;
}
export interface IUserModel extends IUser, Document {}

const userSchema = new Schema(
  {
    admin: { type: Boolean, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    avatarFilename: { type: String, required: false },
    contactNumber: { type: String, required: false },
    library: {
      type: [
        {
          idMovie: String,
          name: String,
          posterUrl: String
        },
      ],
      required: false,
    },
  },
  { timestamps: true }
);

export default MongooseModel<IUserModel>("User", userSchema);
