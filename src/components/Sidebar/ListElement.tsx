import { FC, HTMLProps, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { CSSObject } from '@emotion/core';
import { useTheme, typography, scale } from '@scripts/gds';
import CheckIcon from '@icons/small/check.svg';
import ChevronRightIcon from '@icons/small/chevronRight.svg';
import { MenuItemProps } from './types';

import { Marker } from './Marker';

interface ListElementProps extends HTMLProps<HTMLLIElement> {
    item: MenuItemProps;
    level: number;
    hasChanges?: boolean;
    className?: string;
    onClick: () => void;
    isCutDown?: boolean;
    allLevels: number;
    menuItemStyles: CSSObject;
    active: boolean;
}

export const ListElement: FC<ListElementProps> = ({
    item,
    level,
    allLevels,
    className,
    hasChanges,
    isCutDown,
    onClick,
    menuItemStyles,
    active,
    ...props
}) => {
    const { colors } = useTheme();

    const isLastLevel = allLevels - 1 === level;
    const isFirstLevel = level === 0;
    const theme = isFirstLevel ? 'dark' : 'light';

    const itemStyle: CSSObject = useMemo(
        () => ({
            ...menuItemStyles,
            ...typography('bodySm'),
            '&:disabled': {
                cursor: 'default',
                color: colors?.grey600,
            },
            ...(theme === 'light' && {
                color: colors?.black,
                '&:hover': {
                    background: colors?.grey200,
                },
            }),
            ...(theme === 'dark' && {
                '&:hover': {
                    background: colors?.dark,
                    color: colors?.white,
                },
            }),
            ...(active && {
                color: theme === 'light' ? colors?.black : colors?.white,
                background: theme === 'light' ? colors?.grey200 : colors?.dark,
            }),
        }),
        [active, colors?.black, colors?.dark, colors?.grey200, colors?.grey600, colors?.white, menuItemStyles, theme]
    );

    const getContent = useCallback(
        () => (
            <>
                {item.Icon && (
                    <item.Icon css={{ marginRight: hasChanges && isCutDown ? 0 : scale(2), flexShrink: 0 }} />
                )}
                {hasChanges && isCutDown && <Marker />}
                {(!isCutDown || !isFirstLevel) && (
                    <>
                        <span css={!hasChanges && { marginRight: scale(2) }}>{item.text}</span>
                        {hasChanges && <Marker />}
                        {isLastLevel && !isFirstLevel && item.link && active && (
                            <CheckIcon css={{ marginLeft: 'auto', flexShrink: 0 }} />
                        )}
                        {item.subMenu && item.subMenu.length > 0 && (
                            <ChevronRightIcon css={{ marginLeft: 'auto', flexShrink: 0 }} />
                        )}
                    </>
                )}
            </>
        ),
        [hasChanges, isCutDown, isFirstLevel, isLastLevel, item, active]
    );

    return (
        <li {...props}>
            {item.link ? (
                <Link href={item.link} passHref>
                    <a className={className} css={itemStyle} title={item?.text} onClick={onClick}>
                        {getContent()}
                    </a>
                </Link>
            ) : (
                <button
                    className={className}
                    type="button"
                    css={itemStyle}
                    onClick={onClick}
                    title={item?.text}
                    aria-label={item?.text}
                    onMouseEnter={level > 0 ? onClick : undefined}
                >
                    {getContent()}
                </button>
            )}
        </li>
    );
};
