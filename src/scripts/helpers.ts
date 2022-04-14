import { ParsedUrlQuery } from 'querystring';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CommonOption } from '@api/common/types';
import { LIMIT_PAGE, KOPECKS_IN_ROUBLE } from './constants';

export const isTouch = () => 'ontouchstart' in window;

export const toArray = (arg: any) => [].concat(...[arg]);

export const lang = () => document.documentElement.lang;

export const isObject = (item: any) => typeof item === 'object' && !Array.isArray(item) && item !== null;

export const repeat = (value: any, count: number) => new Array(count).fill(value);

export const debounce = (func: any, wait = 300) => {
    let timeout: any;

    // eslint-disable-next-line func-names
    return function (this: any, ...args: any) {
        const next = () => func.apply(this, args);
        clearTimeout(timeout);
        timeout = setTimeout(next, wait);
    };
};

export const isEmptyArray = (arg: any) => Array.isArray(arg) && arg.length === 0;

export const prepareForSelect = (val: string[]) => val.map(i => ({ value: i, label: i }));
export const prepareEnumForSelect = (val: Record<string, string>) =>
    Object.entries(val).map(([k, v]) => ({ value: k, label: v }));

export const prepareForSelectFromObject = (obj: Record<string, string>) =>
    Object.keys(obj).map(k => ({ value: +k, label: obj[k] }));

export const humanize = (str: string) => {
    const fragments = str.split('_');
    const capitalizedFragments = fragments.map(frag => `${frag[0].toUpperCase()}${frag.slice(1)}`);
    return capitalizedFragments.join(' ');
};

export const randomizeInt = (min: number, max: number) => Math.floor(min + Math.random() * (max + 1 - min));

export const declOfNum = (n: number, titles: string[]) =>
    // eslint-disable-next-line no-nested-ternary
    titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

export const getCodeFromUrl = (url: string) => {
    const pathArr = url.split('/').filter(Boolean);
    return pathArr[pathArr.length - 1];
};

export const wait = (time = 1000) => new Promise(resolve => setTimeout(() => resolve(true), time));

export const trimString = (s: string, count: number) => (s.length > count ? `${s.substr(0, count)}...` : s);

export const convertPrice = (rub: string | number, penny: string | number) =>
    rub && `${rub.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')},${penny || '00'}`;

export const fromKopecksToRouble = (kopecks: number) => kopecks / KOPECKS_IN_ROUBLE;
export const fromRoubleToKopecks = (rub: number) => Math.floor(rub * KOPECKS_IN_ROUBLE);

export const formatPrice = (value: number, toFixed = 2) =>
    value?.toFixed(value.toFixed(2).slice(-3) === '.00' ? 0 : toFixed).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export type Flatten<T> = T extends any[] ? T[number] : T;

export const getTotalPages = (data: { meta?: { pagination?: { total: number } } } = {}, limit = LIMIT_PAGE) =>
    Math.ceil((data?.meta?.pagination?.total || 0) / limit);

export const getTotal = (data: { meta?: { pagination?: { total: number } } } = {}) =>
    data?.meta?.pagination?.total || 0;
export interface INestedRow {
    id: number;
    parent_id?: number | null;
    subRows?: INestedRow[] | [];
    [key: string]: any;
}

export const getNestedData = (data: INestedRow[]): INestedRow[] => {
    const dataObj: any = {};
    const nestedData: INestedRow[] = [];

    data.forEach(row => {
        dataObj[row.id] = row;
        row.subRows = [];
    });

    data.forEach(row => (row.parent_id ? dataObj[row.parent_id].subRows.push(row) : nestedData.push(row)));

    return nestedData;
};

export const getFlatRows = (rows: INestedRow[]): INestedRow[] => {
    const resRows: INestedRow[] = [];

    rows.forEach(row => {
        resRows.push(row);
        if (row?.subRows && row.subRows.length > 0) resRows.push(...getFlatRows(row.subRows));
    });

    return resRows;
};

export const getObjectWithoutEmptyFields = (obj: any) => {
    if (!obj) return obj;

    const keys = Object.keys(obj).filter(key => obj[key] !== null && obj[key] !== '');
    return Object.fromEntries(keys.map(item => [item, obj[item]]));
};

export const getTextValueByBoolean = (value: boolean) => (value === true ? 'Да' : 'Нет');

export const getQueryKeysFromBrackets = (value: string) => value.match(/\[.+\]/)?.map(i => i.replace(/[[\]]/g, ''));

/**
 * router next возвращает pathname в виде /path/[param], и query в виде {param: '123'}
 * поэтому getQueryObjectForPathname возвращает те query, которые соответствуют pathname
 */
export const getQueryObjectForPathname = (pathname: string, query: ParsedUrlQuery) => {
    const keys = getQueryKeysFromBrackets(pathname) || [];
    const queryForPage: ParsedUrlQuery = {};

    keys.forEach(key => {
        queryForPage[key] = query[key];
    });

    return queryForPage;
};

export const prepareTelValue = (tel: string) => {
    if (!tel || tel.length < 10) return '';
    const t = tel.split('');
    const l = tel.length - 1;

    return `+7(${t[l - 9]}${t[l - 8]}${t[l - 7]}) ${t[l - 6]}${t[l - 5]}${t[l - 4]}-${t[l - 3]}${t[l - 2]}-${t[l - 1]}${
        t[l]
    }`;
};

export const cleanPhoneValue = (tel: string) => tel.replace(/[()\- ]/g, '');

export const getDate = (date: string | null | undefined, type?: 'start' | 'end') =>
    date
        ? `${type === 'start' ? 'C ' : ''}${type === 'end' ? ' по ' : ''}${new Date(date).toLocaleDateString('ru')}`
        : '';

export const getPeriod = (start: string | null | undefined, end: string | null | undefined) => {
    if (start === end) return getDate(start);
    return `${getDate(start, 'start')}${getDate(end, 'end')}`;
};

export const toISOString = (date: Date) => format(date, 'yyyy-MM-dd');

export const formatDate = (date: Date, dateFormat = 'dd.MM.yyyy HH:mm') => format(date, dateFormat, { locale: ru });

export const isDateString = (date: string) => {
    if (Number.isNaN(+date)) {
        return new Date(date).toString() !== 'Invalid Date';
    }
    return false;
};

export const toSelectItems = (options: CommonOption[] | undefined) =>
    options?.map(o => ({ label: o.name, value: o.id })) || [];

export const getOptionName = (options: CommonOption[] | undefined, idToFind: number | undefined) =>
    (idToFind && options?.find(o => o.id === idToFind)?.name) || '';

export const isNotEmptyObject = (obj: any) => {
    if (typeof obj === 'object') {
        return Object.keys(obj).some(key => typeof obj[key] !== 'undefined');
    }
    throw new Error('Not an object parameter');
};
