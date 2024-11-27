import express from 'express';
import rateLimit from 'express-rate-limit';
import controller from '../controllers/authController.js';
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


router.post('/login', rateLimiter, controller.login);
router.patch('/updatePassword', rateLimiter, requireAuth, controller.updatePassword);
router.post('/logout', rateLimiter, requireAuth, controller.logout);
router.get('/session', rateLimiter, requireAuth, controller.getMyCurrentSession);

export default router;