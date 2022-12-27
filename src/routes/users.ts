import { Router } from 'express';
import {
  getUsers,
  getUserById,
  editProfile,
  editAvatar,
  getCurrentUser,
} from '../controllers/users';
import { validateAvatar, validateUserProfile, validateUserId } from '../middlewares/validators';

const router = Router();

// возвращает всех пользователей
router.get('/', getUsers);
// возвращает информацию о текущем пользователе
router.get('/me', getCurrentUser);
// возвращает пользователя по _id
router.get('/:userId', validateUserId, getUserById);
// обновляет аватар
router.patch('/me/avatar', validateAvatar, editAvatar);
// обновляет профиль
router.patch('/me', validateUserProfile, editProfile);

export default router;
