import { Request, Response } from 'express';

type TError = Error & {
  statusCode?: number;
}
const errorsHandler = (
  err: TError,
  req: Request,
  res: Response,
) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};
export default errorsHandler;
