import express from 'express';
import { register, login, logout, refresh, getMe, getAllUsers, changePassword, forgotPassword } from '../controllers/authController.js';
import { protect, systemRoleGuard } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', protect, changePassword);
router.get('/me', protect, getMe);
router.get('/users', protect, systemRoleGuard('admin'), getAllUsers);

export default router;
