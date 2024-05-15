"use server";

import ConnectToMongoDB from "@/config/ConnectToMongoDB";
import postModel from "@/models/post-model";
import { getCurrentUserFromMongoDB } from "./users";

ConnectToMongoDB();

export const createPost = async (payload: any) => {
  try {
    const post = new postModel(payload);
    await post.save();
    return {
      success: true,
      message: "Post is created successfully",
      data: null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};

export const getTimelinePostsOfLoggedInUser = async () => {
  try {
    let currentUser = null;
    const response = await getCurrentUserFromMongoDB();
    if (response.success) {
      currentUser = response.data;
    }
    const posts = await postModel
      .find({
        $or: [
          { user: currentUser?._id },
          { user: { $in: currentUser?.following } },
        ],
        isArchived: false,
      })
      .populate("user")
      .sort({ createdAt: -1 });
    return {
      success: true,
      message: "Posts are fetched successfully",
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPostsOfUserByType = async ({
  userId,
  type,
}: {
  userId: string;
  type: "uploaded" | "tagged" | "saved" | "archived";
}) => {
  try {
    let postsToReturn: any[] = [];

    switch (type) {
      case "uploaded":
        postsToReturn = await postModel
          .find({
            user: userId,
            isArchived: false,
          })
          .populate("user");
        break;
      case "tagged":
        postsToReturn = await postModel
          .find({
            tags: {
              $in: [userId],
            },
          })
          .populate("user");
        break;
      case "saved":
        postsToReturn = await postModel
          .find({
            savedBy: {
              $in: [userId],
            },
          })
          .populate("user");
        break;
      case "archived":
        postsToReturn = await postModel
          .find({
            user: userId,
            isArchived: true,
          })
          .populate("user");
        break;
      default:
        postsToReturn = [];
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(postsToReturn)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPostById = async (postId: string) => {
  try {
    const post = await postModel.findById(postId).populate("user");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(post)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const savePost = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  try {
    await postModel.findByIdAndUpdate(postId, {
      $push: { savedBy: userId },
    });

    return {
      success: true,
      message: "Post saved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unsavePost = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  try {
    await postModel.findByIdAndUpdate(postId, {
      $pull: { savedBy: userId },
    });

    return {
      success: true,
      message: "Post unsaved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const archivePost = async (postId: string) => {
  try {
    await postModel.findByIdAndUpdate(postId, {
      isArchived: true,
    });

    return {
      success: true,
      message: "Post archived successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unarchivePost = async (postId: string) => {
  try {
    await postModel.findByIdAndUpdate(postId, {
      isArchived: false,
    });

    return {
      success: true,
      message: "Post unarchived successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const searchPosts = async (searchValue: string) => {
  try {
    const posts = await postModel
      .find({
        $or: [
          { caption: { $regex: searchValue, $options: "i" } },
          { hashTags: { $in: [searchValue] } },
        ],
      })
      .populate("user");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deletePost = async (postId: string) => {
  try {
    await postModel.findByIdAndDelete(postId, { new: true });

    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updatePost = async ({
  postId,
  payload,
}: {
  postId: string;
  payload: any;
}) => {
  try {
    const post = await postModel.findOne({ _id: postId });
    if(post){
      post.media = payload.media;
      post.caption = payload.caption;
      post.hashTags = payload.hashTags;
      post.tags = payload.tags;
      await post.save();
      return {
        success: true,
        message: "Post updated successfully",
      };
    }
    else{
      return {
        success: false,
        message: "Failed to find post and update it",
      };
    }
    // await postModel.findByIdAndUpdate(
    //   postId,
    //   {
    //     media: payload.mediaUrls,
    //     caption: payload.caption,
    //     hashTags: payload.hashTags,
    //     tags: payload.tags,
    //   },
    //   { new: true }
    // );

  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};


export const getPostTags = async (postId: string) => {
  try {
    const post = await postModel.findOne({ _id: postId }).populate("tags");
    if (post && post.tags.length !== 0) {
      return {
        success: true,
        message: "Fetched tags of this selected post successfully",
        data: JSON.parse(JSON.stringify(post.tags)),
      };
    } else {
      return {
        success: false,
        message: "Post hasn't received any tags yet.",
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