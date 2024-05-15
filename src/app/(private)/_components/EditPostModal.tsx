import {
  getImageDetailsFromFirebase,
  uploadImageToFirebase,
} from "@/helpers/uploads";
import { PostType } from "@/interfaces/PostType";
import { UserType } from "@/interfaces/UserType";
import { createPost, updatePost } from "@/server-actions/posts";
import { getFollowingsOfUser } from "@/server-actions/users";
import { message, Modal, Upload, Select, Input } from "antd";
import React, { useEffect, useState } from "react";

function EditPostModal({
  showPostEditModal,
  setShowPostEditModal,
  user,
  post,
}: {
  showPostEditModal: boolean;
  setShowPostEditModal: (value: boolean) => void;
  user: UserType;
  post: PostType;
}) {
  const [media, setMedia] = useState<any[]>(post.media);
  const [caption, setCaption] = useState(post.caption);
  const [hashTags, setHashTags] = useState<string>(post.hashTags.join(","));
  const [taggedUsers, setTaggedUsers] = useState<UserType[]>(post.tags);
  const [loading, setLoading] = useState<boolean>(false);
  const [following, setFollowing] = useState<any[]>([]);
  const [picFiles, setPicFiles] = useState<any[]>([]);
  const [mediaNew, setMediaNew] = useState<any[]>([]);
  const [imageFilesBack, setImageFilesBack] = useState<any[]>([]);
  let imageFiles: any = null;
  const getFollowing = async () => {
    try {
      setLoading(true);
      imageFiles = await getImageDetailsFromFirebase();
      setImageFilesBack(imageFiles);
      const response = await getFollowingsOfUser(user._id);
      if (response.success) {
        setLoading(false);
        const tempFollowing = response.data.map((u: any) => ({
          label: u.name,
          value: u._id,
        }));
        setFollowing(tempFollowing);
        let pics = [];
        
        for (var j = 0; j < media.length; j++) {
          for (var i = 0; i < imageFiles.length; i++) {
            if (imageFiles[i].downloadURL == media[j]) {
              pics.push({
                uid: j + 1,
                name: imageFiles[i].fileName,
                status: "done",
                response: "Server", // custom error message to show
                url: post.media[j],
              });
            }
          }
        }
        console.log("pics: ", pics);
        setPicFiles(pics);
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
  const handleEditPost = async () => {
    try {
      setLoading(true);
      let mediaUrls = [];
      if (imageFilesBack) {
        for (let i = 0; i < picFiles.length; i++) {
          if(picFiles[i] instanceof File){
            let url = await uploadImageToFirebase(picFiles[i]);
            mediaUrls.push(url);
          }
          else if(media.includes(picFiles[i].url)){
            mediaUrls.push(picFiles[i].url);
          }
        }

        const payload = {
          media: mediaUrls,
          caption: caption,
          hashTags: hashTags.split(",").map((tag) => tag.trim()),
          tags: taggedUsers,
        };
        const response = await updatePost({
          postId: post._id,
          payload,
        });
        if (response.success) {
          message.success(response.message);
          setShowPostEditModal(false);
        } else {
          message.info("Failed to Edit post");
        }
      } else {
        message.error("images files is null");
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFollowing();
  }, []);
  return (
    <Modal
      title="Edit this Post"
      open={showPostEditModal}
      onCancel={() => {
        setShowPostEditModal(false);
      }}
      centered
      okText="Upload"
      onOk={handleEditPost}
      okButtonProps={{ loading: loading, disabled: media.length === 0 }}
    >
      <hr className="border border-gray-300 my-3 border-solid" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Edit Upload</div>
          <Upload
            listType="picture-card"
            fileList={picFiles}
            beforeUpload={(file) => {
              setPicFiles((prev) => [...prev, file]);
              return false;
            }}
            multiple
            onRemove={(file) => {
              setPicFiles((prev) => prev.filter((f) => f.name !== file.name));
              return false;
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
          <div className="text-sm text-gray-500">Hashtags</div>
          <Input.TextArea
            placeholder="Mention Hash Tags for your post if any"
            value={hashTags}
            onChange={(e) => {
              setHashTags(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500">Tag Users</div>
          <Select
            mode="multiple"
            placeholder="Tag Users in your post"
            value={taggedUsers}
            onChange={(value) => {
              setTaggedUsers(value);
            }}
            options={following}
          />
        </div>
      </div>
    </Modal>
  );
}

export default EditPostModal;
