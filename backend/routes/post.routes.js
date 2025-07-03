const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller')

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
router.post('/', postController.createPost)

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
router.get('/', postController.getAllPosts)

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post data
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get('/:postId', postController.getPostById);

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Edit a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: object
 *                 properties:
 *                   time:
 *                     type: integer
 *                   blocks:
 *                     type: array
 *                     items:
 *                       type: object
 *                   version:
 *                     type: string
 *     responses:
 *       200:
 *         description: Post successfully updated
 *       400:
 *         description: Invalid EditorJS content
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/:postId', postController.editPost);

module.exports = router;