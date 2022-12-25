import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import usersRoute from './routes/users';
import cardsRoute from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateUserBody, validateAuthentication } from './middlewares/validators';
import errorsHandler from './middlewares/errors-handler';

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

// подключаем логер запросов
app.use(requestLogger);

app.post('/signin', validateAuthentication, login);
app.post('/signup', validateUserBody, createUser);
// авторизация
app.use(auth);
// роуты, которым авторизация нужна
app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

// подключаем логер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
