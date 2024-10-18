import express from 'express';
import controller from '../controllers/postsController.js';

const router = express.Router();

router.get('/getAllPosts', controller.getAllPosts);

export default router;