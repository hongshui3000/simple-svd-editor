import { customAlphabet } from 'nanoid';

import {
    STATUSES,
    SELLER_STATUSES,
    DELIVERY_STATUSES,
    DELIVERY_TYPE,
    DELIVERY_METHOD,
    PROMO_STATUSES,
    PROMO_TYPES,
    DELIVERY_SERVICE_STATUSES,
    ACTIVE_STATUSES,
} from '@scripts/data/different';

import { getSelectColumn, getSettingsColumn, Cell, ExtendedColumn } from '@components/Table';

const nanoid = customAlphabet('1234567890', 4);
export const getNubmerId = nanoid;

const mock = async <T,>({
    time = 500,
    data,
}: {
    time?: number;
    data?: T;
} = {}) => {
    await new Promise(resolve => setTimeout(resolve, time));
    return { data };
};

export default mock;

export const columnsForTable: ExtendedColumn[] = [
    getSelectColumn(),
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: '',
        accessor: 'photo',
        Cell: props => <Cell type="photo" {...props} />,
        disableSortBy: true,
    },
    {
        Header: 'Название, артикул',
        accessor: 'titleAndCode',
        Cell: ({ value }: { value: string[] }) =>
            value.map(item => (
                <p css={{ color: 'lightgrey' }} key={item}>
                    {item}
                </p>
            )),
    },
    {
        Header: 'Бренд',
        accessor: 'brand',
    },
    {
        Header: 'Категория',
        accessor: 'category',
    },
    {
        Header: 'Создано',
        accessor: 'created',
        Cell: ({ value }) => <Cell type="datetime" value={value} />,
    },
    {
        Header: 'Цена, ₽',
        accessor: 'price',
    },
    {
        Header: 'Кол-во',
        accessor: 'count',
    },
    {
        Header: 'Статус',
        accessor: 'status',
    },
    {
        Header: 'В архиве',
        accessor: 'archive',
    },
    getSettingsColumn(),
];

export const mockCategories = [
    'Резинки для волос',
    'Стайлеры',
    'Ножницы',
    'Шампуни',
    'Мебель',
    'Профессиональные шампуни',
    'Восстанавливающие шампуни',
];

export const mockNames = [
    'Суханов Аким Витальевич',
    'Никонов Глеб Ростиславович',
    'Данилов Яков Евгеньевич',
    'Киселёв Авраам Наумович',
    'Шубин Корней Николаевич',
    'Соболев Соломон Федосеевич',
    'Пономарёва Таисия Юлиановна',
    'Лобанова Борислава Еремеевна',
    'Котова Фаина Якововна',
];

export const mockPhones = [
    '+7(922) 761-26-25',
    '+7(932) 123-51-14',
    '+7(915) 523-32-11',
    '+7(977) 125-55-86',
    '+7(930) 111-12-35',
    '+7(911) 333-52-22',
];

export const mockEmails = [
    'zegonnuda-9566@mail.ru',
    'ocapanna-0037@yandex.com',
    'xaverremmyd-8390@yopmail.com',
    'nipunemmod-1761@yopmail.com',
    'uttytoba-4064@gmail.ru',
];

export const mockAddresses = [
    '124482, г Москва, г Зеленоград, р-н Савелки, к 305',
    '141580, Московская обл, г Солнечногорск, поселок Лунёво, ул Гаражная, д 8',
];

export const mockLocations = ['Сходня', 'Лунево', 'Зеленоград', 'Москва'];

export const mockDeliveryCompanies = ['B2Cpl', 'Boxberry', 'СДЭК'];

export const mockPosts = ['Администратор', 'Оператор'];

export const mockPromoServices = [
    'Товар',
    'Бренд товара',
    'Категорию товара',
    'Доставку',
    'Сумму корзины',
    'Все товары',
    'Все бандлы',
    'Мастер-класс',
];

export const mockSearchResultItems = [
    {
        label: 'Крупа ячменная',
        value: 'krupa-1',
    },
    {
        label: 'Крупа пшеничная',
        value: 'krupa-2',
    },
    {
        label: 'Крупа обычная',
        value: 'krupa-3',
    },
    {
        label: 'Крупа необычная',
        value: 'krupa-4',
    },
];

