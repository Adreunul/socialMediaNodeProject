import express from 'express';
import controller from '../controllers/postsController.js';

const router = express.Router();

router.get('/getAllPosts', controller.getAllPosts);
router.post('/writePost', controller.writeNewPost);
router.delete('/deletePost/:id', controller.deletePost);

export default router;