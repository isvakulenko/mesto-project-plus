export const NO_VALID_DATA_ERROR = 400;
export const NOT_FOUND_ERROR = 404;
export const DEFAULT_ERROR = 500;

// Для проверки коррректности введенного URL для аватара
// https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
export const URLCheck: RegExp = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
// Для проверки коррректности введенного EMail
// https://regex101.com/r/mX1xW0/1
export const EMailCheck: RegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;