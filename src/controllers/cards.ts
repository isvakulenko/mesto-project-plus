import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import card from '../models/cards';
import NotFoundError from '../errors/not-found-err';
import InvalidRequestError from '../errors/invalid-request-err';
import ForbiddenError from '../errors/forbidden-err';
import { SessionRequest, OwnerRequest } from '../utils/types';
// -----------------------------------------------------------------------------------
// возвращает все карточки
export const getCards = (req: Request, res: Response, next: NextFunction) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};
// -----------------------------------------------------------------------------------
// создаёт карточку
export const createCard = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  // вытащили нужные поля из POST-запроса
  const { name, link } = req.body;
  // передали их объектом в create метод модели
  card
    .create({ name, link, owner: req.user })
    // в случае успеха в card лежит новосозданный в БД объект
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidRequestError(err.message));
      } else {
        next(err);
      }
    });
};

// -----------------------------------------------------------------------------------
// удаляет карточку по идентификатору
export const deleteCardById = (
  req: OwnerRequest,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.cardId;
  const currentUser = req.user?._id;
  card
    .findById(id)
    .orFail(new NotFoundError('Карточка с id не найдена'))
    .then((cards) => {
      if (cards.owner.toString() !== currentUser) {
        // cards.owner
        // объект вида ObjectId('6398acce83ff12ee373db5e6'), приводится к строке
        next(new ForbiddenError('Нельзя удалить чужую карточку'));
      } else {
        // eslint-disable-next-line no-shadow
        card.findByIdAndRemove(id).then((cards) => res.send({ data: cards }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Невалидный формат id пользователя'));
      }
      next(err);
    });
};
// -----------------------------------------------------------------------------------
// поставить карточке like
export const likeCard = (
  req: OwnerRequest,
  res: Response,
  next: NextFunction,
) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(new NotFoundError('Карточка с id не найдена'))
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Невалидный формат id карточки '));
      }
      next(err);
    });
};
// -----------------------------------------------------------------------------------
// убрать лайк с карточки
export const dislikeCard = (
  req: OwnerRequest,
  res: Response,
  next: NextFunction,
) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      // убрать _id из массива // ObjectId  чтобы убрать конфликт типов
      { $pull: { likes: req.user?._id as unknown as ObjectId } },
      { new: true },
    )
    .orFail(new NotFoundError('Карточка с id не найдена'))
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Невалидный формат id карточки'));
      }
      next(err);
    });
};
