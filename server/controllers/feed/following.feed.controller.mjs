import { logger } from "../../configs/logger.config.mjs";
import mongoose from "mongoose";
import { userObjectValidator } from "../../validators/user/user.object.validator.mjs";

export const followingFeedController = async (request, response) => {
  const { error, value } = userObjectValidator.validate(request.body);

  if (error) {
    return response.status(400).json({ responseMessage: error.message });
  }

  const { userData } = value;

  const userId = new mongoose.Types.ObjectId(userData.id);

  try {
    let listOfUserNamesFromFollowings = [];
    let allPosts = [];

    const currentPage = parseInt(request.query.page) || 1;
    const postsPerPage = parseInt(request.query.perPage) || 50;
    const postsToBeSkipped = (currentPage - 1) * postsPerPage;

    const database = mongoose.connection.db;

    const followingsCollection = await database
      .collection("followings")
      .findOne({ _id: userId });

    if (followingsCollection === null) {
      return response.status(404).json({
        responseMessage:
          "!OOPS. You are not following anyone. Please try following someone.",
      });
    }

    if (!userId.equals(followingsCollection._id)) {
      return response.status(401).json({ responseMessage: "UnAuthorized." });
    }

    followingsCollection.followings.forEach((following) => {
      listOfUserNamesFromFollowings.push(following.userName);
    });

    for (const userName of listOfUserNamesFromFollowings) {
      const posts = await database
        .collection("posts")
        .find({ userName: userName })
        .skip(postsToBeSkipped)
        .limit(postsPerPage)
        .sort({ createdAt: -1 })
        .toArray();

      if (posts.length === 0) {
        return response.status(404).json({
          responseMessage: "No more posts to show. Please refresh the feed.",
        });
      }

      allPosts.push(posts);
    }

    return response.status(200).json({ responseMessage: allPosts });
  } catch (error) {
    logger.log({
      level: "error",
      message: error,
      additional: "Internal server error.",
    });

    return response.status(500).json({
      responseMessage: "Internal server error.",
    });
  }
};
