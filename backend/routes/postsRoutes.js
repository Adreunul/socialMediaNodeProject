import express from 'express';
import controller from '../controllers/postsController.js';

const router = express.Router();

router.get('/getAllPosts', controller.getAllPosts);
router.get('/getPostById/:id', controller.getPostById);
router.post('/writePost', controller.writeNewPost);
router.patch('/editPost', controller.editPost);
router.delete('/deletePost/:id', controller.deletePost);

export default router;