export const mockSearchAddressItems = [
    {
        name: 'г Зеленоград',
    },
    {
        name: 'поселок Алабушево',
    },
    {
        name: 'деревня Радумля',
    },
    {
        name: 'поселок Лунёво',
    },
    {
        name: 'село Мелехово',
    },
];

export const columns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: '',
        accessor: 'photo',
        getProps: () => ({ type: 'photo' }),
    },
    {
        Header: 'Название, артикул',
        accessor: 'titleAndCode',
        getProps: () => ({ type: 'double' }),
    },
    {
        Header: 'Бренд',
        accessor: 'brand',
    },
    {
        Header: 'Категория',
        accessor: 'category',
    },
    {
        Header: 'Создано',
        accessor: 'created',
        getProps: () => ({ type: 'date' }),
    },
    {
        Header: 'Цена, ₽',
        accessor: 'price',
        getProps: () => ({ type: 'price' }),
    },
    {
        Header: 'Кол-во',
        accessor: 'count',
    },
    {
        Header: 'Статус',
        accessor: 'status',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'В архиве',
        accessor: 'archive',
        getProps: () => ({ type: 'status' }),
    },
];

export const sellers = ['ООО "Рога и копыта"', 'Ашан', 'Леруа Мерлен', 'Б.Ю. Александров', 'М.П. Почтомат'];
export const discountsStatuses = [
    'Создана',
    'Отправлена на согласование',
    'На согласовании',
    'Активна',
    'Отклонена',
    'Приостановлена',
    'Завершена',
];
export const discountsProducts = ['Товар', 'Бренд товара', 'Категорию товара', 'Доставку', 'Отклонена', 'Все товары'];
export const discountsRoles = ['Все', 'Профессионал', 'Реферальный партнер'];
export const discountsInitiators = ['Маркетплейс', 'Stylers'];
export const discountsCreators = ['User1', 'User2', 'N/A'];
export const brands = ['letual', 'brand', 'addidas'];
export const categories = ['Ножницы', 'Мебель', 'Резинки для волос'];

const randomDates = ['19.01.2021', '13.10.2020', '05.02.2020', '25.12.2016', '04.07.2018'];
export const deliveryMethods = ['Курьерская доставка', 'Самовывоз'];
export const paymentMethods = ['Онлайн'];
export const segments = ['A', 'B', 'C'];
export const regionsArray = ['Моcковская область', 'Белгородская область', 'Брянская область'];
export const deliveryServices = [
    'Boxberry',
    'Dostavista',
    'DPD',
    'IML',
    'MaxiPost',
    'PickPoint',
    'PONY EXPRESS',
    'B2Cpl',
    'Почта России',
    'СДЭК',
];
export const authors = ['Резинкин Петр Петрович', 'Столяров Иван Иванович', null];
export const warehouses = ['Силино', 'Алабушево', 'Лунево', 'Андреевка'];
export const cargoStatuses = [
    'Создан',
    'Передан Логистическому Оператору',
    'Принят Логистическим Оператором',
    'Отменён',
];

export const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const newTableItem = () => ({
    id: nanoid(),
    photo: getRandomItem([
        'https://spoonacular.com/cdn/ingredients_100x100/apple.jpg',
        '',
        'https://spoonacular.com/cdn/ingredients_100x100/orange.jpg',
    ]),
    titleAndCode: getRandomItem([
        ['Бургер из свинины и говядины «ПРОМАГРО», охлажденный, 200 г', 4650096570695],
        ['Бургер из свинины и говядины', 4650096570695],
    ]),
    brand: getRandomItem(['ПРОМАГРО', 'Мираторг']),
    category: 'Полуфабрикаты мясные, фарш',
    created: new Date(),
    price: 1000.99,
    count: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
    status: 'Согласовано',
    archive: getRandomItem(['Да', 'Нет']),
});

