"use client";
import React, { useEffect, useState } from "react";
import { UserType } from "@/interfaces/UserType";
import { Input, Modal, Select, Upload, message } from "antd";
import { uploadImageToFirebase } from "@/helpers/uploads";
import { createPost } from "@/server-actions/posts";
import { getFollowingsOfUser } from "@/server-actions/users";

function UploadNewPostModal({
  showNewPostModal,
  setShowNewPostModal,
  user,
}: {
  showNewPostModal: boolean;
  setShowNewPostModal: (value: boolean) => void;
  user: UserType;
}) {
  const [media, setMedia] = useState<any[]>([]);
  const [caption, setCaption] = useState("");
  const [hashTags, setHashTags] = useState<string>("");
  const [taggedUsers, setTaggedUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [following, setFollowing] = useState<any[]>([]);
  const handleUpload = async () => {
    try {
      setLoading(true);
      let mediaUrls = [];
      for (let i = 0; i < media.length; i++) {
        let url = await uploadImageToFirebase(media[i]);
        mediaUrls.push(url);
      }
      const payload = {
        user: user?._id,
        media: mediaUrls,
        caption: caption,
        hashTags: hashTags.split(",").map((tag) => tag.trim()),
        tags: taggedUsers,
      };
      const response = await createPost(payload);
      if (response.success) {
        setTimeout(() => {
          message.success(response.message);
          setShowNewPostModal(false);
        }, 5000);
      } else {
        setTimeout(() => {
          message.info("Failed to upload post");
        }, 5000);
      }
    } catch (error: any) {
      setTimeout(() => {
        message.error(error.message);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const getFollowing = async () => {
    try {
      setLoading(true);
      const response = await getFollowingsOfUser(user._id);
      if (response.success) {
        setTimeout(() => {
          setLoading(false);
          const tempFollowing = response.data.map((u: any) => ({
            label: u.name,
            value: u._id,
          }));
          setFollowing(tempFollowing);
          message.success(response.message);
        }, 5000);
      } else {
        setTimeout(() => {
          message.info(response.message);
        }, 5000);
      }
    } catch (error: any) {
      setTimeout(() => {
        message.error(error.message);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getFollowing();
  }, []);
  return (
    <Modal
      title="Upload New Post"
      open={showNewPostModal}
      onCancel={() => {
        setShowNewPostModal(false);
      }}
      centered
      okText="Upload"
      onOk={handleUpload}
      okButtonProps={{ loading: loading, disabled: media.length === 0 }}
    >
      <hr className="border border-gray-300 my-3 border-solid" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Add +</div>
          <Upload
            listType="picture-card"
            beforeUpload={(file) => {
              setMedia((prev) => [...prev, file]);
              return false;
            }}
            multiple
            onRemove={(file) => {
                setMedia((prev)=> prev.filter((f) => f.name !== file.name));
            }}
          >
            <div className="span text-xs text-gray-500">Upload Media</div>
          </Upload>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Captions</div>
          <Input.TextArea
            placeholder="Write a caption for your post"
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col text-gray-500">
        <div className="text-sm text-gray-500">
          Hashtags  
        </div>
        <Input.TextArea
          placeholder="Mention Hash Tags for your post if any"
          value={hashTags}
          onChange={(e) => {
            setHashTags(e.target.value);
          }}
        />
        </div>
        <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500">
                Tag Users
            </div>
            <Select 
             mode="multiple"
             placeholder="Tag Users in your post"
             value={taggedUsers}
             onChange={(value)=>{
                setTaggedUsers(value)
             }}
             options={following}
            />
        </div>
      </div>
    </Modal>
  );
}

export default UploadNewPostModal;
