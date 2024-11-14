import express from 'express';
import rateLimit from 'express-rate-limit';
import controller from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    }
});

const router = express.Router();

router.get('/getUsernameById/:id_user', rateLimiter, requireAuth, controller.getUsernameById);
router.get('/getUserById/:id_user', rateLimiter, requireAuth, controller.getUserById);

router.patch('/updateUsername/:id_user', rateLimiter, requireAuth, controller.updateUsername);
router.patch('/updateBio/:id_user', rateLimiter, requireAuth, controller.updateBio);

export default router;