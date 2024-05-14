'use client'
import Spinner from '@/components/Spinner';
import { UserType } from '@/interfaces/UserType';
import { removeFollower } from '@/server-actions/follow-requests';
import { getFollowersOfUser } from '@/server-actions/users';
import useUsersStore, { UsersStoreType } from '@/store/users';
import { Modal, message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function FollowersModal({
    showFollowersModal,
    setShowFollowersModal,
    user
} : {
    showFollowersModal: boolean;
    setShowFollowersModal: (value: boolean) => void;
    user: UserType
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showFollowers, setShowFollowers] = useState<UserType[]>([]);
  const { setLoggedInUserData, loggedInUserData } : UsersStoreType = useUsersStore();
  
  const removefollowerRequestHandler = async (userId:string) => {
    try{
       const response = await removeFollower({
        followRequestSenderId: user._id,
        followRequestReceiverId: userId
       })
       if(response.success){
         setTimeout(()=>{
            setLoggedInUserData(response.data);
            message.success(response.message);
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
  };

  const getFollowers = async () => {
    try{
       setLoading(true);
       const response = await getFollowersOfUser(user._id)
       if(response.success){
         setTimeout(()=>{
            setLoading(false);
            setShowFollowers(response.data);
            message.success(response.message);
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
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(showFollowersModal){
        getFollowers();
    }
  },[showFollowersModal])
  
  return (
    <Modal title="Followers" open={showFollowersModal} onCancel={()=>{
        setShowFollowersModal(false);
    }} centered footer={null}>
    {loading && <div className='h-40 flex justify-center items-center'>
     <Spinner/>   
    </div>}
     <div className='flex flex-col gap-5 m-2'>
    {!loading && showFollowers.length === 0 && <div className='text-gray-500'>
        No followers to display
    </div> }
    {!loading && showFollowers.length !== 0 && showFollowers.map((u:UserType[]|any, index)=>{
        return (
            <div key={u._id} className='bg-gray-100 rounded p-2 flex gap-5 hover:bg-gray-200 hover:cursor-pointer'>
               <div>
                 <img src={u.profilePic} alt="profile" className = 'w-12 h-12 rounded-full'/>
               </div>
               <div className='flex gap-5 w-full justify-between items-center'>
                 <div className='font-semibold text-xl' onClick={()=>{
                   router.push(`/profile/${u._id}`);
                 }}>{u.name}</div>
                 {(user._id === loggedInUserData?._id)&& <div className='font-md text-md hover:bg-gray-300 bg-gray-100 p-2 rounded ' onClick={()=>{
                    removefollowerRequestHandler(u._id);
                 }}>Remove</div>}
               </div>
            </div>    
        )
    })}
    </div>
    </Modal>
  )
}

export default FollowersModal