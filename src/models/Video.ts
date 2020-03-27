import mongoose from "mongoose";
import { IComment } from "./Comment";
import { IUser } from "./User";

export interface IVideo extends mongoose.Document {
  comments: IComment[];
  fileUrl: string;
  title: string;
  description: string;
  createAt: Date;
  creator: IUser;
  views: number;
}

const VideoSchema: mongoose.Schema<IVideo> = new mongoose.Schema({
  comments: [
    {
      ref: "Comment",
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  creator: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    default: Date.now,
    type: Date
  },
  description: String,
  fileUrl: {
    required: "File URL is required",
    type: String
  },
  title: {
    required: "Title is required",
    type: String
  },
  views: {
    default: 0,
    type: Number
  }
});

const model = mongoose.model<IVideo & mongoose.Document>("Video", VideoSchema);

export default model;
