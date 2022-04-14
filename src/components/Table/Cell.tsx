import { FC } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, fromKopecksToRouble } from '@scripts/helpers';

import { useTheme, scale } from '@scripts/gds';
import { useLinkCSS } from '@scripts/hooks';

export interface CellProps {
    type:
        | 'photo'
        | 'double'
        | 'array'
        | 'date'
        | 'datetime'
        | 'price'
        | 'string'
        | 'email'
        | 'phone'
        | 'url'
        | 'int'
        | 'float'
        | 'enum'
        | 'bool'
        | 'object';
    value: any;
}

export const Cell: FC<CellProps> = ({ value, type }) => {
    const { colors } = useTheme();
    const linkStyles = useLinkCSS();

    if (!value && type !== 'photo') return '-';
    switch (type) {
        case 'photo':
            return (
                <div css={{ width: scale(6), height: scale(6), borderRadius: scale(1, true) }}>
                    <Image width={scale(6)} height={scale(6)} src={value || '/noimage.png'} alt="" />
                </div>
            );

        case 'double': {
            const [title, descr] = value;

            return (
                <>
                    <p>{title}</p>
                    <p css={{ color: colors?.grey800, whiteSpace: 'pre' }}>{descr}</p>
                </>
            );
        }

        case 'array':
            return (
                <ul css={{ li: { ':not:first-of-type': { marginTop: scale(1) } } }}>
                    {Array.isArray(value) && value.map(item => item && <li key={item.toString()}>{item}</li>)}
                </ul>
            );

        case 'date':
            return <p>{format(new Date(value), 'dd.MM.yyyy')}</p>;

        case 'datetime':
            return <p>{format(new Date(value), 'dd.MM.yyyy HH:mm')}</p>;

        case 'price':
            return <p css={{ whiteSpace: 'nowrap' }}>{formatPrice(fromKopecksToRouble(value))} ₽</p>;

        case 'string':
        case 'email':
        case 'phone':
        case 'int':
        case 'float':
            return value;

        case 'bool':
            return value ? 'Да' : 'Нет';

        case 'url':
            return (
                <Link href={value} passHref>
                    <a css={linkStyles}>{value}</a>
                </Link>
            );

        case 'enum': {
            if (!value) return '-';
            if (typeof value === 'string') return value;
            return JSON.stringify(value);
        }

        default:
            return <p>-</p>;
    }
};
