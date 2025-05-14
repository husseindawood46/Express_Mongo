import mongoose from 'mongoose';
const postSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
export const Post = mongoose.model('Post', postSchema);
