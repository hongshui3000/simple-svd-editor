import { FC, HTMLAttributes } from 'react';
import { CSSObject } from '@emotion/core';
import { useTheme, scale } from '@scripts/gds';
import ChevronRightIcon from '@icons/small/chevronRight.svg';
import ChevronLeftIcon from '@icons/small/chevronLeft.svg';

interface CloseBtnProps extends HTMLAttributes<HTMLButtonElement> {
    level: number;
    isCutDown?: boolean;
    menuItemStyles: CSSObject;
}

export const CloseBtn: FC<CloseBtnProps> = ({ level, isCutDown, className, menuItemStyles, ...props }) => {
    const { colors } = useTheme();

    const isFirstLevel = level === 0;
    const text = isFirstLevel ? 'Свернуть' : 'Назад';
    const theme = isFirstLevel ? 'dark' : 'light';

    return (
        <button
            type="button"
            className={className}
            css={{
                ...menuItemStyles,
                position: 'sticky',
                bottom: 0,
                zIndex: 1,
                padding: `${scale(2)}px ${scale(5, true)}px`,
                ...(theme === 'light' && {
                    backgroundColor: colors?.white,
                    color: colors?.black,
                    ':hover': { backgroundColor: colors?.grey200, color: colors?.dark },
                }),
                ...(theme === 'dark' && {
                    backgroundColor: colors?.secondaryHover,
                }),
                ...(isCutDown && {
                    justifyContent: 'center',
                    padding: `${scale(2)}px 0`,
                }),
            }}
            {...props}
            aria-label={text}
            title={isCutDown ? text : undefined}
        >
            {isFirstLevel && isCutDown ? (
                <ChevronRightIcon />
            ) : (
                <>
                    <ChevronLeftIcon css={{ marginRight: scale(1) }} />
                    {text}
                </>
            )}
        </button>
    );
};
