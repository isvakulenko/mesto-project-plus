import { celebrate, Joi } from 'celebrate';
import { URLCheck } from '../utils/const';

export const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
    avatar: Joi.string().required().pattern(URLCheck).message('Enter a valid URL'),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
export const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
export const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URLCheck).message('Enter a valid URL'),

  }),
});
