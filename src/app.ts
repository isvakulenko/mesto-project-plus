import express from 'express';
import mongoose from 'mongoose';
import usersRoute from './routes/users';

const { PORT = 3000} = process.env;

const app = express();

// для собирания JSON-формата
app.use(express.json());
// для приёма веб-страниц внутри POST-запроса
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу MongoDB
 mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', usersRoute);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});

