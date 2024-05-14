import { getTimelinePostsOfLoggedInUser } from "@/server-actions/posts";
import { message } from "antd";
import React from "react";
import PostItem from "./PostItem";

async function Timeline() {
  const postsResponse = await getTimelinePostsOfLoggedInUser();
  if (!postsResponse.success) {
    return (
      <div className="mt-10 text-gray-500 text-sm">
        Failed to load timeline posts
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
      {postsResponse.data.map((post: any) => {
          return <PostItem key={post._id} post={post} />;
        })}
    </div>
  );
}

export default Timeline;
