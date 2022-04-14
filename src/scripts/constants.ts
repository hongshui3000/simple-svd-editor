import { declOfNum } from '@scripts/helpers';

export const MAX_AGE_NEVER = 2 ** 31 - 1;

export const MAX_STRING_SIZE = 40;

export const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export const HttpCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const ITEMS_PER_PRODUCTS_PAGE = 40;
export const LIMIT_PAGE = 10;
export const MAX_RETRY_COUNT = 2;
export const TOKEN_TIME_DIFF_SECONDS = 2;
export const STALE_TIME = 60 * 5 * 1000;
export const STALE_TIME_DAY = 1000 * 60 * 60 * 24;
export const MILISECONDS_IN_SECOND = 1000;

export const KOPECKS_IN_ROUBLE = 100;

export const ITEMS_PER_COMMUNICATIONS_CHATS_PAGE = 20;
export const ITEMS_PER_COMMUNICATIONS_STATUSES_PAGE = 20;
export const ITEMS_PER_COMMUNICATIONS_MESSAGES_PAGE = 20;
export const ITEMS_PER_COMMUNICATIONS_THEMES_PAGE = 20;
export const ITEMS_PER_COMMUNICATIONS_TYPES_PAGE = 20;
export const ITEMS_PER_COMMUNICATIONS_NOTIFICATIONS_PAGE = 20;

export const ErrorMessages = {
    REQUIRED: 'Обязательное поле',
    PHONE: 'Проверьте телефонный формат',
    EMAIL: 'Неверный формат электронной почты',
    PASSWORD: 'Пароли должны совпадать',
    SITE: 'Неверный формат ссылки',
    INTEGER: 'Только целые числа',
    GREATER_OR_EQUAL: 'Введите число больше или равное',
    LESS_OR_EQUAL: 'Введите число меньше или равное',
    WRONG_FORMAT: 'Некорретные значения',
    ARRAY: 'Выберите хотя бы одно значение',
    MIN_SYMBOLS: (num: number) => `Минимум ${num} ${declOfNum(num, ['символ', 'символа', 'символов'])}`,
    MIN_ITEMS: (num: number) => `Выберите минимум ${num} ${declOfNum(num, ['значение', 'значения', 'значений'])}`,
    MIN_FILES: (num: number) => `Выберите минимум ${num} ${declOfNum(num, ['файл', 'файла', 'файлов'])}`,
};

export const ModalMessages = {
    SUCCESS_SAVE: 'Данные сохранены',
    SUCCESS_UPDATE: 'Данные обновлены',
    SUCCESS_DELETE: 'Данные удалены',
    ERROR_UPDATE: 'Ошибка',
};

export const FileTypes = {
    IMAGES: ['image/png', 'image/jpg', 'image/jpeg'],
    PDF: ['application/pdf'],
};

export const CREATE_PARAM = 'create';

export const DEFAULT_TIMEZONE = 'Europe/Moscow';
