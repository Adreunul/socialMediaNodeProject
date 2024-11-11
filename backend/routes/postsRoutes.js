import express from 'express';
import controller from '../controllers/postsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getAllPosts', controller.getAllPosts);
router.get('/getPostsByFilter/:order_filter/:post_filter/:current_user_id', controller.getPostsByFilter);
router.get('/getPostById/:id', controller.getPostById);
router.get('/getUserHasLiked/:id_post/:id_user', controller.getUserHasLiked);

router.post('/writePost', requireAuth, controller.writeNewPost);
router.post('/setUserReaction/:id_post/:id_user/:likes', requireAuth, controller.setUserReaction);
router.post('/markPostAsSeenByUser/:id_post/:id_user', requireAuth, controller.markPostAsSeenByUser);

router.patch('/editPost', requireAuth, controller.editPost);
router.patch('/toggleUserReaction/:id_post/:id_user/:likes', requireAuth, controller.editUserReaction);

router.delete('/deletePost/:id', requireAuth, controller.deletePost);
router.delete('/deleteUserReaction/:id_post/:id_user', requireAuth, controller.deleteUserReaction);

export default router;