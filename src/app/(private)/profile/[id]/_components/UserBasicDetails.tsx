"use client";
import { UserType } from "@/interfaces/UserType";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, Modal, message } from "antd";
import React, { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import {
  cancelFollowRequest,
  removeFollower,
  sendFollowRequest,
  unfollowUser,
} from "@/server-actions/follow-requests";
import { revalidatePath } from "next/cache";
import FollowersModal from "./FollowersModal";
import { getFollowersOfUser } from "@/server-actions/users";
import FollowingModal from "./FollowingModal";
import { PostType } from "@/interfaces/PostType";
import { addNewNotification } from "@/server-actions/notifications";

function UserBasicDetails({
  user,
  posts,
}: {
  user: UserType;
  posts: PostType[];
}) {
  const [loading, setLoading] = useState<
    | "sending-follow-request"
    | "cancelling-follow-request"
    | "unfollowing-request"
    | ""
  >("");
  const [privateProfileLoading, setPrivateProfileLoading] =
    useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] =
    useState<boolean>(false);
  const [showFollowersModal, setShowFollowersModal] = useState<boolean>(false);
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false);
  const [unfollowPrivateAccount, setUnfollowPrivateAccount] =
    useState<boolean>(false);
  const { loggedInUserData, setLoggedInUserData }: UsersStoreType =
    useUsersStore();
  let showEditProfileBtn = user._id === loggedInUserData?._id;
  let followRequestSent = loggedInUserData?.followRequestsSent?.includes(
    user._id
  );
  let alreadyFollowing = loggedInUserData?.following?.includes(user._id);
  let showFollowBtn =
    user._id !== loggedInUserData?._id &&
    !followRequestSent &&
    !alreadyFollowing;

  let canSeeFollowersAndFollowing =
    loggedInUserData?._id === user._id ||
    (user.isPrivateAccount && alreadyFollowing) ||
    !user.isPrivateAccount;

  const followRequestHandler = async () => {
    try {
      setLoading("sending-follow-request");
      const response = await sendFollowRequest({
        followRequestSenderId: loggedInUserData?._id || "",
        followRequestReceiverId: user._id,
      });
      if (response.success) {
          addNewNotification({
            user: user._id,
            type: "follow-request",
            text: `${loggedInUserData?.name} sent you a follow request.`,
            onClickPath: `/profile/${user._id}`,
            read: false,
          });
          setLoggedInUserData(response.data);
          message.success(response.message);
      } else {
          message.info(response.message);
      }
    } catch (error: any) {
        message.error(error.message);
    } finally {
      setLoading("");
    }
  };

  const cancelfollowRequestHandler = async () => {
    try {
      setLoading("cancelling-follow-request");
      const response = await cancelFollowRequest({
        followRequestSenderId: loggedInUserData?._id || "",
        followRequestReceiverId: user._id,
      });
      if (response.success) {
        setTimeout(() => {
          setLoggedInUserData(response.data);
          message.success(response.message);
        }, 5000);
      } else {
        setTimeout(() => {
          message.info(response.message);
        }, 5000);
      }
    } catch (error: any) {
      setTimeout(() => {
        message.error(error.message);
      }, 5000);
    } finally {
      setLoading("");
    }
  };

  const unfollowRequestHandler = async () => {
    try {
      setLoading("unfollowing-request");
      if (user.isPrivateAccount) {
        setPrivateProfileLoading(true);
        setUnfollowPrivateAccount(false);
      }
      const response = await unfollowUser({
        followRequestSenderId: loggedInUserData?._id || "",
        followRequestReceiverId: user._id,
      });
      if (response.success) {
          setLoggedInUserData(response.data);
          message.success(response.message);
      } else {
          message.info(response.message);
      }
    } catch (error: any) {
        message.error(error.message);
    } finally {
      setLoading("");
      setUnfollowPrivateAccount(false);
      setPrivateProfileLoading(false);
    }
  };

  const removefollowerRequestHandler = async () => {
    try {
      const response = await removeFollower({
        followRequestSenderId: loggedInUserData?._id || "",
        followRequestReceiverId: user._id,
      });
      if (response.success) {
          setLoggedInUserData(response.data);
          message.success(response.message);
      } else {
          message.info(response.message);
      }
    } catch (error: any) {
        message.error(error.message);
    }
  };

  return (
    <div className="flex lg:flex-row flex-col gap-10 items-center m-5">
      <div className="">
        <img
          src={user.profilePic}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>
      <div>
        <div className="flex gap-5">
          <span className="font-bold text-xl text-primary">{user.name}</span>
          {showEditProfileBtn && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setShowEditProfileModal(true);
              }}
            >
              Edit Profile
            </Button>
          )}
          {showFollowBtn && (
            <Button
              type="primary"
              size="small"
              onClick={followRequestHandler}
              loading={loading === "sending-follow-request"}
            >
              Follow
            </Button>
          )}
          {followRequestSent && (
            <Button
              size="small"
              loading={loading === "cancelling-follow-request"}
              onClick={cancelfollowRequestHandler}
            >
              Requested
            </Button>
          )}
          {alreadyFollowing && (
            <Button
              size="small"
              onClick={() => {
                if (user.isPrivateAccount) {
                  setUnfollowPrivateAccount(true);
                } else {
                  unfollowRequestHandler();
                }
              }}
              loading={loading === "unfollowing-request"}
            >
              Following
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-5 mt-4">
            <div className="flex gap-1">
              <span>{posts.length}</span>
              <span>Posts</span>
            </div>
            <div className="flex gap-1">
              <span>{user.followers.length}</span>
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  if (canSeeFollowersAndFollowing) {
                    setShowFollowersModal(true);
                  }
                }}
              >
                Followers
              </span>
            </div>
            <div className="flex gap-1">
              <span>{user.following.length}</span>
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  if (canSeeFollowersAndFollowing) {
                    setShowFollowingModal(true);
                  }
                }}
              >
                Following
              </span>
            </div>
          </div>
          <div className="flex gap-5 text-gray-500 text-sm">
            <p>{user.bio || `This user has no bio yet.`}</p>
          </div>
        </div>
      </div>
      {showEditProfileModal && (
        <EditProfileModal
          user={user}
          showEditProfileModal={showEditProfileModal}
          setShowEditProfileModal={setShowEditProfileModal}
        />
      )}
      {showFollowersModal && (
        <FollowersModal
          user={user}
          showFollowersModal={showFollowersModal}
          setShowFollowersModal={setShowFollowersModal}
        />
      )}
      {showFollowingModal && (
        <FollowingModal
          user={user}
          showFollowingModal={showFollowingModal}
          setShowFollowingModal={setShowFollowingModal}
        />
      )}
      {unfollowPrivateAccount && (
        <Modal
          title="Sure to Unfollow this user"
          open={unfollowPrivateAccount}
          onCancel={() => {
            setUnfollowPrivateAccount(false);
          }}
          centered
          okText="Ok"
          onOk={unfollowRequestHandler}
          okButtonProps={{ loading: privateProfileLoading }}
          cancelButtonProps={{ disabled: privateProfileLoading }}
        >
          <hr className="border-solid border-gray-300 my-3" />
          <div>
            <span className="text-gray-500 text-lg">
              You have to request again {user.name} to follow back.
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default UserBasicDetails;
