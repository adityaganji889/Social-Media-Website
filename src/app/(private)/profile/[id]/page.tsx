import { getUserInfoById } from '@/server-actions/users'
import React from 'react'
import UserBasicDetails from './_components/UserBasicDetails'
import PendingFollowRequests from './_components/PendingFollowRequests'
import UserRelatedPosts from './_components/UserRelatedPosts'
import { getPostsOfUserByType } from '@/server-actions/posts'


interface ParamsType {
  params: {
    id: string
  }
}

const ProfilePage : React.FC<ParamsType> = async({params}) => {
  const userInfoResponse = await getUserInfoById(params.id);
  const userInfo = userInfoResponse.data;
  const postInfoResponse = await getPostsOfUserByType({
    userId: userInfo._id!,
    type: "uploaded"
  })
  const postInfo = postInfoResponse.data;
  return (
    <div>
      <UserBasicDetails user={userInfo} posts={postInfo}/>
      <PendingFollowRequests user={userInfo} />
      <UserRelatedPosts user={userInfo} />
    </div>
  )
}

export default ProfilePage