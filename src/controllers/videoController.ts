import routes from "../routes";
import { Request, Response, NextFunction } from "express";
import Video, { IVideo } from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find({});
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req: Request, res: Response) => {
  const {
    query: { term: searchingBy }
  } = req;
  let videos: IVideo[] = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req: Request, res: Response) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req: Request, res: Response) => {
  const {
    body: { title, description },
    file: { location }
  }: { file: any; body: any } = req;
  const creator = req.user["id"];
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator
  });
  const v = req.user["videos"];
  v.push(newVideo.id);
  await req.user["save"]();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate({
        model: "User",
        path: "creator"
      })
      .populate({
        path: "comments",
        populate: {
          model: "User",
          path: "creator"
        }
      });

    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user["id"]) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req: Request, res: Response) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id).populate("comments");
    if (String(video.creator) !== req.user["id"]) {
      throw Error();
    } else {
      video.comments.forEach(
        async c => await Comment.findOneAndRemove({ _id: c.id })
      );
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

export const postRegisterView = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req: Request, res: Response) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const creator = req.user["id"];
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator
    });
    video.comments.push(newComment.id);
    video.save();
    const commentId = newComment.id;
    res.status(200).json({ user, commentId });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req;
  try {
    const comment = await Comment.findById(id);
    const creator = String(comment["creator"]);
    if (creator !== req.user["id"]) {
      throw Error();
    } else {
      await Comment.findOneAndRemove({ _id: id });
    }
    res.status(200);
  } catch (error) {
    console.log(error);
  } finally {
    res.end();
  }
};
