import menuIcons from '@scripts/menuIcons';
import { nanoid } from 'nanoid';
import { MenuItemProps } from '@components/Sidebar/types';

const menu: MenuItemProps[] = [
    {
        text: 'Товары',
        Icon: menuIcons.package,
        code: 'products',
        subMenu: [
            {
                text: 'Каталог товаров',
                link: '/products/catalog',
                code: 'productsCatalog',
            },
            {
                text: 'Предложения продавцов',
                link: '/products/offers',
                code: 'productsOffers',
            },
            {
                text: 'Склейки товаров',
                link: '/products/variant-groups',
                code: 'productsVariantGroups',
            },
            {
                text: 'Справочники',
                code: 'productsDirectories',
                subMenu: [
                    { text: 'Бренды', link: '/products/directories/brands', code: 'productsDirectoriesBrands' },
                    { text: 'Страны', link: '/products/directories/countries', code: 'productsDirectoriesCountries' },
                    {
                        text: 'Производители',
                        link: '/products/directories/manufacturers',
                        code: 'productsDirectoriesManufacturers',
                    },
                    {
                        text: 'Типы товаров',
                        link: '/products/directories/product-types',
                        code: 'productsDirectoriesProductTypes',
                    },
                    {
                        text: 'Категории',
                        link: '/products/directories/categories',
                        code: 'productsDirectoriesCategories',
                    },
                    {
                        text: 'Товарные атрибуты',
                        link: '/products/directories/properties',
                        code: 'productsDirectoriesProperties',
                    },
                ],
            },
        ],
    },
    {
        text: 'Заказы',
        Icon: menuIcons.cart,
        code: 'orders',
        subMenu: [
            { text: 'Список  заказов', link: '/orders/list', code: 'ordersList' },
            { text: 'Возвраты', link: '/orders/refunds', code: 'ordersCargos' },
            { text: 'Настройки', link: '/orders/settings', code: 'ordersStatuses' },
            // { text: 'Грузы', link: '/orders/cargos', code: 'ordersCargos', },
            // { text: 'Статусы заказов', link: '/orders/statuses', code: 'ordersStatuses'},
        ],
    },
    {
        text: 'Заявки',
        Icon: menuIcons.trello,
        code: 'requests',
        subMenu: [
            { text: 'Проверка товаров', link: '/requests/check', code: 'requestsCheck' },
            { text: 'Производство  контента', link: '/requests/content', code: 'requestsContent' },
            { text: 'Изменение  цен', link: '/requests/prices', code: 'requestsPrices' },
        ],
    },
    {
        text: 'Контент',
        Icon: menuIcons.image,
        code: 'content',
        subMenu: [
            { text: 'Меню сайта', link: '/content/menu', code: 'contentMenu' },
            // { text: 'Управление страницами', link: '/content/landing', code: 'contentLanding', },
            // { text: 'Управление контактами и соц. сетями', link: '/content/contacts', code: 'contentContacts' },
            // { text: 'Управление категориями', link: '/content/categories', code: 'contentCategories' },
            { text: 'Подборки товаров', link: '/content/product-groups', code: 'contentProductGroups' },
            { text: 'Баннеры', link: '/content/banners', code: 'contentBanners' },
            // { text: 'Товарные шильдики', link: '/content/badges', code: 'contentBadges' },
            // { text: 'Поисковые запросы', link: '/content/search-requests', code: 'contentSearchRequests' },
            // { text: 'Поисковые синонимы', link: '/content/search-synonyms', code: 'contentSearchSynonyms' },
            // { text: 'Популярные бренды', link: '/content/popular-brands', code: 'contentPopularBrands' },
            // { text: 'Популярные товары', link: '/content/popular-products', code: 'contentPopularProducts' },
        ],
    },
    {
        text: 'Логистика',
        Icon: menuIcons.truck,
        code: 'logistic',
        subMenu: [
            { text: 'Логистические операторы', link: '/logistic/delivery-services', code: 'logisticDeliveryServices' },
            { text: 'Стоимость доставки', link: '/logistic/delivery-prices', code: 'logisticDeliveryPrices' },
            { text: 'Планировщик времени статусов', link: '/logistic/kpi', code: 'logisticKpi' },
        ],
    },
    { text: 'Склады', link: '/stores/seller-stores', Icon: menuIcons.package, code: 'storesSellerStores' },
    { text: 'Клиенты', link: '/customers', Icon: menuIcons.users, code: 'customers' },
    {
        text: 'Продавцы',
        Icon: menuIcons.award,
        code: 'seller',
        subMenu: [
            // { text: 'Заявка на регистрацию', link: '/sellers/registration', code: 'sellerListRegistration' },
            { text: 'Список продавцов', link: '/sellers/list', code: 'sellerListActive' },
        ],
    },
    {
        text: 'Маркетинг',
        Icon: menuIcons.birka,
        code: 'marketing',
        subMenu: [
            { text: 'Промокоды', link: '/marketing/promocodes', code: 'marketingPromocodes' },
            { text: 'Скидки', link: '/marketing/discounts', code: 'marketingDiscounts' },
            { text: 'Бандлы', link: '/marketing/bundles', code: 'marketingBundles' },
        ],
    },
    { text: 'Отчеты', link: '/reports', Icon: menuIcons.chart, code: 'reports' },
    {
        text: 'Коммуникации',
        Icon: menuIcons.message,
        code: 'communications',
        subMenu: [
            { text: 'Непрочитанные сообщения', link: '/communications/messages', code: 'communicationsMessages' },
            {
                text: 'Сервисные уведомления',
                link: '/communications/notifications',
                code: 'communicationsNotifications',
            },
            { text: 'Массовая рассылка', link: '/communications/broadcast', code: 'communicationsBroadcast' },
            { text: 'Статусы', link: '/communications/statuses', code: 'communicationsStatuses' },
            { text: 'Темы', link: '/communications/subjects', code: 'communicationsSubjects' },
            { text: 'Типы', link: '/communications/types', code: 'communicationsTypes' },
        ],
    },
    {
        text: 'Настройки',
        Icon: menuIcons.settings,
        code: 'settings',
        subMenu: [{ text: 'Пользователи и права', link: '/settings/users/admin', code: 'settingsUsers' }],
    },
];

const enrichMenu = (menuItems: MenuItemProps[]) => {
    const enrichedMenu = menuItems.slice();
    enrichedMenu.forEach((item: any) => {
        item.id = nanoid(5);
        if (item.subMenu) enrichMenu(item.subMenu);
    });
    return enrichedMenu;
};

interface FlatMenuItem {
    link?: string;
    text: string;
}

export interface FlatMenuItemExtended extends FlatMenuItem {
    parent: FlatMenuItem[];
}

/** нужно для формирования хлебных крошек */
const flatMenu = (menuItems: MenuItemProps[], parent: FlatMenuItem[] = []) =>
    menuItems.reduce((acc, val) => {
        if (val.link) acc.push({ text: val.text, link: val?.link, parent });
        if (val.subMenu) acc.push(...flatMenu(val.subMenu, [...parent, { text: val.text, link: val.link }]));
        return acc;
    }, [] as FlatMenuItemExtended[]);

export const preparedFlatMenu = flatMenu(menu);

export default enrichMenu(menu);
