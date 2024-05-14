import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true    
  },
  content: {
    type: String,
    required: true
  },
  isReply: {
    type: Boolean,
    default: false
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comments'
  },
  repliesCount: {
    type: Number,
    default: 0,
  },
},{
    timestamps: true
})


if(mongoose.models && mongoose.models['comments']){
    delete mongoose.models['comments'];
}

const commentModel = mongoose.model('comments',commentSchema);
export default commentModel;