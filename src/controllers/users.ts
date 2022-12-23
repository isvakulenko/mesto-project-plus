import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/users';
import {
  NO_VALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} from '../utils/const';
import { SessionRequest } from '../utils/types';

const { JWT_SECRET = 'some-secret-key' } = process.env;
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
          .send({ message: 'Невалидный формат id пользователя1' });
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
  const {
    name, about, avatar, email, password,
  } = req.body;
  // передали их объектом в create метод модели
  // хешируем пароль
  bcrypt.hash(req.body.password, 10).then((hash: string) => user
    .create({
      email,
      password: hash, // записываем хеш в базу
      name,
      about,
      avatar,
    }) // в случае успеха в user лежит новосозданный в БД объект
    .then((users) => res.status(201).send({ data: users }))
    .catch((err) => {
      // любая ошибка, нужно понять какая, и правильно ответить на фронт
      if (err.name === 'ValidationError') {
        res.status(NO_VALID_DATA_ERROR).send({ messsage: err.message });
      }
      res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    }));
};
// -----------------------------------------------------------------------------------
// обновляет профиль
export const editProfile = (req: SessionRequest, res: Response) => {
  // вытащили нужные поля из PATCH-запроса
  const { name, about } = req.body;
  // передали их объектом в метод модели
  user
    .findByIdAndUpdate(
      req.user,
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
      if (err.name === 'ValidationError') {
        res.status(NO_VALID_DATA_ERROR).send({ messsage: err.message });
      } else if (err.name === 'CastError') {
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
export const editAvatar = (req: SessionRequest, res: Response) => {
  // вытащили нужные поля из PATCH-запроса
  const { avatar } = req.body;
  // передали их объектом в метод модели
  user
    .findByIdAndUpdate(
      req.user,
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
      if (err.name === 'ValidationError') {
        res.status(NO_VALID_DATA_ERROR).send({ messsage: err.message });
      } else if (err.name === 'CastError') {
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
// аутентификация
export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  return user
    .findUserByCredentials(email, password)
    .then((users) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: users._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
      // можно и так передать, записать JWT в httpOnly куку
      // res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
    })
    .catch((err) => {
      // ошибка аутентификации
      res.status(401).send({ message: err.message });
    });
};
// -----------------------------------------------------------------------------------
// возвращает информацию о текущем пользователе
export const getCurrentUser = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  user
    .findOne({ _id: req.user })
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};
