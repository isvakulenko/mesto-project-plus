import { Request, Response } from "express";
import { ObjectId } from "mongoose";
// импортируем модель
import card from "../models/cards";
import { TFakeAuth } from "../utils/types";

//создаёт карточку
export const createCard = (req: TFakeAuth, res: Response) => {
  console.log(req.user?._id); // _id станет доступен
  // вытащили нужные поля из POST-запроса
  const { name, link, owner } = req.body;
  // передали их объектом в create метод модели
  card
    .create({ name, link, owner: req.user?._id })
    // в случае успеха в card лежит новосозданный в БД объект
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => res.status(400).send(err));
};

//возвращает все карточки
export const getCards = (req: Request, res: Response) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

//удаляет карточку по идентификатору
export const deleteCardById = (req: Request, res: Response) => {
  const id = req.params.cardId;
  card
    .findByIdAndRemove(id)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

// //поставить карточке like
export const likeCard = (req: TFakeAuth, res: Response) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .then((card) => res.status(201).send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
//убрать лайк с карточки
export const dislikeCard = (req: TFakeAuth, res: Response) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      // убрать _id из массива // ObjectId  чтобы убрать конфликт типов
      { $pull: { likes: req.user?._id as unknown as ObjectId } },
      { new: true }
    )
    .then((card) => res.status(201).send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
