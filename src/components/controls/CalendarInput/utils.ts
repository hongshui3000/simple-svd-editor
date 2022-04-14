import { format } from 'date-fns';

export const formatDate = (val?: number) => (val ? format(val, 'dd.MM.yyyy') : '');

export const parseDateString = (dateStr: string) => new Date(dateStr.split('.').reverse().join('-')).getTime();

export const MAX_DATE_STRING_LENGTH = 8;
export const MAX_DATE_STRING_LENGTH_WITH_DOTS = 10;
export const DOT_INDEX = [2, 4];
export const prepareInputValue = (value: string) =>
    value
        .replace(/\D/g, '')
        .split('')
        .map((char, index) => {
            if (DOT_INDEX.includes(index)) {
                return `.${char}`;
            }
            return char;
        })
        .join('');
