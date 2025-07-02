const express = require('express');
const router = express.Router();
const postControler = require('../controllers/post.controller')

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new Editor.js post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: object
 *                 description: Editor.js output (time, blocks, version)
 *             example:
 *               content:
 *                 time: 1683123123000
 *                 blocks:
 *                   - type: paragraph
 *                     data:
 *                       text: Hello from Swagger!
 *                 version: "2.27.0"
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Invalid EditorJS content
 *       500:
 *         description: Server error
 */
router.post('/', postControler.createPost)

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Array of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
router.get('/', postControler.getAllPosts)

module.exports = router;