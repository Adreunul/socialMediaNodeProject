import express from 'express';
import controller from '../controllers/authController.js';

const router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.patch('/updatePassword', controller.updatePassword);
router.post('/logout', controller.logout);
router.get('/session', controller.getMyCurrentSession);

export default router;