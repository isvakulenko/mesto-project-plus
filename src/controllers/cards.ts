import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
// импортируем модель
import card from '../models/cards';
import { TFakeAuth } from '../utils/types';
import {
  NO_VALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} from '../utils/const';

// -----------------------------------------------------------------------------------
// возвращает все карточки
export const getCards = (req: Request, res: Response) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }));
};
// -----------------------------------------------------------------------------------
// создаёт карточку
export const createCard = (req: TFakeAuth, res: Response) => {
  // вытащили нужные поля из POST-запроса
  const { name, link } = req.body;
  // передали их объектом в create метод модели
  card
    .create({ name, link, owner: req.user?._id })
    // в случае успеха в card лежит новосозданный в БД объект
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NO_VALID_DATA_ERROR).send({ messsage: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// -----------------------------------------------------------------------------------
// удаляет карточку по идентификатору
export const deleteCardById = (req: Request, res: Response) => {
  const id = req.params.cardId;
  card
    .findByIdAndRemove(id)
    .orFail(() => {
      const err = new Error('Карточка с id не найдена');
      err.name = 'CardNotFoundError';
      throw err;
    })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(NO_VALID_DATA_ERROR)
          .send({ message: 'Невалидный формат id карточки' });
      } else if (err.name === 'CardNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ messsage: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
// -----------------------------------------------------------------------------------
// поставить карточке like
export const likeCard = (req: TFakeAuth, res: Response) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(() => {
      const err = new Error('Карточка с id не найдена');
      err.name = 'CardNotFoundError';
      throw err;
    })
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(NO_VALID_DATA_ERROR)
          .send({ message: 'Невалидный формат id пользователя' });
      } else if (err.name === 'CardNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ messsage: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
// -----------------------------------------------------------------------------------
// убрать лайк с карточки
export const dislikeCard = (req: TFakeAuth, res: Response) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      // убрать _id из массива // ObjectId  чтобы убрать конфликт типов
      { $pull: { likes: req.user?._id as unknown as ObjectId } },
      { new: true },
    )
    .orFail(() => {
      const err = new Error('Карточка с id не найдена');
      err.name = 'CardNotFoundError';
      throw err;
    })
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(NO_VALID_DATA_ERROR)
          .send({ message: 'Невалидный формат id пользователя' });
      } else if (err.name === 'CardNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ messsage: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
