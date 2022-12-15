import { Request, Response } from "express";
// импортируем модель
import user from "../models/users";
import { TFakeAuth } from "../utils/types";
//возвращает всех пользователей
export const getUsers = (req: Request, res: Response) => {
  user
    .find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
//возвращает пользователя по _id
export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;
  console.log(id);
  user
    .findById(id)
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: "Такого пользователя нет" })
    );
};

//создаёт пользователя
export const createUser = (req: Request, res: Response) => {
  // вытащили нужные поля из POST-запроса
  const { name, about, avatar } = req.body;
  // передали их объектом в create метод модели
  user
    .create({ name, about, avatar })
    // в случае успеха в user лежит новосозданный в БД объект
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(400).send(err));
};

//обновляет профиль
export const editProfile = (req: TFakeAuth, res: Response) => {
  // вытащили нужные поля из PATCH-запроса
  const { name, about } = req.body;
  // передали их объектом в метод модели
  user
    .findByIdAndUpdate(req.user?._id, { name: name, about: about })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

//обновляет аватар
export const editAvatar = (req: TFakeAuth, res: Response) => {
  // вытащили нужные поля из PATCH-запроса
  const { avatar } = req.body;
  // передали их объектом в метод модели
  user
    .findByIdAndUpdate(req.user?._id, { avatar: avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

