import Spinner from "@/components/Spinner";
import { PostType } from "@/interfaces/PostType";
import { UserType } from "@/interfaces/UserType";
import { getPostLikes } from "@/server-actions/likes";
import { Modal, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function LikesModal({
  showLikesModal,
  setShowLikesModal,
  post,
}: {
  showLikesModal: boolean;
  setShowLikesModal: (value: boolean) => void;
  post: PostType;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usersLiked, setUsersLiked] = useState<UserType[]>([]);

  const getLikes = async () => {
    try {
      setLoading(true);
      const response = await getPostLikes(post._id);
      if (response.success) {
        setUsersLiked(response.data);
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
    getLikes();
  }, [showLikesModal]);
  return (
    <Modal
      title="Likes"
      onCancel={() => {
        setShowLikesModal(false);
      }}
      open={showLikesModal}
      footer={null}
      centered
    >
      <hr className="border border-solid border-gray-300" />
      {loading && (
        <div className="h-40 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="flex flex-col gap-5 m-2">
        {!loading && usersLiked.length === 0 && (
          <div className="text-gray-500">No Likes to display</div>
        )}
        {!loading &&
          usersLiked.length !== 0 &&
          usersLiked.map((u: UserType[] | any, index) => {
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
                </div>
              </div>
            );
          })}
      </div>
    </Modal>
  );
}

export default LikesModal;
