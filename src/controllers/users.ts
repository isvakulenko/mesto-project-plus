import { Request, Response } from 'express';
// импортируем модель
import user from '../models/users';
import { TFakeAuth } from '../utils/types';
import {
  NO_VALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} from '../utils/const';
// -----------------------------------------------------------------------------------
// возвращает всех пользователей
export const getUsers = (req: Request, res: Response) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }));
};
// -----------------------------------------------------------------------------------
// возвращает пользователя по _id
export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;
  user
    .findById(id)
    .orFail(() => {
      // Этот коллбэк сработает, если вы передали валидный id
      // (т.е. правильный по формату монги айдишник), но в базе по нему ничего не найдено
      const err = new Error('Пользователь не найден');
      err.name = 'UserNotFoundError'; // или любой другой признак, по которому в catch можно будет определить эту ошибку
      throw err;
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      // Когда условный метод findById(someId) вызывается,
      // монгуз под капотом преобразовывает его параметр в ObjectId примерно таким вызовом:
      // const mongoId = new mongoose.Schema.Types.ObjectId(someId);
      // Такое хозяйство может выкинуть ошибку CastError, если someId не удаётся преобразоваться
      // к mongoId. Это нам и нужно поймать и ответить 400 кодом.
      if (err.name === 'CastError') {
        res
          .status(NO_VALID_DATA_ERROR)
          .send({ message: 'Невалидный формат id пользователя' });
      } else if (err.name === 'UserNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ messsage: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
// -----------------------------------------------------------------------------------
// создаёт пользователя
export const createUser = (req: Request, res: Response) => {
  // вытащили нужные поля из POST-запроса
  const { name, about, avatar } = req.body;
  // передали их объектом в create метод модели
  user
    .create({ name, about, avatar })
    // в случае успеха в user лежит новосозданный в БД объект
    .then((users) => res.status(201).send({ data: users }))
    .catch((err) => {
      // любая ошибка, нужно понять какая, и правильно ответить на фронт
      if (err.name === 'ValidationError') {
        res.status(NO_VALID_DATA_ERROR).send({ messsage: err.message });
      }
      res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};
// -----------------------------------------------------------------------------------
// обновляет профиль
export const editProfile = (req: TFakeAuth, res: Response) => {
  // вытащили нужные поля из PATCH-запроса
  const { name, about } = req.body;
  // передали их объектом в метод модели
  user
    .findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      const err = new Error('Пользователь не найден');
      err.name = 'UserNotFoundError';
      throw err;
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(NO_VALID_DATA_ERROR)
          .send({ message: 'Невалидный формат id пользователя' });
      } else if (err.name === 'UserNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ messsage: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
// -----------------------------------------------------------------------------------
// обновляет аватар
export const editAvatar = (req: TFakeAuth, res: Response) => {
  // вытащили нужные поля из PATCH-запроса
  const { avatar } = req.body;
  // передали их объектом в метод модели
  user
    .findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      const err = new Error('Пользователь не найден');
      err.name = 'UserNotFoundError';
      throw err;
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(NO_VALID_DATA_ERROR)
          .send({ message: 'Невалидный формат id пользователя' });
      } else if (err.name === 'UserNotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ messsage: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