const offersTableItem = (id: number) => ({
    id: `100${id}`,
    title: getRandomItem([
        'Резинка для волос женская и детская, прочная и долговечная (браслет пружинка), набор из 3 шт.',
        'Стайлер для волос IKOO E-styler Pro White Platina',
        'Декоративная игрушка',
        'Подушка',
        'Карандаш',
        'Бутылка',
        'Мячик',
        'Шарик',
        'Ноутбук',
    ]),
    seller: getRandomItem(sellers),
    status: getRandomItem(STATUSES),
    price: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
    residue: getRandomItem([100, 25, 13, 512, 2000, 2000]),
    created: new Date(),
});

const sellersTableItem = (id: number) => ({
    id: `100${id}`,
    date: new Date(),
    title: [
        getRandomItem(['ООО "Вектор Плсюс"', 'ООО "Анабель"', 'Ашан', 'Пятерочка', 'Перекресток']),
        '/seller/detail/12/',
    ],
    fullName: getRandomItem(mockNames),
    email: getRandomItem(mockEmails),
    phone: getRandomItem(mockPhones),
    rating: getRandomItem(['1', '2', '3', '4', '5']),
    status: getRandomItem(SELLER_STATUSES),
});

const storesTableItem = (id: number) => ({
    id: `100${id}`,
    title: getRandomItem([
        ['Силино', `/stores/seller-stores/100${id}`],
        ['Андреевка', `/stores/seller-stores/100${id}`],
        ['Лунево', `/stores/seller-stores/100${id}`],
        ['Алабушево', `/stores/seller-stores/100${id}`],
        ['Сходня', `/stores/seller-stores/100${id}`],
        ['Второй склад', `/stores/seller-stores/100${id}`],
        ['Главный склад', `/stores/seller-stores/100${id}`],
        ['Мелехово', `/stores/seller-stores/100${id}`],
        ['Голубое', `/stores/seller-stores/100${id}`],
    ]),
    seller: getRandomItem(sellers),
    city: getRandomItem(['г Зеленоград', 'поселок Алабушево', 'деревня Радумля', 'поселок Лунёво', 'село Мелехово']),
});

export const timeIntervals = ['12:00-15:00', '15:00-18:00', '18:00-21:00', '09:00-12:00'];

const regions = [
    {
        name: 'Центральный федеральный округ',
        sub: ['Москва', 'Белгородская область', 'Брянская область', 'Владимирская область', 'Воронежская область'],
    },
    {
        name: 'Приволжский федеральный округ',
        sub: ['Республика Башкортостан', 'Республика Марий Эл', 'Республика Мордовия', 'Республика Татарстан'],
    },
    {
        name: 'Северо-Западный федеральный округ',
        sub: [
            'Город федерального значения Санкт-Петербург',
            'Республика Карелия',
            'Республика Коми',
            'Архангельская область',
        ],
    },
    {
        name: 'Уральский федеральный округ',
        sub: [
            'Курганская область',
            'Свердловская область',
            'Тюменская область',
            'Челябинская область',
            'Ханты-Мансийский автономный округ — Югра',
        ],
    },
];

export const makeDeliveryPricesData = () =>
    regions.map((el, i) => ({
        id: `1${i}`,
        operator: el.name,
        pickupPrice: getRandomItem([0, 150, 300]),
        deliveryPrice: getRandomItem([100, 200, 300, 400]),
        subRows: el.sub.map(el => ({
            id: `2${Math.floor(Math.random() * 1000)}`,
            operator: el,
            pickupPrice: getRandomItem([0, 150, 300]),
            deliveryPrice: getRandomItem([100, 200, 300, 400]),
        })),
    }));

export const makeNestedData = (...lens: number[]) => {
    const range = (len: number) => {
        const arr = [];
        for (let i = 0; i < len; i += 1) {
            arr.push(i);
        }
        return arr;
    };
    const makeDataLevel = (depth = 0): any => {
        const len = lens[depth];
        return range(len).map(() => ({
            ...newTableItem(),
            subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
        }));
    };

    return makeDataLevel();
};

