'use client'
import { getTimelinePostsOfLoggedInUser } from "@/server-actions/posts";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { message } from "antd";
import Spinner from "@/components/Spinner";


function Timeline() {
  const[postsResponse, setPostsResponse] = useState<any>([]);
  const getPostsData = async () => {
    try{
      let response = await getTimelinePostsOfLoggedInUser();
      if(response.success){
        setPostsResponse(response);
        message.success(response.message);
      }
      else{
        message.info(response.message);
      }
    }
    catch(error:any){
      message.error(error.message);
    }
  }
  useEffect(()=>{
    getPostsData();
  },[])
  if (!postsResponse.success) {
    return (
      <div className="mt-10 text-gray-500 text-sm flex justify-center items-center">
        <Spinner/>
      </div>
    );
  }
  else if(postsResponse.data.length === 0) {
    return <div className="mt-10 text-gray-500 text-sm">No posts to show</div>;
  }
  return (
    <div className="flex flex-col gap-7 mt-10">
      {/* {postsResponse.data && postsResponse.data.length === 0 && (
        <div className="text-gray-500 text-sm">
          No posts on timeline to show
        </div>
      )} */}
      {postsResponse && postsResponse.data.map((post: any) => {
          return <PostItem key={post._id} post={post} />;
        })}
    </div>
  );
}

export default Timeline;
