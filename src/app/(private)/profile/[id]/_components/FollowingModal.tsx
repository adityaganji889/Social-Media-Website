"use client";
import Spinner from "@/components/Spinner";
import { UserType } from "@/interfaces/UserType";
import { removeFollower, unfollowUser } from "@/server-actions/follow-requests";
import { getFollowersOfUser, getFollowingsOfUser } from "@/server-actions/users";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Modal, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


function FollowingModal({
  showFollowingModal,
  setShowFollowingModal,
  user,
}: {
  showFollowingModal: boolean;
  setShowFollowingModal: (value: boolean) => void;
  user: UserType;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showFollowing, setShowFollowing] = useState<UserType[]>([]);
  const [unfollowPrivateAccount, setUnfollowPrivateAccount] = useState<boolean>(false);
  const [privateProfileLoading, setPrivateProfileLoading] = useState<boolean>(false);
  const [selectedUserToRemove,setSelectedUserToRemove] = useState<UserType|any>(null);
  const { setLoggedInUserData, loggedInUserData }: UsersStoreType =
    useUsersStore();

  const removefollowerRequestHandler = async (userId: string) => {
    try {
      if(user.isPrivateAccount){
        setPrivateProfileLoading(true);
        setUnfollowPrivateAccount(false);
       }
      const response = await unfollowUser({
        followRequestSenderId: user._id,
        followRequestReceiverId: userId,
      });
      if (response.success) {
        setTimeout(() => {
          // setLoggedInUserData(response.data);
          setLoggedInUserData(response.data);
          message.success(response.message);
          setSelectedUserToRemove(null);
        }, 5000);
      } else {
        setTimeout(() => {
          message.info(response.message);
          setSelectedUserToRemove(null);
        }, 5000);
      }
    } catch (error: any) {
      setTimeout(() => {
        message.error(error.message);
        setSelectedUserToRemove(null);
      }, 5000);
    }
    finally{
      setUnfollowPrivateAccount(false);
      setPrivateProfileLoading(false);
    }
  };

  const getFollowing = async () => {
    try {
      setLoading(true);
      const response = await getFollowingsOfUser(user._id);
      if (response.success) {
        setTimeout(() => {
          setLoading(false);
          setShowFollowing(response.data);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showFollowingModal) {
      getFollowing();
    }
  }, [showFollowingModal]);

  return (
    <>
    <Modal
      title="Following"
      open={showFollowingModal}
      onCancel={() => {
        setShowFollowingModal(false);
      }}
      centered
      footer={null}
    >
      {loading && (
        <div className="h-40 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="flex flex-col gap-5 m-2">
        {!loading && showFollowing.length === 0 && (
          <div className="text-gray-500">No following to display</div>
        )}
        {!loading &&
          showFollowing.length !== 0 &&
          showFollowing.map((u: UserType[] | any, index) => {
            return (
              <div
                key={u._id}
                className="bg-gray-100 rounded p-2 flex gap-5 hover:bg-gray-200 hover:cursor-pointer"
              >
                <div>
                  <img
                    src={u.profilePic}
                    alt="profile"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex gap-5 w-full justify-between items-center">
                  <div
                    className="font-semibold text-xl"
                    onClick={() => {
                      router.push(`/profile/${u._id}`);
                    }}
                  >
                    {u.name}
                  </div>
                  {user._id === loggedInUserData?._id && (
                    <div
                      className="font-md text-md hover:bg-gray-300 bg-gray-100 p-2 rounded "
                      onClick={() => {
                        if(u.isPrivateAccount){
                          setSelectedUserToRemove(u);
                          setUnfollowPrivateAccount(true);
                        }
                        else{
                          removefollowerRequestHandler(u._id);
                        }
                      }}
                    >
                      Following
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </Modal>
    {unfollowPrivateAccount && (
        <Modal title="Sure to remove this user from your" open={unfollowPrivateAccount} onCancel={()=>{
          setUnfollowPrivateAccount(false)
      }} centered okText="Ok" onOk={() => {
        removefollowerRequestHandler(selectedUserToRemove._id)
      }} okButtonProps={{ loading: privateProfileLoading }} cancelButtonProps={{ disabled: privateProfileLoading }}>
        <hr className='border-solid border-gray-300 my-3'/>
        <div>
            <span className="text-gray-500 text-lg">
                You have to request again {selectedUserToRemove.name} to follow back.
            </span>
        </div>
      </Modal>
      )}
    </>
  );
}

export default FollowingModal;