export const menuTable = [
    {
        id: 1,
        code: 'header_main',
        title: ['Главное меню в шапке', '/content/menu/1'],
    },
    {
        id: 2,
        code: 'header_help',
        title: ['Меню помощи в шапке', '/content/menu/2'],
    },
    {
        id: 3,
        code: 'footer_main',
        title: ['Главное меню в подвале', '/content/menu/3'],
    },
];

export const menuItems = [
    {
        name: 'Доставка и оплата',
        link: '/delivery',
        subItems: [
            { name: 'Самовывоз', link: '/pickup' },
            { name: 'Экспресс-доставка', link: '/express' },
            { name: 'Способы оплаты', link: '/payment' },
        ],
        hidden: true,
    },
    {
        name: 'Возврат товара',
        link: '/return',
        subItems: [],
        hidden: true,
    },
    {
        name: 'Гарантии',
        link: '/guarantees',
        subItems: [],
        hidden: true,
    },
    {
        name: 'Кредит',
        link: '/credit',
        subItems: [],
        hidden: false,
    },
];

const newTablePrice = (id: number) => ({
    id: `100${id}`,
    author: getRandomItem(authors),
    seller: getRandomItem(sellers),
    status: getRandomItem(STATUSES),
    productsCount: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
    created: new Date(),
});

const newTablePriceChange = (id: number) => {
    const numbers = [15, 32, 64, 71, 86, 43, 25, 13];
    const prices = [199838, 9838, 2999, 3990];
    return {
        id: `100${id}`,
        productId: getRandomItem(numbers),
        name: getRandomItem([
            'Бургер из свинины и говядины «ПРОМАГРО», охлажденный, 200 г',
            'Бургер из свинины и говядины',
        ]),
        productArticle: getRandomItem(['ik0011', 'ik0012']),
        oldPrice: getRandomItem(prices),
        newPrice: getRandomItem(prices),
        status: getRandomItem(STATUSES),
        productsCount: getRandomItem(numbers),
        comment: '',
    };
};

export const makePrice = (len: number) => [...Array(len).keys()].map(el => newTablePrice(el));

export const makePriceChange = (len: number) => [...Array(len).keys()].map(el => newTablePriceChange(el));

const deliveryServicesTableItem = (id: number) => ({
    id: `${id}`,
    title: getRandomItem(deliveryServices),
    status: getRandomItem(DELIVERY_SERVICE_STATUSES),
    priority: getRandomItem([1, 2, 3]),
});

const productTableItem = (id: number) => ({
    id: `100${id}`,
    photo: getRandomItem(['https://picsum.photos/300/300', '']),
    title: getRandomItem([
        ['Резинка для волос женская и детская, прочная и долговечная (браслет пружинка), набор из 3 шт.', 25435],
        ['Стайлер для волос IKOO E-styler Pro White Platina', 12344],
        ['Декоративная игрушка', 112233],
        ['Подушка', 11223344],
        ['Карандаш', 12344321],
        ['Бутылка', 43214321],
        ['Мячик', 12344321],
        ['Шарик', 1234],
        ['Ноутбук', 4311234],
    ]),
    brand: getRandomItem(['letual', 'brand', 'addidas']),
    category: getRandomItem(['cat 1', 'cat 2', 'cat 3']),
    price: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
    quantity: getRandomItem([100, 25, 13, 512, 2000, 2000]),
    date: getRandomItem([new Date(), new Date('2021/02/23')]),
    active: getRandomItem(['да', 'нет', '---']),
    agreed: getRandomItem(['согласовано', 'не согласовано', 'в процессе']),
    archive: getRandomItem(['да', 'нет', '---']),
    content: getRandomItem(['cъмка одобрена', 'на согласовнии', 'на съемках']),
    shoppilot: getRandomItem(['да', 'нет', 'нет информации']),
});

