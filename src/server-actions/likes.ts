"use server";

import ConnectToMongoDB from "@/config/ConnectToMongoDB";
import postModel from "@/models/post-model";
import { postcss } from "tailwindcss";

ConnectToMongoDB();

export const likePost = async ({
  postId = "",
  userId = "",
}: {
  postId: string;
  userId: string;
}) => {
  try {
    const post = await postModel.findOne({ _id: postId });
    if (post) {
      await postModel.findByIdAndUpdate(
        postId,
        {
          $push: { likedBy: userId },
        },
        { new: true }
      );
      return {
        success: true,
        message: "Liked the post successfully",
        data: null,
      };
    } else {
      return {
        success: false,
        message: "Post not found to like for",
        data: null,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};

export const unlikePost = async ({
    postId = "",
    userId = "",
  }: {
    postId: string;
    userId: string;
  }) => {
    try {
      const post = await postModel.findOne({ _id: postId });
      if (post) {
        await postModel.findByIdAndUpdate(
          postId,
          {
            $pull: { likedBy: userId },
          },
          { new: true }
        );
        return {
          success: true,
          message: "Removed your like from the post successfully",
          data: null,
        };
      } else {
        return {
          success: false,
          message: "Post not found to like for",
          data: null,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  };
  
export const getPostLikes = async (postId: string) => {
    try {
      const post = await postModel.findOne({ _id: postId }).populate("likedBy");
      if (post && post.likedBy.length !== 0) {
        return {
          success: true,
          message: "Fetched likes of this selected post successfully",
          data: JSON.parse(JSON.stringify(post.likedBy)),
        };
      } else {
        return {
          success: false,
          message: "Post hasn't received any likes yet.",
          data: null,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  };