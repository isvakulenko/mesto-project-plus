import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const router = Router();

// возвращает всех карточки
router.get('/', getCards);
// создаёт карточку
router.post('/', createCard);
// удаляет карточку по идентификатору _id
router.delete('/:cardId', deleteCardById);
// поставить лайк карточке
router.put('/:cardId/likes', likeCard);
// убрать лайк с карточки
router.delete('/:cardId/likes', dislikeCard);

export default router;
