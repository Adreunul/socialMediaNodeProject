import express from 'express';
import controller from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getUsernameById/:id_user', requireAuth, controller.getUsernameById);
router.get('/getUserById/:id_user', requireAuth, controller.getUserById);

router.patch('/updateUsername/:id_user', requireAuth, controller.updateUsername);
router.patch('/updateBio/:id_user', requireAuth, controller.updateBio);

export default router;