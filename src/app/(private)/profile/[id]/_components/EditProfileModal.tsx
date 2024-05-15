import { uploadImageToFirebase } from '@/helpers/uploads';
import { UserType } from '@/interfaces/UserType'
import { updateUserProfile } from '@/server-actions/users';
import { Input, Modal, Switch, Upload, message } from 'antd';
import React, { useState } from 'react'

function EditProfileModal({user, showEditProfileModal, setShowEditProfileModal} : {
    user: UserType;
    showEditProfileModal: boolean;
    setShowEditProfileModal:  (value: boolean) => void;
}) {
  const [bio,setBio] = useState(user.bio);  
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [isPrivateAccount, setIsPrivateAccount] = useState(user.isPrivateAccount);
  const [loading, setLoading] = useState<boolean>(false);
  const updateHandler = async() => {
    try{
       setLoading(true)
       const payload:any = {
        bio,
        isPrivateAccount
       }
       if(newProfilePic){
        payload.profilePic = await uploadImageToFirebase(newProfilePic);
       }
       const response = await updateUserProfile({
        payload,
        userId: user._id
       })
       if(response.success){
           message.success(response.message);
       }
       else{
            message.info(response.message);
       }
    }
    catch(error:any){
            message.error(error.message);
    }
    finally{
        setLoading(false);
        setShowEditProfileModal(false);
    }
  }
  return (
    <Modal title="Edit Profile" open={showEditProfileModal} onCancel={()=>{
        setShowEditProfileModal(false)
    }} centered okText="Save" onOk={updateHandler} okButtonProps={{ loading }} cancelButtonProps={{ disabled: loading}}>
      <hr className='border-solid border-gray-300 my-3'/>
      <div className="flex flex-col gap-5">
        <div>
            <span className="text-gray-500 text-lg">
                Bio
            </span>
            <Input.TextArea 
             value={bio}
             onChange={(e) => {
                setBio(e.target.value);
             }}
             placeholder='Add your bio here...'
            />
        </div>
        <div className="flex gap-5">
            {!newProfilePic && <img 
             src={user.profilePic}
             alt={user.name}
             className='w-24 h-24 object-cover'
            />}
            <Upload listType='picture-card' beforeUpload = {(file:any) => {
              setNewProfilePic(file);
              return false;
            }}>
             <span className="text-gray-700 text-md">
               Change
             </span>
            </Upload>
        </div>
        <div className='flex gap-3'>
           <span className="text-gray-500">
            Is Private Account
           </span>
           <Switch checked={isPrivateAccount} onChange={()=>setIsPrivateAccount(!isPrivateAccount)} />
        </div>
      </div>
    </Modal>
  )
}

export default EditProfileModal