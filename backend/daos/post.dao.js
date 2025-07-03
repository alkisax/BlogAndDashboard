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

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
};