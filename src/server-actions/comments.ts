'use server'

import ConnectToMongoDB from "@/config/ConnectToMongoDB"
import commentModel from "@/models/comment-model"
import postModel from "@/models/post-model"

ConnectToMongoDB()

export const addNewComment = async({payload, postId}:{
    payload: any,
    postId: string
}) => {
    try{
      await commentModel.create(payload)
      await postModel.findByIdAndUpdate(postId,{
        $inc: { commentsCount: 1 }
      },{new: true});
      return {
        success: true,
        message: "Comment Added Successfully"
      }
    }
    catch(error:any){
        return {
            success: false,
            message: error.message
        }
    }
}


export const replyToComment = async({payload, postId}:{
    payload: any,
    postId: string
}) => {
    try{
      await commentModel.create(payload)
      await postModel.findByIdAndUpdate(postId,{
        $inc: { commentsCount: 1 }
      },{new: true});
      await commentModel.findByIdAndUpdate(payload.replyTo, {
        $inc: { repliesCount: 1 },
      });
      return {
        success: true,
        message: "Replied to the comment successfully"
      }
    }
    catch(error:any){
        return {
            success: false,
            message: error.message
        }
    }
}

export const getRootLevelCommentsOfPost = async(postId: string) => {
    try{
        const comments = await commentModel.find({ post: postId, isReply: false }).populate("user");
        if(comments.length!==0){
            return {
                success: true,
                message: "Selected post comments fetched successfully",
                data: JSON.parse(JSON.stringify(comments))
              }
        }
        else{
            return {
                success: false,
                message: "No comments to display"
              }
        }
      }
      catch(error:any){
          return {
              success: false,
              message: error.message
          }
      }   
}

export const getRepliesOfAComment = async (commentId: string) => {
    try {
      const replies = await commentModel.find({
        replyTo: commentId,
      }).populate("user");
      return {
        success: true,
        data: JSON.parse(JSON.stringify(replies)),
      };
    } catch (error: any) {
      return {
        message: error.message,
        success: false,
      };
    }
  };