import { Request, Response } from 'express';
// импортируем модель
import user from '../models/users';

//возвращает всех пользователей
export const getUsers = (req: Request, res: Response) => {
  return user.find({})
     .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}
//возвращает пользователя по _id
export const getUserById = (req: Request, res: Response) => {
const id = req.params.userId;
user.findById(req.params.userId)
.then(user => res.send({ data: user }))
.catch(err => res.status(500).send({ message: 'Такого пользователя нет' }));
};

//создаёт пользователя
export const createUser = (req: Request, res: Response) => {
 // вытащили нужные поля из POST-запроса
  const { name, about, avatar } = req.body;
   // передали их объектом в create метод модели
  return user.create({ name, about, avatar })
   // в случае успеха в user лежит новосозданный в БД объект
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(400).send(err));
};

// {
//   "name": "Тестовый пользователь",
//   "about": "Информация о себе",
//   "avatar": "https://i.pravatar.cc/150?img=6"
// }
