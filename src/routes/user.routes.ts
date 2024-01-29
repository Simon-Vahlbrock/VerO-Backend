import express from 'express';
import UserController from '../controllers/user.controller';
import { validateUser } from '../middleware/auth';
import { validateBody } from '../middleware/body';

const router = express.Router();

router.get('/', validateUser, UserController.getAllUsers);
router.get('/user', validateUser, UserController.getUser);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);
router.post('/logout', UserController.logout);
router.patch('/update/:userName', validateUser, validateBody, UserController.updateUser);
router.patch('/update-password', UserController.updatePassword);

export default router;
