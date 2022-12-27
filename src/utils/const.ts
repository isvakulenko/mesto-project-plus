// Для проверки коррректности введенного URL для аватара
// https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
// eslint-disable-next-line no-useless-escape
export const URLCheck: RegExp = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
// Для проверки коррректности введенного EMail
// https://regex101.com/r/mX1xW0/1
export const EMailCheck: RegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
