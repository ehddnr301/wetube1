import passport from "passport";
import routes from "../routes";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";

export const githubLogin = passport.authenticate("github");
export const kakaoLogin = passport.authenticate("kakao");

export const postGithubLogIn = (req: Request, res: Response) => {
  res.redirect(routes.home);
};
export const postKakaoLogIn = (req: Request, res: Response) => {
  res.redirect(routes.home);
};

export const getJoin = (req: Request, res: Response) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords don't match");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = new User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getMe = async (req: Request, res: Response) => {
  const id = req.user["id"];
  const userMe = await User.findById(id).populate("videos");
  res.render("userDetail", {
    pageTitle: "User Detail",
    user: req.user,
    userMe
  });
};

export const getLogin = (req: Request, res: Response) =>
  res.render("login", { pageTitle: "Log In" });
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome",
  failureFlash: "Can't log in. Check email and/or password"
});

export const logout = (req: Request, res: Response) => {
  req.logout();
  res.redirect(routes.home);
  req.flash("info", "Logged out, see you later");
};

export const userDetail = async (req: Request, res: Response) => {
  const {
    params: { id }
  } = req;
  try {
    const userMe = await User.findById(id).populate({
      model: "Video",
      path: "videos"
    });
    res.render("userDetail", { pageTitle: "User Detail", userMe });
  } catch (error) {
    req.flash("error", "User not found");
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req: Request, res: Response) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    res.redirect(routes.me);
    req.flash("success", "Profile updated");
  } catch (error) {
    res.redirect(routes.editProfile);
    req.flash("error", "Can't update profile");
  }
};

export const getChangePassword = (req: Request, res: Response) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req: Request, res: Response) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      req.flash("error", "Passwords don't match");
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user["changePassword"](oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    req.flash("error", "Can't change password");
    res.redirect(`/users/${routes.changePassword}`);
  }
};

export const githubLoginCallback = async (
  _: any,
  __: any,
  profile: UserResponse,
  cb: any
) => {
  const {
    _json: { id, avatar_url, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const kakaoLoginCallback = async (
  _: any,
  __: any,
  profile: KUserResponse,
  cb: any
) => {
  const {
    _raw,
    _json: {
      properties: { nickname },
      id,
      kakao_account: { email }
    }
  } = profile;
  let profileImage: string;
  if (_raw.includes("profile_image_url")) {
    const a = _raw.split(",");
    const c = a.filter(b => b.includes("profile_image_url"));
    const d = c[0].split(":")[2].slice(0, -2);
    profileImage = `http:${d}`;
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      nickname,
      kakaoId: id,
      avatarUrl: profileImage
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
