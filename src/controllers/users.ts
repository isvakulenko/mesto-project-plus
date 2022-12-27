import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/users';
import { SessionRequest } from '../utils/types';
import NotFoundError from '../errors/not-found-err';
import InvalidRequestError from '../errors/invalid-request-err';
import DuplicateError from '../errors/duplicate-err';

const { JWT_SECRET = 'some-secret-key' } = process.env;
// -----------------------------------------------------------------------------------
// возвращает всех пользователей
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
// -----------------------------------------------------------------------------------
// возвращает пользователя по _id
export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.userId;
  user
    .findById(id)
    .orFail(
      // Этот коллбэк сработает, если вы передали валидный id
      // (т.е. правильный по формату монги айдишник), но в базе по нему ничего не найдено
      new NotFoundError('Нет пользователя с таким id'),
    )
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      // Когда условный метод findById(someId) вызывается,
      // монгуз под капотом преобразовывает его параметр в ObjectId примерно таким вызовом:
      // const mongoId = new mongoose.Schema.Types.ObjectId(someId);
      // Такое хозяйство может выкинуть ошибку CastError, если someId не удаётся преобразоваться
      // к mongoId. Это нам и нужно поймать и ответить 400 кодом.
      if (err.name === 'CastError') {
        next(new InvalidRequestError('Невалидный формат id пользователя'));
      }
      next(err);
    });
};
// -----------------------------------------------------------------------------------
// создаёт пользователя
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  // вытащили нужные поля из POST-запроса
  const {
    // eslint-disable-next-line no-unused-vars
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
    .then((users) => res.status(201).send({
      data: {
        name: users.name,
        about: users.about,
        avatar: users.avatar,
        email: users.email,
        _id: users._id,
      },
    }))
    .catch((err) => {
      // любая ошибка, нужно понять какая, и правильно ответить на фронт
      if (err.name === 'ValidationError') {
        next(new InvalidRequestError(err.message));
      // eslint-disable-next-line brace-style
      }
      // пользователь пытается зарегистрироваться по уже существующему в базе email
      else if (err.code === 11000) {
        next(new DuplicateError('Такой e-mail уже зарегистрирован'));
      }
      next(err);
    }));
};
// -----------------------------------------------------------------------------------
// обновляет профиль
export const editProfile = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  // вытащили нужные поля из PATCH-запроса
  const { name, about } = req.body;
  // передали их объектом в метод модели
  user
    .findByIdAndUpdate(
      req.user,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((users) => res.send({ data: users }))
    .catch(next);
};
// -----------------------------------------------------------------------------------
// обновляет аватар
export const editAvatar = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  // вытащили нужные поля из PATCH-запроса
  const { avatar } = req.body;
  // передали их объектом в метод модели
  user
    .findByIdAndUpdate(req.user, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((users) => res.send({ data: users }))
    .catch(next);
};
// -----------------------------------------------------------------------------------
// аутентификация
export const login = (req: Request, res: Response, next: NextFunction) => {
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
    .catch(next);
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
      if (!users) {
        // если такого пользователя нет,
        // сгенерируем исключение
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(users);
    })
    .catch(next);
};
