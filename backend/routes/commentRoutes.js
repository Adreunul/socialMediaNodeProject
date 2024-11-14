import express from 'express';
import rateLimit from 'express-rate-limit';
import controller from '../controllers/commentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    }
});


router.get('/getCommentsByPostId/:id/:order_filter/:comment_filter/:current_user_id', rateLimiter, requireAuth, controller.getCommentsByPostId);
router.get('/getUserHasLiked/:comment_id/:user_id', rateLimiter, requireAuth, controller.getUserHasLiked);

router.post('/writeComment', requireAuth, rateLimiter, controller.createComment);
router.post('/setUserReaction/:comment_id/:user_id', rateLimiter, requireAuth, controller.setUserReaction);

router.delete('/deleteUserReaction/:comment_id/:user_id', rateLimiter, requireAuth, controller.deleteUserReaction);
router.delete('/deleteComment/:comment_id', rateLimiter, requireAuth, controller.deleteComment);
export default router;