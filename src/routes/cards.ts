import { Router } from 'express';
import { getCards, createCard, deleteCardById } from '../controllers/cards';

const router = Router();

//возвращает всех карточки
router.get('/', getCards);
//создаёт карточку
router.post('/', createCard);
//удаляет карточку по идентификатору _id
router.delete('/:cardId', deleteCardById);

export default router;