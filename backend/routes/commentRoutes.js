import express from 'express';
import controller from '../controllers/commentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getCommentsByPostId/:id', controller.getCommentsByPostId);
router.get('/getUserHasLiked/:comment_id/:user_id', controller.getUserHasLiked);

router.post('/writeComment', requireAuth, controller.createComment);
router.post('/setUserReaction/:comment_id/:user_id', controller.setUserReaction);

router.delete('/deleteUserReaction/:comment_id/:user_id', controller.deleteUserReaction);
export default router;