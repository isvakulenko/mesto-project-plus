import { Router } from 'express';
import {
  getUsers,
  getUserById,
  editProfile,
  editAvatar,
  getCurrentUser,
} from '../controllers/users';

const router = Router();

// возвращает всех пользователей
router.get('/', getUsers);
// возвращает информацию о текущем пользователе
router.get('/me', getCurrentUser);
// возвращает пользователя по _id
router.get('/:userId', getUserById);
// обновляет аватар
router.patch('/me/avatar', editAvatar);
// обновляет профиль
router.patch('/me', editProfile);

export default router;
