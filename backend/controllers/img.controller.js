// fs = files system
const fs = require('fs');
// Node.js's built-in path module, which helps you safely work with file and folder paths
const path = require('path');
const imgDao = require('../daos/img.dao');

const renderImagePage = async (req, res) => {
  try {
    const items = await imgDao.getAllImages();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const uploadImage = async (req, res) => {
  try {
    const obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: {
        // 🔹 __dirname A Node.js variable that gives the absolute path of the current file.
        //  '../../uploads/' + req.file.filename Goes two folders up from the current file (e.g. from controllers/ → backend/) Then into the uploads/ folderThen adds the uploaded file name (e.g. image-1722188911)
        // path.join(...) Combines paths safely
        data: fs.readFileSync(path.join(__dirname, '../../uploads/' + req.file.filename)),
        contentType: 'image/png'
      }
    };
    await imgDao.createImage(obj);
    res.status(200).json({ message: "image uploaded" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
};

module.exports = {
  renderImagePage,
  uploadImage
};
