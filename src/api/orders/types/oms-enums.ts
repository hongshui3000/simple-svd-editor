export enum OrderListItemPaymentStatus {
    NOT_PAID = 1,
    HOLD = 2,
    PAID = 50,
    RETURNED = 51,
    TIMEOUT = 100,
    CANCELED = 101,
}

export enum OrderStatus {
    WAITING = 1,
    NEW = 10,
    CONFIRMED = 20,
    FINISHED = 100,
    CANCELED = 200,
}

export enum OrderListFilterPaymentMethod {
    ONLINE = 1,
    OFFLINE = 2,
}
export enum OrderListItemDeliveryStatus {
    NEW = 10,
    ASSEMBLED = 20,
    TRANSFER = 30,
    READY_TO_PICKUP = 40,
    DONE = 100,
    CANCELED = 200,
}

export enum OrderListItemShipmentStatus {
    NEW = 10,
    IN_WORK = 20,
    ASSEMBLED = 100,
    CANCELED = 200,
}

export enum OrderSources {
    SITE = 1,
    MOBILE,
    ADMIN,
}

export enum RefundStatuses {
    NEW = 1,
    CONFIRMED,
    REJECTED,
    CANCELED,
}
