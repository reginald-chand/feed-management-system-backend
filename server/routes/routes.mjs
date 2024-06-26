import { allFeedController } from "../controllers/feed/all.feed.controller.mjs";
import express from "express";
import { followingFeedController } from "../controllers/feed/following.feed.controller.mjs";
import { userVerificationMiddleware } from "../middlewares/user.verification.middleware.mjs";

export const routes = express.Router();

routes.get("/feeds/all", userVerificationMiddleware, allFeedController);

routes.get(
  "/feeds/followings",
  userVerificationMiddleware,
  followingFeedController
);
