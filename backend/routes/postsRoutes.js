import express from 'express';
import rateLimit from 'express-rate-limit';
import controller from '../controllers/postsController.js';
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

const rateLimiterForSeen = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    }
});

router.get('/getAllPosts', rateLimiter, requireAuth, controller.getAllPosts);
router.get('/getPostsByFilter/:order_filter/:post_filter/:current_user_id', requireAuth, controller.getPostsByFilter);
router.get('/getPostById/:id', requireAuth, controller.getPostById);
router.get('/getUserHasLiked/:id_post/:id_user', requireAuth, controller.getUserHasLiked);

router.post('/writePost', rateLimiter, requireAuth, controller.writeNewPost);
router.post('/setUserReaction/:id_post/:id_user/:likes', rateLimiter, requireAuth, controller.setUserReaction);
router.post('/markPostAsSeenByUser/:id_post/:id_user', rateLimiterForSeen, requireAuth, controller.markPostAsSeenByUser);

router.patch('/editPost', rateLimiter, requireAuth, controller.editPost);
router.patch('/toggleUserReaction/:id_post/:id_user/:likes', requireAuth, controller.editUserReaction);

router.delete('/deletePost/:id', rateLimiter, requireAuth, controller.deletePost);
router.delete('/deleteUserReaction/:id_post/:id_user', rateLimiter, requireAuth, controller.deleteUserReaction);

export default router;