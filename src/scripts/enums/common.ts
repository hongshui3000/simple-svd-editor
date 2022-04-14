export enum CELL_TYPES {
    PRICE = 'price',
    STATUS = 'status',
    DOUBLE = 'double',
    DATE = 'date',
    DATE_TIME = 'datetime',
    DATE_RANGE = 'dateRange',
    PHOTO = 'photo',
    QUANTITY = 'quantity',
    TIME = 'time',
    INTERVAL = 'interval',
    ARRAY = 'array',
    ARRAY_LINKS = 'arrayLinks',
    LINKED_ID = 'linkedID',
    LINKED_EMAIL = 'linkedEmail',
    LINK = 'link',
    LINK_WITH_TEXT = 'linkWithText',
    DOT = 'dot',
    DRAG = 'drag',
}

export enum BannerButtonLocation {
    TOP_LEFT = 'top_left',
    TOP = 'top',
    TOP_RIGHT = 'top_right',
    RIGHT = 'right',
    BOTTOM_RIGHT = 'bottom_right',
    BOTTOM = 'bottom',
    BOTTOM_LEFT = 'bottom_left',
    LEFT = 'left',
}

export enum BannerButtonType {
    OUTLINE_BLACK = 'outline_black',
    OUTLINE_WHITE = 'outline_white',
    BLACK = 'black',
    WHITE = 'white',
}

export enum BannerCode {
    WIDGET = 'widget',
    CATALOG_TOP = 'catalog_top',
    CATALOG = 'catalog',
    PRODUCT_GROUP = 'product_group',
    HEADER = 'header',
}

export enum STATUSES {
    CREATED = 'created',
    REGULAR = 'regular',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

export enum ActionType {
    Edit = 'edit',
    Add = 'add',
    Close = 'close',
    Delete = 'delete',
}

export enum DeliveryMethods {
    DELIVERY = 1,
    PICKUP,
}

export enum PropertyTypes {
    STRING = 'string',
    INTEGER = 'integer',
    DOUBLE = 'double',
    BOOLEAN = 'boolean',
    DATETIME = 'datetime',
    LINK = 'link',
    DIRECTORY = 'directory',
}

export enum Days {
    MONDAY = 1,
    TUESDAY,
    WEDNESDAY,
    THIRSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY,
}

export const daysValues = {
    [`${Days.MONDAY}`]: 'Понедельник',
    [`${Days.TUESDAY}`]: 'Вторник',
    [`${Days.WEDNESDAY}`]: 'Среда',
    [`${Days.THIRSDAY}`]: 'Четверг',
    [`${Days.FRIDAY}`]: 'Пятница',
    [`${Days.SATURDAY}`]: 'Суббота',
    [`${Days.SUNDAY}`]: 'Воскресенье',
};
