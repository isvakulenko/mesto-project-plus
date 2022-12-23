import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import usersRoute from './routes/users';
import cardsRoute from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

const app = express();

dotenv.config();
const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Заголовки безопасности Content-Security-Policy
// можно проставлять автоматически — для этого есть модуль Helmet.
app.use(helmet());

// для собирания JSON-формата
app.use(express.json());
// для приёма веб-страниц внутри POST-запроса
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу MongoDB
mongoose.connect(DB_ADDRESS);

// // временное решение авторизации
// app.use((req: TFakeAuth, res: Response, next: NextFunction) => {
//   req.user = {
//     // вставьте сюда _id созданного в предыдущем пункте пользователя
//     _id: '6398acce83ff12ee373db5e6',
//   };
//   next();
// });
// роуты, не требующие авторизации,
app.post('/signin', login);
app.post('/signup', createUser);
// авторизация
app.use(auth);
// роуты, которым авторизация нужна
app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
