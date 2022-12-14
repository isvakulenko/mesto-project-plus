import { Router } from 'express';
import { getUsers, getUserById, createUser } from '../controllers/users';

const router = Router();

//возвращает пользователя по _id
router.get('/:userId', getUserById);
//возвращает всех пользователей
router.get('/', getUsers);
//создаёт пользователя
router.post('/', createUser);

export default router;

