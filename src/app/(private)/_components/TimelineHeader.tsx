'use client'
import useUsersStore, { UsersStoreType } from '@/store/users'
import { Button } from 'antd';
import React, { useState } from 'react'
import UploadNewPostModal from './UploadNewPostModal';

function TimelineHeader() {
  const {loggedInUserData} : UsersStoreType = useUsersStore();
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  return (
    <div className='flex justify-between items-center'>
        <h1 className="text-xl text-gray-500">
          Here is your timeline, <b className='text-info'>{loggedInUserData?.name}</b>
        </h1>
        <Button type="primary" onClick={()=>{
            setShowNewPostModal(true);
        }}>
            + New Post
        </Button>
        {showNewPostModal && (
            <UploadNewPostModal showNewPostModal={showNewPostModal} setShowNewPostModal={setShowNewPostModal} user={loggedInUserData!}/>
        )}
    </div>
  )
}

export default TimelineHeader