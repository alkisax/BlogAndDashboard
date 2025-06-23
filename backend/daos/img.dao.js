const Image = require('../models/img.model');

const getAllImages = () => {
 return Image.find({});
}
const createImage = (imageData) => {
  return Image.create(imageData)
};

module.exports = {
  getAllImages,
  createImage
};
