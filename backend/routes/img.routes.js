const express = require('express');
const router = express.Router();
const upload = require('../services/multer.service');
const imgController = require('../controllers/img.controller');

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Get all uploaded images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: A list of uploaded images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 *       500:
 *         description: Server error
 */
router.get('/', imgController.renderImagePage);

/**
 * @swagger
 * /api/images:
 *   post:
 *     summary: Upload a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               image:
 *                 type: file
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       500:
 *         description: Upload failed
 */
router.post('/', upload.single('image'), imgController.uploadImage);

module.exports = router;
