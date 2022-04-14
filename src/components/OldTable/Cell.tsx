import { Fragment } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Badge from '@components/controls/Badge';
import { convertPrice, getQueryObjectForPathname } from '@scripts/helpers';
import { CELL_TYPES } from '@scripts/enums';
import { useTheme, scale, Button } from '@scripts/gds';
import DragIcon from '@icons/small/dragAndDrop.svg';
import { useLinkCSS } from '@scripts/hooks';
import noImg from '../../../public/noimage.png';

interface CellProps {
    text?: string;
    type?: string;
}

const Cell = ({ text, type }: CellProps) => {
    const { colors } = useTheme();
    const { pathname, query } = useRouter();
    const linkStyles = useLinkCSS();

    if (type === CELL_TYPES.PHOTO) {
        return (
            <div css={{ width: scale(6), height: scale(6) }}>
                <Image width={scale(6)} height={scale(6)} src={text || noImg.src} alt="" />
            </div>
        );
    }

    if (type === CELL_TYPES.DOT)
        return (
            <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: scale(5, true) }}>
                <div
                    css={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        backgroundColor: text ? colors?.primary : 'transparent',
                    }}
                />
            </div>
        );

    if (typeof text !== 'number' && !text) return <p>-</p>;

    if (!type) return <p>{text}</p>;

    if (type === CELL_TYPES.LINKED_ID) {
        const queryForPathname = getQueryObjectForPathname(pathname, query);

        return (
            <Link href={{ pathname: `${pathname}/${text}`, query: queryForPathname }} passHref>
                <a css={linkStyles}>{text}</a>
            </Link>
        );
    }

    if (type === CELL_TYPES.LINKED_EMAIL) {
        return (
            <a css={linkStyles} href={`mailto:${text}`}>
                {text}
            </a>
        );
    }

    if (type === CELL_TYPES.LINK) {
        const [name, to] = text;
        return (
            <Link href={to} passHref>
                <a css={linkStyles}>{name}</a>
            </Link>
        );
    }

    if (type === CELL_TYPES.DOUBLE) {
        const [title, descr] = text;

        return (
            <div>
                <p>{title}</p> <p css={{ color: colors?.grey800, whiteSpace: 'pre' }}>{descr}</p>
            </div>
        );
    }

    if (type === CELL_TYPES.LINK_WITH_TEXT) {
        const [linkText, to, descr] = text;

        return (
            <div>
                <Link href={to} passHref>
                    <a css={linkStyles}>{linkText}</a>
                </Link>
                <p css={{ color: colors?.grey800, whiteSpace: 'pre' }}>{descr}</p>
            </div>
        );
    }

    if (type === CELL_TYPES.STATUS) return <Badge text={text} />;

    if (type === CELL_TYPES.PRICE) {
        const [rub, penny] = text.toString().split('.');
        return <span css={{ whiteSpace: 'nowrap' }}>{convertPrice(rub, penny)}</span>;
    }

    if (type === CELL_TYPES.DATE) return <p>{format(new Date(text), 'dd.MM.yyyy')}</p>;

    if (type === CELL_TYPES.DATE_TIME) return <p>{format(new Date(text), 'dd.MM.yyyy HH:mm')}</p>;

    if (type === CELL_TYPES.DATE_RANGE) {
        const [from, to] = text;
        return (
            <p>
                c {format(new Date(from), 'dd.MM.yyyy')} по {format(new Date(to), 'dd.MM.yyyy')}
            </p>
        );
    }
    if (type === CELL_TYPES.DRAG) {
        return (
            <Button theme="ghost" Icon={DragIcon} hidden css={{ '&:hover': { cursor: 'grab' } }}>
                Драг
            </Button>
        );
    }

    if (type === CELL_TYPES.ARRAY)
        return (
            <>
                {Array.isArray(text) &&
                    text.map((item, index) => (
                        <Fragment key={index}>
                            {item ? <p css={{ marginTop: index > 0 ? scale(1) : 0 }}>{item}</p> : null}
                        </Fragment>
                    ))}
            </>
        );

    if (type === CELL_TYPES.ARRAY_LINKS)
        return (
            <>
                {Array.isArray(text) &&
                    text.map(([name, link], index) => (
                        <Fragment key={index}>
                            {name ? (
                                <Link passHref href={link}>
                                    <a css={{ ...linkStyles, display: 'block' }}>{name}</a>
                                </Link>
                            ) : null}
                        </Fragment>
                    ))}
            </>
        );

    return <p>-</p>;
};

export default Cell;
