import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRoute from './routes/users';
import cardsRoute from './routes/cards';
import { TFakeAuth } from './utils/types';

const { PORT = 3000 } = process.env;

const app = express();

// для собирания JSON-формата
app.use(express.json());
// для приёма веб-страниц внутри POST-запроса
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// временное решение авторизации
app.use((req: TFakeAuth, res: Response, next: NextFunction) => {
  req.user = {
    // вставьте сюда _id созданного в предыдущем пункте пользователя
    _id: '6398acce83ff12ee373db5e6',
  };
  next();
});

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