const discountsTableItem = (id: number) => ({
    id: `100${id}`,
    createDate: new Date(),
    name: getRandomItem(['1+1=3', 'Скидка 1+1=3', 'Скидка на стайлеры', 'Резинка и стайлер']),
    discount: getRandomItem(discountsProducts),
    activePeriod: `с ${getRandomItem(randomDates)} по ${getRandomItem(randomDates)}`,
    initiator: getRandomItem(discountsInitiators),
    creator: getRandomItem(discountsCreators),
    status: getRandomItem(discountsStatuses),
});

const sellerTeamTableItem = (id: number) => {
    const email = getRandomItem(mockEmails);
    const post = getRandomItem(mockPosts);
    return {
        number: `10${id}`,
        id: `100${id}`,
        name: getRandomItem(mockNames),
        post,
        email,
        phone: getRandomItem(mockPhones),
        communication: 'email',
        role: post,
        status: getRandomItem(ACTIVE_STATUSES),
        login: email,
    };
};

const sellerProductsTableItem = (id: number) => ({
    id: `100${id}`,
    title: getRandomItem([
        'Резинка для волос женская и детская, прочная и долговечная (браслет пружинка), набор из 3 шт.',
        'Стайлер для волос IKOO E-styler Pro White Platina',
        'Декоративная игрушка',
        'Подушка',
        'Карандаш',
        'Бутылка',
        'Мячик',
        'Шарик',
        'Ноутбук',
    ]),
    status: getRandomItem(STATUSES),
    price: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
    quantity: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
    date: new Date(),
});

const sellerOffersTableItem = (id: number) => {
    const date = new Date();
    return {
        orderNumber: `100${id}`,
        departureNumber: `200${id}`,
        name: getRandomItem(mockNames.map(item => [item, `id: 23${id}`])),
        status: getRandomItem(DELIVERY_STATUSES),
        quantity: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
        weight: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
        sum: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
        deliveryType: getRandomItem(DELIVERY_TYPE),
        deliveryMethod: getRandomItem(DELIVERY_METHOD),
        deliveryCompanyLast: getRandomItem(mockDeliveryCompanies),
        deliveryComplanyZero: getRandomItem(mockDeliveryCompanies),
        store: getRandomItem(mockLocations),
        address: getRandomItem(mockAddresses),
        shippingDate: date,
        deliveryDate: new Date(date).setMonth(date.getMonth() + 1),
    };
};

const sellerDiscountsTableItem = (id: number) => ({
    id: `100${id}`,
    dateCreation: new Date(),
    title: getRandomItem(['Скидка 1', 'Скидка 2', 'Скидка 3', 'Скидка 4']),
    discount: getRandomItem([15, 20, 5, 12, 10]),
    discountPeriod: getRandomItem([new Date(), new Date('2021/02/23')]),
    initiator: getRandomItem(mockNames),
    author: getRandomItem(mockNames),
    status: getRandomItem(PROMO_STATUSES),
});

const sellerPromoTableItem = (id: number) => ({
    id: `100${id}`,
    dateCreation: new Date(),
    title: getRandomItem(['Скидка 1', 'Скидка 2', 'Скидка 3', 'Скидка 4']),
    type: getRandomItem(PROMO_TYPES),
    discount: getRandomItem([15, 20, 5, 12, 10]),
    promoPeriod: getRandomItem([new Date(), new Date('2021/02/23')]),
    sponsor: getRandomItem(mockNames),
    user: getRandomItem(mockNames),
    partner: getRandomItem(['Да', 'Нет']),
    status: getRandomItem(PROMO_STATUSES),
});

const sellerBillingTableItem = (id: number) => ({
    id: `100${id}`,
    date: new Date(),
    sum: getRandomItem([10, -15, 30, 100, 200, -100, 63]),
    operation: getRandomItem(['Вывод средств', 'Начисление', 'Корректировка']),
});

export const makeSellers = (len: number) => [...Array(len).keys()].map(el => sellersTableItem(el));

