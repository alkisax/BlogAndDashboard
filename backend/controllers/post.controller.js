// controllers/post.controller.js
const postDao = require('../daos/post.dao');

const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.blocks) {
      return res.status(400).json({ error: 'Invalid EditorJS content' });
    }

    const savedPost = await postDao.createPost(content);

    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving post' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postDao.getAllPosts()
    res.status(201).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching posts' })
  }
}

module.exports = {
  createPost,
  getAllPosts,
};
