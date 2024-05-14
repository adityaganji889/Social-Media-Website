import Spinner from "@/components/Spinner";
import { PostType } from "@/interfaces/PostType";
import { getRootLevelCommentsOfPost } from "@/server-actions/comments";
import { Modal, message } from "antd";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { CommentType } from "@/interfaces/CommentType";

function CommentsModal({
  showCommentsModal,
  setShowCommentsModal,
  post,
}: {
  showCommentsModal: boolean;
  setShowCommentsModal: (value: boolean) => void;
  post: PostType;
}) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [rootLevelComments, setRootLevelComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const getRootLevelComments = async () => {
    try {
      setLoading(true);
      const response = await getRootLevelCommentsOfPost(post._id);
      if (response.success) {
        setRootLevelComments(response.data);
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
  useEffect(() => {
    getRootLevelComments();
  }, []);
  return (
    <Modal
      open={showCommentsModal}
      onCancel={() => {
        setShowCommentsModal(false);
      }}
      footer={null}
      centered
      width={1000}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="relative">
          <img
            src={post.media[selectedMediaIndex]}
            className="w-full h-[300px]"
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
                  selectedMediaIndex === post.media.length - 1
                    ? "opacity-0"
                    : ""
                }`}
                onClick={() => {
                  setSelectedMediaIndex(selectedMediaIndex + 1);
                }}
              />
            </div>
          )}
        </div>
        <div>
         {loading && <div className="h-40 w-full flex items-center justify-center">
          <Spinner />
          </div>}
        <div className="flex flex-col gap-7">
        {rootLevelComments.length !== 0 &&
            rootLevelComments.map((comment: CommentType, index) => {
              return <Comment comment={comment} key={comment?._id} />;
            })}
        </div>
        </div>
      </div>
    </Modal>
  );
}

export default CommentsModal;
