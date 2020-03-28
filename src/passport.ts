import passport from "passport";
import GithubStrategy from "passport-github";
import { Strategy as KaKaoStrategy } from "passport-kakao";
import User from "./models/User";
import {
  githubLoginCallback,
  kakaoLoginCallback
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: `https://vast-journey-52774.herokuapp.com${routes.githubCallback}`
    },
    githubLoginCallback
  )
);

passport.use(
  new KaKaoStrategy(
    {
      clientID: process.env.KAKAO_KEY,
      clientSecret: process.env.KAKAO_SECRET,
      callbackURL: routes.kakaoCallback
    },
    kakaoLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