/** SellerDetail */
export const makeTeam = (len: number) => [...Array(len).keys()].map(el => sellerTeamTableItem(el));
export const makeSellerProducts = (len: number) => [...Array(len).keys()].map(el => sellerProductsTableItem(el));
export const makeSellerOffers = (len: number) => [...Array(len).keys()].map(el => sellerOffersTableItem(el));
export const makeSellerDiscount = (len: number) => [...Array(len).keys()].map(el => sellerDiscountsTableItem(el));
export const makeSellerPromo = (len: number) => [...Array(len).keys()].map(el => sellerPromoTableItem(el));
export const makeSellerBilling = (len: number) => [...Array(len).keys()].map(el => sellerBillingTableItem(el));

const costumersTableItem = (id: number) => ({
    id: `100${id}`,
    date: new Date(),
    name: getRandomItem(['Резинкин Петр Петрович', 'Овчинников Стефан Борисович']),
    phone: getRandomItem(['+79263414052', '+79035299909', '+72604760062']),
    email: getRandomItem(['nomadirl@gmail.com', 'super-admin@greensight.ru']),
});

const cargosTableItem = (id: number) => ({
    id: `100${id}`,
    seller: getRandomItem(sellers),
    created: new Date(),
    delivery: getRandomItem(deliveryServices),
    warehouse: getRandomItem(warehouses),
    status: getRandomItem(cargoStatuses),
    boxes: getRandomItem([15, 32, 64, 71, 86, 43, 25, 13]),
    quantity: Math.floor(Math.random() * 10) + 1,
    comment: getRandomItem(['Комментарий', '']),
    price: Math.floor(Math.random() * 10000) + 1.1,
    discount: Math.floor(Math.random() * 100) + 1.05,
    weigth: Math.floor(Math.random() * 1000) + 1,
    pickupNumber: Math.floor(Math.random() * 1000) + 1,
});

export function makeRandomData<T>(len: number, cb: (index: number) => T) {
    return [...Array(len).keys()].map(el => cb(el));
}

export const makeOffers = (len: number) => makeRandomData<ReturnType<typeof offersTableItem>>(len, offersTableItem);
export const makeProducts = (len: number) => makeRandomData<ReturnType<typeof productTableItem>>(len, productTableItem);
export const makeCargos = (len: number) => makeRandomData<ReturnType<typeof cargosTableItem>>(len, cargosTableItem);
export const makeData = (len: number) => makeRandomData<ReturnType<typeof newTableItem>>(len, newTableItem);

export const makeDeliveryServices = (len: number) =>
    makeRandomData<ReturnType<typeof deliveryServicesTableItem>>(len, deliveryServicesTableItem);

export const cargoItemHistory = (id: number) => ({
    id: `100${id}`,
    essense: `(ID: ${id})`,
    date: new Date(),
    action: getRandomItem(['Добавление связи одной сущности к другой', 'Обновление сущности', 'Создание сущности']),
    user: getRandomItem(['Система', 'super-admin@greensight.ru (ID: 1)']),
});

export const makeCargosHistory = (len: number) => [...Array(len).keys()].map(el => cargoItemHistory(el));

export const cargoItemHistoryComposition = (id: number) => ({
    id: `100${id}`,
    departure: getRandomItem(['1000007-1000007-1-02', '1000007-1000007-1-01', '1000007-1000007-1-03']),
    boxQuantity: Math.floor(Math.random() * 10) + 1,
    dateFrom: new Date(),
    dateTo: new Date(),
    summary: Math.floor(Math.random() * 10000) + 1.1,
});

export const customerOrdersTableItem = (id: number) => ({
    id: `100${id}`,
    registrationDate: new Date(),
    sum: '213',
    paid: getRandomItem([true, false]),
    paymentMethod: 'Онлайн',
    deliveryMethod: getRandomItem(['Самовывоз', 'Курьерская доставка']),
    deliveryCost: '123',
    deliveryType: 'Несколькими доставками',
    deliveryQty: getRandomItem([1, 2, 3, 4, 5]),
    deliveryService: 'B2Cpl',
    status: getRandomItem(['В обработке', 'Оформлен']),
    deliveryDate: new Date(),
    comment: 'Здесь должен быть комментарий',
    changeDate: new Date(),
});

