import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCardBody, validateCardId } from '../middlewares/validators';

const router = Router();

// возвращает всех карточки
router.get('/', getCards);
// создаёт карточку
router.post('/', validateCardBody, createCard);
// удаляет карточку по идентификатору _id
router.delete('/:cardId', deleteCardById);
// поставить лайк карточке
router.put('/:cardId/likes', validateCardId, likeCard);
// убрать лайк с карточки
router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
