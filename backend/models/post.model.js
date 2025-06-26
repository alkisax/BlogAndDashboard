const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    time: Number,
    blocks: [mongoose.Schema.Types.Mixed],
    version: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);