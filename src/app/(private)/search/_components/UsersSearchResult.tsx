'use client'
import React from 'react'
import { UserType } from '@/interfaces/UserType'
import { useRouter } from 'next/navigation'

function UsersSearchResult({users} : {
    users: UserType[]
}) {
  const router = useRouter();
  return (
    <div className='flex flex-col gap-5 mt-4'>
    {users.map((user, index)=>{
        return (
            <div key={user._id} className='bg-gray-100 rounded p-3 flex gap-5 hover:bg-gray-200 hover:cursor-pointer' onClick={()=>{
                router.push(`/profile/${user._id}`);
            }}>
               <div>
                 <img src={user.profilePic} alt="profile" className = 'w-12 h-12 rounded-full'/>
               </div>
               <div>
                 <div className='font-md text-xl'>{user.name}</div>
                 <div className='flex gap-5 text-sm text-gray-500 mt-3'>
                    <div className='flex gap-3'>
                        <span>{user.followers.length}</span>
                        <span className='cursor-pointer underline'>Followers</span>
                    </div>
                    <div className='flex gap-3'>
                        <span>{user.following.length}</span>
                        <span className='cursor-pointer underline'>Following</span>
                    </div>
                 </div>
               </div>
            </div>    
        )
    })}
    </div>
  )
}

export default UsersSearchResult