export enum PromoCodeType {
    DISCOUNT = 1,
    FREE_DELIVERY,
}

export const PromoCodeTypeValue = {
    [PromoCodeType.DISCOUNT]: 'Скидка',
    [PromoCodeType.FREE_DELIVERY]: 'Бесплатная доставка',
};

export enum PromoCodeStatus {
    CREATED = 1,
    SENT_FOR_APPROVAL,
    ON_APPROVAL,
    ACTIVE,
    REJECTED,
    SUSPENDED,
    COMPLETED,
    TEST,
}

export const PromoCodeStatusValues = {
    [PromoCodeStatus.CREATED]: 'Cоздана',
    [PromoCodeStatus.SENT_FOR_APPROVAL]: 'Отправлена на согласование',
    [PromoCodeStatus.ON_APPROVAL]: 'На согласовании',
    [PromoCodeStatus.ACTIVE]: 'Активна',
    [PromoCodeStatus.REJECTED]: 'Отклонена',
    [PromoCodeStatus.SUSPENDED]: 'Приостановлена',
    [PromoCodeStatus.COMPLETED]: 'Завершена',
    [PromoCodeStatus.TEST]: 'Тестовый',
};
