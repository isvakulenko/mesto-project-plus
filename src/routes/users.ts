import { Router } from 'express';
import {
  getUsers,
  getUserById,
  editProfile,
  editAvatar,
} from '../controllers/users';

const router = Router();

// возвращает пользователя по _id
router.get('/:userId', getUserById);
// возвращает всех пользователей
router.get('/', getUsers);
// обновляет профиль
router.patch('/me', editProfile);
// обновляет аватар
router.patch('/me/avatar', editAvatar);

export default router;
