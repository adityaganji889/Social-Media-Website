"use client";
import { getFollowRequestsReceived } from "@/server-actions/users";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { UserType } from "@/interfaces/UserType";
import { useRouter } from "next/navigation";
import { acceptFollowRequest, rejectFollowRequest } from "@/server-actions/follow-requests";
import { addNewNotification } from "@/server-actions/notifications";

type loadingTypes = 'accepting follow request' | 'rejecting follow request' | '';

function PendingFollowRequests({ user }: { user: UserType }) {
  const [followRequests, setFollowRequests] = useState([]);
  const { loggedInUserData, setLoggedInUserData }: UsersStoreType = useUsersStore();
  const [loading, setLoading] = useState<loadingTypes>('');
  const router = useRouter();

  if (user._id !== loggedInUserData?._id) {
    return null;
  }

  useEffect(() => {
    fetchFollowRequests();
  }, []);

  const fetchFollowRequests = async () => {
    try {
      const response = await getFollowRequestsReceived(
        loggedInUserData?._id || ""
      );
      if (response.success) {
        setTimeout(() => {
          setFollowRequests(response.data);
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
    }
  };

  const handleAcceptFollowRequest = async(senderId: string, ) => {
    try{
       setLoading('accepting follow request');
       const response = await acceptFollowRequest({
        followRequestSenderId: senderId,
        followRequestReceiverId: loggedInUserData?._id || "",
       })
       if(response.success){
        setTimeout(()=>{
          addNewNotification({
            user: senderId,
            type: "follow-request",
            text: `${loggedInUserData?.name} accepted your follow request.`,
            onClickPath: `/profile/${senderId}`,
            read: false,
          });
          message.success(response.message);
          setLoggedInUserData(response.data);
          fetchFollowRequests();
        },5000)
       }
       else{
        setTimeout(()=>{
          message.info(response.message);
        },5000)
       }
    }
    catch(error:any){
        setTimeout(()=>{
          message.error(error.message);
        },5000)
    }
    finally{
        setLoading('');
    }
  }

  const handleRejectFollowRequest = async(senderId: string, ) => {
    try{
       setLoading('rejecting follow request');
       const response = await rejectFollowRequest({
        followRequestSenderId: senderId,
        followRequestReceiverId: loggedInUserData?._id || "",
       })
       if(response.success){
        setTimeout(()=>{
          message.success(response.message);
          setLoggedInUserData(response.data);
          fetchFollowRequests();
        },5000)
       }
       else{
        setTimeout(()=>{
          message.info(response.message);
        },5000)
       }
    }
    catch(error:any){
        setTimeout(()=>{
          message.error(error.message);
        },5000)
    }
    finally{
        setLoading('');
    }
  }



  return (
    <div className="p-5 bg-gray-100 border border-gray-200 border-solid mt-10">
      <h1 className="text-sm text-primary">Pending Follow Requests</h1>
      {followRequests.length===0 && !loading && (
        <span className="text-gray-500 text-sm">No Pending Follow Requests</span>
      )}
      {followRequests.length!==0 && followRequests.map((sender: UserType) => {
        return (
          <div className="flex flex-wrap gap-5 mt-7">
            <div className="flex gap-5 items-center bg-gray-200 p-3 border border-solid border-gray-300 w-full">
              <img
                src={sender.profilePic}
                className="w-12 h-12 rounded-full object-cover"
                alt={sender.name}
              />
              <div className="flex flex-col gap-2">
                <span className="text-gray-700 text-sm">
                    {sender.name}
                </span>
                <div className="flex gap-5">
                    <Button size="small" onClick={()=>{
                      router.push(`/profile/${sender._id}`)
                    }}>View Profile</Button>
                    <Button size="small" type="primary" onClick={()=>{
                        handleAcceptFollowRequest(sender._id);
                    }} loading={loading==='accepting follow request'}>Accept</Button>
                    <Button size="small" onClick={()=>{
                        handleRejectFollowRequest(sender._id);
                    }} loading={loading==='rejecting follow request'}>Reject</Button>
                </div>    
            </div>    
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PendingFollowRequests;
