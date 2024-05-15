import Spinner from '@/components/Spinner';
import { PostType } from '@/interfaces/PostType';
import { UserType } from '@/interfaces/UserType';
import { getPostTags } from '@/server-actions/posts';
import { message, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function TagModal({
    showTaggedModal,
    setShowTaggedModal,
    post,
  }: {
    showTaggedModal: boolean;
    setShowTaggedModal: (value: boolean) => void;
    post: PostType;
  }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [usersTagged, setUsersTagged] = useState<UserType[]>([]);
  
    const getTags = async () => {
      try {
        setLoading(true);
        const response = await getPostTags(post._id);
        if (response.success) {
          setUsersTagged(response.data);
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
      getTags();
    }, [showTaggedModal]);
    return (
      <Modal
        title="People Tagged in this Post"
        onCancel={() => {
          setShowTaggedModal(false);
        }}
        open={showTaggedModal}
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
          {!loading && usersTagged.length === 0 && (
            <div className="text-gray-500">No Tags to display</div>
          )}
          {!loading &&
            usersTagged.length !== 0 &&
            usersTagged.map((u: UserType[] | any, index) => {
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

export default TagModal