const Post = require('../models/post.model');

const getAllPosts = () => {
  return Post.find({});
};

const createPost = (content) => {
  return Post.create({ content });
};

module.exports = {
  getAllPosts,
  createPost,
};