import { model, Schema } from 'mongoose';
import { URLCheck, EMailCheck } from '../utils/const';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    minlength: 2, //Custom Error Messages?
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String, // информация о пользователе
    maxlength: 200,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    validate: {
      validator(value: string) {
        // Метод RegExp.test
        return URLCheck.test(value);
      },
      message: 'Неправильный формат  URL', // выводится в случае false
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value: string) {
        return EMailCheck.test(value);
      },
      message: 'Неправильный формат E-mail', // выводится в случае false
    },
  },
  password: {
    type: String,
    required: true
  },
});

// TS-интерфейс модели User
export default model<IUser>('user', userSchema);
