import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../utils/types';
import UnauthorizedError from '../errors/unauthorized-error';

const { JWT_SECRET = 'some-secret-key' } = process.env;

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  } // записываем пейлоуд в объект запроса
  // его можно использовать в обработчиках.
  req.user = payload;
  next(); // пропускаем запрос дальше
};
