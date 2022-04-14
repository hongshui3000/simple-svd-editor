import { prepareForSelect } from '@scripts/helpers';

export const STATUSES = ['В продаже', 'Предзаказ', 'Снято с продажи', 'Доступен к продаже', 'Недоступен к продаже'];

export const RATING = ['1', '2', '3', '4', '5'];

export const SELLER_STATUSES = ['Активен', 'Действует', 'Приостановлен', 'Отключен'];

export const ACTIVE_STATUSES = [ 'Не активен','Активен' ];

export enum USER_STATUSES {
    ACTIVE = 'Активен',
    NO_ACTIVE = 'Не активен',
} ;

export const SELLER_COMMISSION_TYPES = ['За бренд', 'За категорию', 'За товар'];

export const SELLERS = ['Ашан', 'Пятерочка', 'Леруа', 'Все'];

export const PLACES_OF_COMMUNICATION = [
    'LiveTex. Viber',
    'LiveTex. Telegram',
    'LiveTex. Messenger FB',
    'LiveTex. VK',
    'E-mail',
];

export const TOPIC = ['Доставка', 'Промокод'];

export const DELIVERY_STATUSES = [
    'Предзаказ: ожидаем поступления товара',
    'Оформлено',
    'Ожидает проверки АОЗ',
    'Проверка АОЗ',
    'Ожидает подтверждения Продавцом',
    'На комплектации',
    'Готово к отгрузке',
    'Передано Логистическому Оператору',
    'Принято логистическим оператором',
    'Прибыло в город назначения',
    'Принято в пункте назначения',
    'Находится в Пункте Выдачи',
    'Выдано курьеру для доставки',
    'Доставлено получателю',
    'Ожидается отмена',
    'Ожидается возврат от клиента',
    'Возвращено',
];

export const DELIVERY_TYPE = ['Несколькими доставками', 'Одной доставкой'];
export const DELIVERY_METHOD = ['Доставка', 'Самовывоз'];

export const PROMO_STATUSES = [
    'Создана',
    'Отправлена на согласование',
    'На согласовании',
    'Активна',
    'Отклонена',
    'Приостановлена',
    'Завершена',
];

export const PROMO_TYPES = ['Скидка', 'Бесплатная доставка', 'Подарок', 'Бонус'];
export const DELIVERY_SERVICE_STATUSES = ['Активен', 'Приостановлен', 'Недействующий'];

export const CHANNELS = [
    'Внутренний коммуникационный модуль',
    'Infinity',
    'SMS-центр',
    'LiveTex. Viber',
    'LiveTex. Telegram',
    'LiveTex. Messenger FB',
    'LiveTex. VK',
    'E-mail',
];

export const CHANNELS_FOR_SELECT = prepareForSelect(CHANNELS);
