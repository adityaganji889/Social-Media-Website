"use server";

import notificationModel from "@/models/notification-model";
import { getCurrentUserFromMongoDB } from "./users";
import ConnectToMongoDB from "@/config/ConnectToMongoDB";


export const addNewNotification = async (payload: any) => {
  try {
    await notificationModel.create(payload);
    return {
      success: true,
      message: "Notification added successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getNotificationsOfCurrentUser = async () => {
  try {
    const user = await getCurrentUserFromMongoDB();
    notificationModel.updateMany(
      { user: user.data._id, read: false },
      { read: true }
    ).exec();
    const userId = user.data._id;
    const notifications = await notificationModel.find({ user: userId }).sort({
      createdAt: -1,
    });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(notifications)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getUnreadNotificationsCount = async (userId: string) => {
  try {
    const notificationsCount = await notificationModel.countDocuments({
      user: userId,
      read: false,
    });
    return {
      success: true,
      data: notificationsCount,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};