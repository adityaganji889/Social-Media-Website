"use client";
import { PostType } from "@/interfaces/PostType";
import React, { useState } from "react";
import { getDateTimeFormat } from "@/helpers/dateTimeFormats";
import {
  Heart,
  Share,
  Bookmark,
  CircleChevronLeft,
  CircleChevronRight,
  Circle,
  CircleUserRound
} from "lucide-react";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import { likePost, unlikePost } from "@/server-actions/likes";
import LikesModal from "./LikesModal";
import { addNewComment } from "@/server-actions/comments";
import CommentsModal from "./CommentsModal";
import { savePost, unsavePost, archivePost, unarchivePost, deletePost } from "@/server-actions/posts";
import { useRouter } from "next/navigation";
import { addNewNotification } from "@/server-actions/notifications";
import EditPostModal from "./EditPostModal";
import TagModal from "./TagModal";

type postType = "feed" | "uploaded" | "tagged" | "saved" | "archived";

function PostItem({
  post,
  type = "feed",
  reloadData = () => {},
  onClick = () => {}
}: {
  post: PostType;
  type?: postType;
  reloadData?: any;
  onClick?: any;
}) {
  const router = useRouter();
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [likesCount, setLikesCount] = useState(post.likedBy.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [saved = false, setSaved] = useState(
    post.savedBy.includes(loggedInUserData?._id!)
  );
  const [liked, setLiked] = useState(
    post.likedBy.includes(loggedInUserData?._id!)
  );
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPostEditModal, setShowPostEditModal] = useState(false);
  const [showTaggedModal, setShowTaggedModal] = useState(false);
  const likeHandler = async () => {
    try {
      const response = await likePost({
        postId: post._id,
        userId: loggedInUserData?._id!,
      });
      if (response.success) {
        setLiked(true);
        setLikesCount(likesCount + 1);
        addNewNotification({
          user: post.user._id,
          type: "like",
          text: `${loggedInUserData?.name} liked your post`,
          onClickPath: `/post/${post._id}`,
          read: false,
        });
        message.success(response.message);
      } else {
        message.info(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const unlikeHandler = async () => {
    try {
      const response = await unlikePost({
        postId: post._id,
        userId: loggedInUserData?._id!,
      });
      if (response.success) {
        setLiked(false);
        setLikesCount(likesCount - 1);
        message.success(response.message);
      } else {
        message.info(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const handleAddComment = async () => {
    try {
      setLoading(true);
      const response = await addNewComment({
        payload: {
          post: post._id,
          user: loggedInUserData?._id!,
          content: commentText,
        },
        postId: post._id,
      });
      if (response.success) {
        setCommentText("");
        setCommentsCount(commentsCount + 1);
        addNewNotification({
          user: post.user._id,
          type: "comment",
          text: `${loggedInUserData?.name} commented on your post`,
          onClickPath: `/post/${post._id}`,
          read: false,
        });
        message.success(response.message);
      } else {
        message.info(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const savePostHandler = async () => {
    try {
      const response = await savePost({
        postId: post._id,
        userId: loggedInUserData?._id!,
      });

      if (response.success) {
        setSaved(true);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const unsaveHandler = async () => {
    try {
      const response = await unsavePost({
        postId: post._id,
        userId: loggedInUserData?._id!,
      });

      if (response.success) {
        setSaved(false);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const archivePostHandler = async () => {
    try {
      setLoading(true);
      const response = await archivePost(post._id);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveHandler = async () => {
    try {
      setLoading(true);
      const response = await unarchivePost(post._id);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePostHandler = async () => {
    try {
      setLoading(true);
      const response = await deletePost(post._id);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col border border-gray-300 border-solid rounded-md">
      <div className="flex gap-5 bg-gray-200 p-3 items-center">
        <img
          src={post.user.profilePic}
          alt={post.user.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm cursor-pointer" onClick={()=>{
            router.push(`/profile/${post.user._id}`)
          }}>{post.user.name}</span>
          <span className="text-xs text-gray-500">
            {getDateTimeFormat(post.createdAt)}
          </span>
        </div>
      </div>
      <div className="relative cursor-pointer" onClick={onClick}>
        <img
          src={post.media[selectedMediaIndex]}
          className="w-full h-[450px]"
        />
        {post.media.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <CircleChevronLeft
              fill="gray"
              className={`cursor-pointer ${
                selectedMediaIndex === 0 ? "opacity-0" : ""
              }`}
              onClick={() => {
                setSelectedMediaIndex(selectedMediaIndex - 1);
              }}
            />
            <CircleChevronRight
              fill="gray"
              className={`cursor-pointer ${
                selectedMediaIndex === post.media.length - 1 ? "opacity-0" : ""
              }`}
              onClick={() => {
                setSelectedMediaIndex(selectedMediaIndex + 1);
              }}
            />
          </div>
        )}
        {post.tags.length>0 && (
           <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
           <CircleUserRound onClick={()=>{
            setShowTaggedModal(true);
           }}
           />
         </div>
        )}
      </div>
      <div className="flex flex-col p-2">
        <div className="flex justify-center items-center gap-2">
          {post.media.length > 1 &&
            post.media.map((_, index) => {
              return (
                <Circle
                  size={10}
                  fill={selectedMediaIndex === index ? "black" : "white"}
                />
              );
            })}
        </div>
        <p className="mt-5 text-sm text-gray-700">
          <b className="text-primary">@ {post.user.name} </b>
          {post.caption}
        </p>
        <p className="mt-2 text-xs text-gray-600">{post.hashTags.toString()}</p>
        <div className="flex justify-between mt-5">
          <div className="flex gap-5">
            <Heart
              size={20}
              fill={liked ? "red" : "none"}
              onClick={() => {
                if (liked) {
                  unlikeHandler();
                } else {
                  likeHandler();
                }
              }}
              className="cursor-pointer"
            />
            <Share size={20} />
          </div>
          <Bookmark size={20}  fill={saved ? "blue" : "none"}
            onClick={saved ? unsaveHandler : savePostHandler} className="cursor-pointer" />
        </div>
        <div className="flex gap-10 mt-3 text-sm font-semibold">
          <p
            className="text-sm cursor-pointer"
            onClick={() => {
              if (likesCount > 0) {
                setShowLikesModal(true);
              }
            }}
          >
            {likesCount} likes
          </p>
          <p
            className="text-sm font-semibold cursor-pointer"
            onClick={() => {
              if (commentsCount > 0) {
                setShowCommentsModal(true);
              }
            }}
          >
            {commentsCount} comments
          </p>
        </div>
        {/* <div className="flex gap-5 mt-3 items-center">
          <input
            className="bg-gray-200 px-5 py-3 border-none focus:outline-none w-[85%] rounded"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
          />
          {commentText !== "" && (
            <Button type="text" loading={loading} onClick={handleAddComment}>
              Post
            </Button>
          )}
        </div> */}
        {type === "feed" && (
          <div className="flex gap-5 mt-3 items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-gray-200 px-5 py-3 border-none focus:outline-none w-[85%] rounded"
            />
            {commentText && (
              <Button onClick={handleAddComment} loading={loading} type="text">
                Post
              </Button>
            )}
          </div>
        )}

        {type === "uploaded" && post.user._id === loggedInUserData?._id && (
          <div className="flex gap-5 mt-3 items-center">
            {!post.isArchived ? (
              <Button
                danger
                type="primary"
                size="small"
                onClick={archivePostHandler}
              >
                Archive
              </Button>
            ) : (
              <Button type="primary" size="small" onClick={unarchiveHandler}>
                Unarchive
              </Button>
            )}
            <Button size="small" type="primary" onClick={()=>{
              setShowPostEditModal(true);
            }}>
              Edit
            </Button>
            <Button size="small" onClick={deletePostHandler}>
              Delete
            </Button>
          </div>
        )}
      </div>
      {showLikesModal && (
        <LikesModal
          showLikesModal={showLikesModal}
          setShowLikesModal={setShowLikesModal}
          post={post}
        />
      )}
      {showCommentsModal && (
        <CommentsModal
          showCommentsModal={showCommentsModal}
          setShowCommentsModal={setShowCommentsModal}
          post={post}
        />
      )}
       {showPostEditModal && (
            <EditPostModal showPostEditModal={showPostEditModal} setShowPostEditModal={setShowPostEditModal} user={loggedInUserData!} post={post!}  reloadData = {reloadData}/>
        )}
      {showLikesModal && (
        <LikesModal
          showLikesModal={showLikesModal}
          setShowLikesModal={setShowLikesModal}
          post={post}
        />
      )}
      {showTaggedModal && (
        <TagModal
          showTaggedModal={showTaggedModal}
          setShowTaggedModal={setShowTaggedModal}
          post={post}
        />
      )}
    </div>
  );
}

export default PostItem;
