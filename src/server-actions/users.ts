'use server' // To tell the next-js that it is server side code (node.js (api) part)
import { message } from 'antd';
import userModel from '../models/user-model';
import { currentUser } from '@clerk/nextjs/server';
import { profile } from 'console';
import ConnectToMongoDB from '@/config/ConnectToMongoDB';
import { revalidatePath } from 'next/cache';

ConnectToMongoDB();
export const saveUser = async(payload:any) => {
   try{
     const user = new userModel(payload);
     const savedUser = await user.save();
     return {
        success: true,
        message: "User saved successfully.",
        data: JSON.parse(JSON.stringify(savedUser))
     }
   }
   catch(error:any){
     return {
       success: false,
       message: error.message,
       data: error
     };
   }
}

export const getCurrentUserFromMongoDB = async() => {
    try{
      const clerkUserData = await currentUser();
      const user = await userModel.findOne({ clerkUserId: clerkUserData?.id });
      if(user) {
       return {
         success: true,
         message: "User info fetched successfully.",
         data: JSON.parse(JSON.stringify(user)),
       }
      }
      else{
        const newUser = await saveUser({
            name: clerkUserData?.firstName+" "+clerkUserData?.lastName,
            email: clerkUserData?.emailAddresses[0].emailAddress,
            clerkUserId: clerkUserData?.id,
            profilePic: clerkUserData?.imageUrl
        });
        if(newUser.success){
            return {
                success: true,
                message: `User not found.`,
                data: JSON.parse(JSON.stringify(newUser.data))
              }
        }
        else{
            return {
                success: false,
                message: newUser.message,
                data: null
              }; 
        }
      }
    }
    catch(error:any){
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
 }

export const getUserInfoById = async(id: string) => {
  try{
    const user = await userModel.findOne({ _id: id });
    if(user) {
     return {
       success: true,
       message: "Selected User info fetched successfully.",
       data: JSON.parse(JSON.stringify(user)),
     }
    }
    else{
          return {
              success: false,
              message: `User not found.`,
              data: null
            }
    }
  }
  catch(error:any){
    return {
      success: false,
      message: error.message,
      data: null
    };
  } 
}

export const updateUserProfile = async({ payload, userId } : {
  payload: any,
  userId: string
}) => {
  try{
    const user = await userModel.findOne({ _id: userId });
    if(user) {
     user.bio = payload.bio;
     user.isPrivateAccount = payload.isPrivateAccount;
     if(payload.profilePic){
      user.profilePic = payload.profilePic;
     }
     await user.save();
     const response = await getCurrentUserFromMongoDB();
     if(response.success){
      revalidatePath(`/profile/${userId}`);
      return {
        success: true,
        message: "Your info updated successfully.",
        data: null,
      }
     }
     else{
      return {
        success: false,
        message: "Failed to fetch updated info.",
        data: null,
      }
     }
    }
    else{
          return {
              success: false,
              message: `User not found.`,
              data: null
            }
    }
  }
  catch(error:any){
    return {
      success: false,
      message: error.message,
      data: null
    };
  } 
}

export const searchUsers = async(searchValue: string) => {
  try{
    const users = await userModel.find({ 
      name: { $regex: searchValue, $options: "i"},
    });
    if(users.length!=0) {
      // revalidatePath(`/se`);
      return {
        success: true,
        message: "Searched users fetched successfully.",
        data: JSON.parse(JSON.stringify(users)),
      }
     }
     else{
      return {
        success: false,
        message: "No users with given search value exists.",
        data: null,
      }
     }
  }
  catch(error:any){
    return {
      success: false,
      message: error.message,
      data: null
    };
  } 
}

export const getFollowRequestsReceived = async(userId: string) => {
  try{
    const user = await userModel.findOne( { _id: userId }).populate("followRequestsReceived");
    if(user && user.followRequestsReceived?.length!=0) {
      return {
        success: true,
        message: "Pending Follow Requests fetched successfully.",
        data: JSON.parse(JSON.stringify(user.followRequestsReceived)),
      }
     }
     else{
      return {
        success: false,
        message: "No Pending Follow Requests Received.",
        data: null,
      }
     }
  }
  catch(error:any){
    return {
      success: false,
      message: error.message,
      data: null
    };
  } 
}

export const getFollowersOfUser = async(userId: string) => {
  try{
    const user = await userModel.findOne( { _id: userId }).populate("followers");
    if(user && user.followers?.length!=0) {
      return {
        success: true,
        message: "Your followers fetched successfully.",
        data: JSON.parse(JSON.stringify(user.followers)),
      }
     }
     else{
      return {
        success: false,
        message: "No followers to display.",
        data: null,
      }
     }
  }
  catch(error:any){
    return {
      success: false,
      message: error.message,
      data: null
    };
  } 
}

export const getFollowingsOfUser = async(userId: string) => {
  try{
    const user = await userModel.findOne( { _id: userId }).populate("following");
    if(user && user.following?.length!=0) {
      return {
        success: true,
        message: "Your following fetched successfully.",
        data: JSON.parse(JSON.stringify(user.following)),
      }
     }
     else{
      return {
        success: false,
        message: "No following to display.",
        data: null,
      }
     }
  }
  catch(error:any){
    return {
      success: false,
      message: error.message,
      data: null
    };
  } 
}


