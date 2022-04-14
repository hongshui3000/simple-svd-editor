/** Имена (латинские и русские буквы, тире и пробелы) */
export const regName = /^[ \-a-zа-яё]*$/i;

/** Русские имена (русские буквы, тире и пробелы) */
export const regNameRu = /^[ \-а-яё]*$/i;

/** Английские имена (латинские буквы, тире и пробелы) */
export const regNameEn = /^[ \-a-z]*$/i;

/** Проверка на содержание хотя бы 1 латинской буквы */
export const regOneLetter = /^(?=.*[a-z]).*$/i;

/** Проверка на содержание хотя бы 1 цифры */
export const regOneDigit = /^(?=.*\d).*$/;

/** Телефонный номер (+7(000) 000-00-00) */
export const regPhone = /^\+7\(\d{3}\) \d{3}(?:-\d{2}){2}$/;

/** КПП (0000AA000) */
export const regKpp = /^\d{4}[\dA-Z]{2}\d{3}$/;

export const regEmail = /^(?!.{65})([a-z0-9_\-.+]+)@([a-z0-9]+)((([.]?|[_-]{0,2})[a-z0-9]+)*)\.([a-z]{2,})$/i;

export const regPhoneExtended = /^((\+7)|8)?9\d{9}/;

export const regNumbersWithComma = /^(\s*(\d)+\s*,?)+$/;

export const regNextQueryParam = /\/\[\w+\]/g;
