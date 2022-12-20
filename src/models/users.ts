import { model, Schema } from 'mongoose';
import { URLCheck } from '../utils/const';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // имя — обязательное поле
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String, // информация о пользователе
    required: true,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value: string) {
        // Метод RegExp.test
        return URLCheck.test(value);
      },
      message: 'Неправильный формат  URL', // выводится в случае false
    },
  },
});

// TS-интерфейс модели User
export default model<IUser>('user', userSchema);
