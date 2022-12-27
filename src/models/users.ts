/* eslint-disable no-unused-vars */
import {
  model, Schema, Document, Model,
} from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import UnauthorizedError from '../errors/unauthorized-error';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    minlength: 2, // Custom Error Messages?
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String, // информация о пользователе
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(value: string) {
        return validator.isURL(value);
      },
      message: 'Enter a valid URL', // выводится в случае false
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value: string) {
        return validator.isEmail(value);
      },
      message: 'Enter a valid e-mail', // выводится в случае false
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

// Собственные методы моделей Mongoose.
// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(this: any, email: string, password: string) {
    // Чтобы найти пользователя по почте, нам потребуется метод findOne, которому передадим на вход
    // email. Метод findOne принадлежит модели User, поэтому обратимся к нему через ключевое
    // слово this:
    return this.findOne({ email })
      .select('+password') // this — это модель user. В случае аутентификации хеш пароля нужен
      .then((user: { password: string }) => {
        // не нашёлся — отклоняем промис
        if (!user) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }
        // нашёлся — сравниваем хеши
        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(
              new UnauthorizedError('Неправильные почта или пароль'),
            );
          }
          return user; // теперь user доступен
        });
      });
  },
);

// TS-интерфейс модели User
export default model<IUser, UserModel>('user', userSchema);
