import express from 'express';
import UserController from '../controllers/user.controller';
import { validateUser } from '../middleware/auth';

const router = express.Router();

router.get('/', validateUser, UserController.getAllUsers);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshAccessToken);
router.post('/logout', UserController.logout);
router.patch('/update-password', UserController.updatePassword);

export default router;
