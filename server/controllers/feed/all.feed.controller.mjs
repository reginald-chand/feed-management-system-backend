import { logger } from "../../configs/logger.config.mjs";
import mongoose from "mongoose";

export const allFeedController = async (request, response) => {
  try {
    const currentPage = parseInt(request.query.page) || 1;
    const postsPerPage = parseInt(request.query.perPage) || 50;
    const postsToBeSkipped = (currentPage - 1) * postsPerPage;

    const database = mongoose.connection.db;

    const posts = await database
      .collection("posts")
      .find({})
      .skip(postsToBeSkipped)
      .limit(postsPerPage)
      .sort({ createdAt: -1 })
      .toArray();

    if (posts.length === 0) {
      return response.status(404).json({
        responseMessage: "No more posts to show. Please refresh the feed.",
      });
    }

    return response.status(200).json({ responseMessage: posts });
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
