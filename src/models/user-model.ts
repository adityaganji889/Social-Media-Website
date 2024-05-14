import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "users",
        default: []
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "users",
        default: []
    },
    followRequestsSent: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "users",
        default: []
    },
    followRequestsReceived: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "users",
        default: []
    },
    isPrivateAccount: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

if(mongoose.models && mongoose.models["users"]){
    delete mongoose.models["users"];
}


const userModel = mongoose.model("users",userSchema);
// module.exports = userModel;
export default userModel;