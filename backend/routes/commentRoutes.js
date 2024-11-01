import express from 'express';
import controller from '../controllers/commentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getCommentsByPostId/:id', controller.getCommentsByPostId);

router.post('/writeComment', requireAuth, controller.createComment);

export default router;