import { Request } from 'express';

// временное решение авторизации
export type TFakeAuth = Request & {
  user?: {
    _id: string;
  };
};
