"use server";

import ConnectToMongoDB from "@/config/ConnectToMongoDB";
import userModel from "@/models/user-model";
import { withSuccess } from "antd/es/modal/confirm";

ConnectToMongoDB();

export const sendFollowRequest = async ({
  followRequestSenderId,
  followRequestReceiverId,
}: {
  followRequestSenderId: string;
  followRequestReceiverId: string;
}) => {
  try {
    // add receiver id to sender followRequestSent
    const sender = await userModel.findOne({ _id: followRequestSenderId });

    // add sender id to receiver followRequestReceived
    const receiver = await userModel.findOne({ _id: followRequestReceiverId });

    if (sender && receiver) {
      if (!receiver.isPrivateAccount) {
        sender.following?.push(
          JSON.parse(JSON.stringify(followRequestReceiverId))
        );
        await sender.save();
        receiver.followers?.push(
          JSON.parse(JSON.stringify(followRequestSenderId))
        );
        await receiver.save();
        return {
          success: true,
          message: `You followed user : ${receiver.name} successfully`,
          data: JSON.parse(JSON.stringify(sender)),
        };
      } else {
        sender.followRequestsSent?.push(
          JSON.parse(JSON.stringify(followRequestReceiverId))
        );
        await sender.save();
        receiver.followRequestsReceived?.push(
          JSON.parse(JSON.stringify(followRequestSenderId))
        );
        await receiver.save();
        return {
          success: true,
          message: `Follow request to user : ${receiver.name} sent successfully`,
          data: JSON.parse(JSON.stringify(sender)),
        };
      }
    } else {
      return {
        success: false,
        message: `Sender, Receiver not found`,
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

export const acceptFollowRequest = async ({
  followRequestSenderId,
  followRequestReceiverId,
}: {
  followRequestSenderId: string;
  followRequestReceiverId: string;
}) => {
  try {
    const sender = await userModel.findOne({ _id: followRequestSenderId });

    const receiver = await userModel.findOne({ _id: followRequestReceiverId });

    if (sender && receiver) {
      // add sender id to receiver followers and remove followRequestReceived for this sender from the receiver
      await userModel.findByIdAndUpdate(followRequestReceiverId, {
        $push: { followers: followRequestSenderId },
        $pull: { followRequestsReceived: followRequestSenderId },
      });

      // add receiver id to sender following and remove followRequestSent from that sender for this receiver
      await userModel.findByIdAndUpdate(followRequestSenderId, {
        $push: { following: followRequestReceiverId },
        $pull: { followRequestsSent: followRequestReceiverId },
      });

      const receiver1 = await userModel.findOne({ _id: followRequestReceiverId });

      return {
        success: true,
        message: `Received follow request of user : ${sender.name} is accepted successfully`,
        data: JSON.parse(JSON.stringify(receiver1)),
      };
    } else {
      return {
        success: false,
        message: `Sender, Receiver not found`,
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

export const rejectFollowRequest = async ({
  followRequestSenderId,
  followRequestReceiverId,
}: {
  followRequestSenderId: string;
  followRequestReceiverId: string;
}) => {
  try {
    const sender = await userModel.findOne({ _id: followRequestSenderId });

    const receiver = await userModel.findOne({ _id: followRequestReceiverId });

    if (sender && receiver) {
      // remove followRequestReceived for this sender from the receiver
      await userModel.findByIdAndUpdate(followRequestReceiverId, {
        $pull: { followRequestsReceived: followRequestSenderId },
      });

      // remove followRequestSent from that sender for this receiver
      await userModel.findByIdAndUpdate(followRequestSenderId, {
        $pull: { followRequestsSent: followRequestReceiverId },
      });

      const receiver1 = await userModel.findOne({ _id: followRequestReceiverId });

      return {
        success: true,
        message: `Received follow request of user : ${sender.name} is rejected successfully`,
        data: JSON.parse(JSON.stringify(receiver1)),
      };
    } else {
      return {
        success: false,
        message: `Sender, Receiver not found`,
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

export const cancelFollowRequest = async ({
    followRequestSenderId,
    followRequestReceiverId,
  }: {
    followRequestSenderId: string;
    followRequestReceiverId: string;
  }) => {
    try {
      const sender = await userModel.findOne({ _id: followRequestSenderId });
  
      const receiver = await userModel.findOne({ _id: followRequestReceiverId });
  
      if (sender && receiver) {
        // remove followRequestReceived for this sender from the receiver
        
        // remove followRequestSent from that sender for this receiver
        const newSenderDoc = await userModel.findByIdAndUpdate(followRequestSenderId, {
            $pull: { followRequestsSent: followRequestReceiverId },
        }, {new:true});
        
        
        await userModel.findByIdAndUpdate(followRequestReceiverId, {
          $pull: { followRequestsReceived: followRequestSenderId },
        });
  
        return {
          success: true,
          message: `Sent follow request to user : ${receiver.name} is canceled successfully`,
          data: JSON.parse(JSON.stringify(newSenderDoc)),
        };
      } else {
        return {
          success: false,
          message: `Sender, Receiver not found`,
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

export const unfollowUser = async ({
    followRequestSenderId,
    followRequestReceiverId,
  }: {
    followRequestSenderId: string;
    followRequestReceiverId: string;
  }) => {
    try {
      // add receiver id to sender followRequestSent
      const sender = await userModel.findOne({ _id: followRequestSenderId });
  
      // add sender id to receiver followRequestReceived
      const receiver = await userModel.findOne({ _id: followRequestReceiverId });
  
      if (sender && receiver) {

          // remove followRequestReceived for this sender from the receiver
        await userModel.findByIdAndUpdate(followRequestReceiverId, {
            $pull: { followers: followRequestSenderId },
          });
    
          // remove followRequestSent from that sender for this receiver
          const sender1 = await userModel.findByIdAndUpdate(followRequestSenderId, {
            $pull: { following: followRequestReceiverId },
          },{new: true});
          
          return {
            success: true,
            message: `Unfollowed user : ${receiver.name} successfully`,
            data: JSON.parse(JSON.stringify(sender1)),
          };
        }
        else {
        return {
          success: false,
          message: `Sender, Receiver not found`,
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


export const removeFollower = async ({
    followRequestSenderId,
    followRequestReceiverId,
  }: {
    followRequestSenderId: string;
    followRequestReceiverId: string;
  }) => {
    try {
      const sender = await userModel.findOne({ _id: followRequestSenderId });
  
      const receiver = await userModel.findOne({ _id: followRequestReceiverId });
  
      if (sender && receiver) {
        // remove followRequestReceived for this sender from the receiver
        await userModel.findByIdAndUpdate(followRequestReceiverId, {
          $pull: { following: followRequestSenderId },
        });
  
        // remove followRequestSent from that sender for this receiver
        const sender1 = await userModel.findByIdAndUpdate(followRequestSenderId, {
          $pull: { followers: followRequestReceiverId },
        },{new: true});
  
  
        return {
          success: true,
          message: `Selected user : ${receiver.name} is removed from your followers successfully`,
          data: JSON.parse(JSON.stringify(sender1)),
        };
      } else {
        return {
          success: false,
          message: `Sender, Receiver not found`,
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
