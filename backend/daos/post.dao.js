const Post = require('../models/post.model');

const getAllPosts = () => {
  return Post.find({});
};

const getPostById = async (postId) => {
  return await Post.findById(postId);
};

const createPost = (content) => {
  return Post.create({ content });
};

const editPost = async (postId, content) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('post not found');
  }
  post.content = content;
  return await post.save();
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
};