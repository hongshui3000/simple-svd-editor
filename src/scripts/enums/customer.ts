export enum CustomerStatus {
    CREATED = 1,
    NEW,
    ON_CHECK,
    REJECTED,
    ACTIVE,
    PROBLEMATIC,
    BLOCKED,
    POTENCIAl_REFERAL_PARTNER,
    TEMPORARY_SUSPENDED,
}

export const customerStatusValues = {
    [`${CustomerStatus.CREATED}`]: 'Создан',
    [`${CustomerStatus.NEW}`]: 'Новый (заполнены телефон и портфолио)',
    [`${CustomerStatus.ON_CHECK}`]: 'На проверке',
    [`${CustomerStatus.REJECTED}`]: 'Отклонен',
    [`${CustomerStatus.ACTIVE}`]: 'Активный',
    [`${CustomerStatus.PROBLEMATIC}`]: 'Проблемный',
    [`${CustomerStatus.BLOCKED}`]: 'Заблокирован',
    [`${CustomerStatus.POTENCIAl_REFERAL_PARTNER}`]: 'Потенциальный реферальный партнер',
    [`${CustomerStatus.TEMPORARY_SUSPENDED}`]: 'Временно приостановлен',
};

export enum CustomerGender {
    FEMALE = 1,
    MALE,
}

export const customerGenderValues = {
    [`${CustomerGender.FEMALE}`]: 'Женщина',
    [`${CustomerGender.MALE}`]: 'Мужчина',
};
