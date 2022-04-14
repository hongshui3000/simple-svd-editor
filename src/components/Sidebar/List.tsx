import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { CSSObject } from '@emotion/core';
import Media from 'react-media';
import { useTheme, scale } from '@scripts/gds';
import { useMedia } from '@scripts/hooks';
import { MENU_WIDTH } from './enums';
import { MenuItemProps } from './types';
import { CloseBtn } from './CloseBtn';
import { ListElement } from './ListElement';

interface ListProps {
    className?: string;
    items: MenuItemProps[];
    isCutDown?: boolean;
    level: number;
    allLevels: number;
    activeMenuPoints: MenuItemProps[];
    cutDownHandler: () => void;
    setMenu: Dispatch<SetStateAction<MenuItemProps[][]>>;
    activeMenuPointsByUser: string[];
    setActiveMenuPointsByUser: Dispatch<SetStateAction<string[]>>;
}

const getMainMenuWidth = (isCutDown?: boolean) => (!isCutDown ? MENU_WIDTH.FULL : MENU_WIDTH.CUT);

export const List: FC<ListProps> = ({
    className,
    items,
    isCutDown,
    level,
    allLevels,
    activeMenuPoints,
    cutDownHandler,
    setMenu,
    activeMenuPointsByUser,
    setActiveMenuPointsByUser,
}) => {
    const { layout, colors, shadows } = useTheme();
    const { md, sm, smMin } = useMedia();

    const isFirstLevel = level === 0;
    const isLastLevel = allLevels - 1 === level;

    const menuItemStyle: CSSObject = useMemo(
        () => ({
            display: 'flex',
            alignItems: 'center',
            color: colors?.grey600,
            fill: 'currentColor',
            width: '100%',
            padding: `${scale(3, true)}px ${scale(5, true)}px`,
            textAlign: 'left',
            background: 'transparent',
            '&:hover': {
                color: colors?.white,
                backgroundColor: colors?.dark,
            },
        }),
        [colors?.dark, colors?.grey600, colors?.white]
    );

    const isUserSelect = activeMenuPointsByUser.length > 0;

    return (
        <div
            className={className}
            css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                backgroundColor: colors?.white,
                ...(isFirstLevel && {
                    width: getMainMenuWidth(isCutDown),
                    backgroundColor: colors?.secondaryHover,
                    color: colors?.white,
                    [sm]: {
                        width: MENU_WIDTH.FULL,
                    },
                }),
                ...(!isFirstLevel && {
                    width: MENU_WIDTH.FULL,
                    position: 'absolute',
                    borderLeft: `1px solid ${colors?.lightBlue}`,
                    left: getMainMenuWidth(isCutDown) + (level - 1) * MENU_WIDTH.FULL,
                    [md]: {
                        position: 'static',
                    },
                    [sm]: {
                        position: 'absolute',
                        left: 0,
                        zIndex: 1,
                    },
                }),
                ...(!isFirstLevel &&
                    !isLastLevel && {
                        [smMin]: {
                            zIndex: 1,
                        },
                    }),
                ...(!isFirstLevel &&
                    isLastLevel && {
                        boxShadow: shadows?.box,
                    }),
            }}
        >
            <ul css={{ overflow: 'auto', position: 'sticky', top: 0, paddingBottom: scale(6) }}>
                {items.map(item => {
                    const active = isUserSelect
                        ? Boolean(activeMenuPointsByUser.find(code => code === item.code))
                        : Boolean(activeMenuPoints.find(i => i.id === item.id));

                    return (
                        <ListElement
                            key={item.id}
                            item={item}
                            level={level}
                            allLevels={allLevels}
                            menuItemStyles={menuItemStyle}
                            isCutDown={isCutDown}
                            active={active}
                            onClick={() => {
                                setActiveMenuPointsByUser(points => {
                                    if (item.subMenu) {
                                        return [...points.slice(0, level), item.code];
                                    }
                                    if (item.link) return [];
                                    return points;
                                });
                                setMenu(menu => {
                                    if (item.subMenu) {
                                        return [...menu.slice(0, level + 1), item.subMenu];
                                    }
                                    if (item.link) {
                                        return [...menu.slice(0, 1)];
                                    }
                                    return menu;
                                });
                            }}
                        />
                    );
                })}
            </ul>

            <Media query={{ minWidth: layout?.breakpoints.sm || 768 }}>
                {matches =>
                    !matches || isFirstLevel ? (
                        <CloseBtn
                            level={level}
                            isCutDown={isCutDown}
                            menuItemStyles={menuItemStyle}
                            onClick={() => {
                                if (isFirstLevel) {
                                    if (cutDownHandler) cutDownHandler();
                                    return;
                                }

                                setMenu(menu => menu.slice(0, level));
                            }}
                        />
                    ) : null
                }
            </Media>
        </div>
    );
};
