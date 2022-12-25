import { model, Schema } from 'mongoose';
import validator from 'validator';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[] | [];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    // имя карточки:
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String, // Ссылка на картинку
    required: true,
    validate: {
      validator(value: string) {
        return validator.isURL(value);
      },
      message: 'Enter a valid URL', // выводится в случае false
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// TS-интерфейс модели Card
export default model<ICard>('card', cardSchema);