export const communicationThemeTableItem = (id: number) => ({
    theme: getRandomItem(['Контент', 'АОЗ', 'Заявка']),
    user: ['Овчинников С.Б', '/'],
    channel: 'Внутренний коммуникационный модуль',
    communicationId: `10${id}`,
    dateMessage: new Date(),
    status: 'Открыта. Внутренний',
});

export const makeCargosComposition = (len: number) => [...Array(len).keys()].map(el => cargoItemHistoryComposition(el));
export const makeCostumers = (len: number) => [...Array(len).keys()].map(el => costumersTableItem(el));

export const makeCustomerOrders = (len: number) => [...Array(len).keys()].map(el => customerOrdersTableItem(el));

export const makeCommunicationTheme = (len: number) =>
    [...Array(len).keys()].map(el => communicationThemeTableItem(el));

export const makeStores = (len: number) => [...Array(len).keys()].map(el => storesTableItem(el));

const users = (id: number) => ({
    id: `100${id}`,
    system: getRandomItem(['Админка', 'MAS', 'Витрина']),
    login: [
        getRandomItem(['chirva.mikhail@mail.ru', 'super-admin@gmail.com', 'test@gmail.com', 'blablabla@gmail.com']),
        `users/100${id}`,
    ],
    emailStatus: getRandomItem(['да', 'нет']),
    created: new Date(),
});

export const makeDiscounts = (len: number) => [...Array(len).keys()].map(el => discountsTableItem(el));
export const makeUsers = (len: number) => [...Array(len).keys()].map(el => users(el));

export const chatsUnread = [
    {
        id: 1,
        unread: false,
        theme: 'АОЗ',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 503,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
    {
        id: 2,
        unread: true,
        theme: 'АОЗ',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 502,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
    {
        id: 3,
        unread: true,
        theme: 'Маркетинговые инструменты',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 500,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
    {
        id: 4,
        unread: true,
        theme: 'АОЗ',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 499,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
    {
        id: 5,
        unread: true,
        theme: 'Контент',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 480,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
    {
        id: 6,
        unread: true,
        theme: 'Заявка',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 475,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
    {
        id: 7,
        unread: true,
        theme: 'АОЗ',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 460,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
    {
        id: 8,
        unread: true,
        theme: 'АОЗ',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 459,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
    {
        id: 9,
        unread: true,
        theme: 'АОЗ',
        user: 'Овчинников С.Б.',
        channel: 'Внутренний коммуникационный модуль',
        chatId: 453,
        lastMsgData: '2021-01-29T12:36:13.000000Z',
        fullMsgData: '2021-01-29T12:36:13.000000Z',
        status: 'Открыта. Внутренний',
        type: null,
    },
];

export const PROMOUSERS = ['Резинкин Петр Петрович', '	Овчинников Стефан Борисович', 'Иванов Иван Иванович'];
export const PROMOTYPES = ['Скидка', 'Бесплатная доставка'];
export const PROMOCODESTATUSES = [
    'Создан',
    'Отправлен на согласование',
    'На согласовании',
    'Активен',
    'Отклонен',
    'Приостановлен',
    'Завершен',
    'Тестовый',
];
const promodates = ['19.01.2021', '13.10.2020', '05.02.2020', '25.12.2016', '04.07.2018'];
const promocodesTableItem = (id: number) => ({
    id: `100${id}`,
    createDate: getRandomItem(promodates),
    name: getRandomItem(['Бесплатная доставка', 'Скидка 10%', 'Скидка 20%', 'Подарок']),
    code: getRandomItem(['ZPNZXK39OZ', '3QPBAWV32S', 'Q5PBCWVA8X']),
    type: getRandomItem(PROMOTYPES),
    activePeriod: `с ${getRandomItem(promodates)} по ${getRandomItem(promodates)}`,
    sponsor: getRandomItem(sellers),
    user: getRandomItem(PROMOUSERS),
    status: getRandomItem(PROMOCODESTATUSES),
});
export const makePromocodes = (len: number) => [...Array(len).keys()].map(el => promocodesTableItem(el));
