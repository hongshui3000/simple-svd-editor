export enum MarketingDiscountCondition {
    MIN_PRICE = 'minPrice',
    BRANDS = 'brands',
    CATEGORIES = 'categories',
    OFFER = 'offer',
    COUNT = 'count',
    DELIVERY_METHODS = 'deliveryMethods',
    PAYMENT_METHODS = 'paymentMethods',
    REGIONS = 'regions',
    ORDER_SEQUENCE_NUMBER = 'orderSequenceNumber',
    CUSTOMER_IDS = 'customerIds',
    SYNERGY = 'synergy',
}

export enum ConditionType {
    FirstOrder = 1,
    CertainSum,
    CertainSumBrand,
    CertainSumCategory,
    ProductCount,
    DeliveryMethod,
    PaymentMethod,
    Region,
    User,
    OrderNumber,
    StacksWithOtherDiscounts,
}

export enum ObjectType {
    Offer = 1,
    Bundle,
    ProductBrand,
    ProductCategory,
    Delivery,
    CartSum,
}
