import { useState, useRef, useCallback, useMemo, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import Media from 'react-media';

import { useMedia, useOnClickOutside } from '@scripts/hooks';

import { useTheme } from '@scripts/gds';
import { MenuItemProps } from './types';
import { List } from './List';

interface SidebarProps {
    menuItems: MenuItemProps[];
    isCutDown: boolean;
    cutDownHandler: () => void;
    setOverlay?: (overlay: boolean) => void;
    isSidebarOpenAdaptive?: boolean;
    closeMenu?: () => void;
}

const Sidebar: FC<SidebarProps> = ({
    menuItems = [],
    isCutDown,
    cutDownHandler,
    setOverlay,
    isSidebarOpenAdaptive,
    closeMenu,
    ...props
}) => {
    const { md } = useMedia();
    const { shadows, layout } = useTheme();

    const [menu, setMenu] = useState<MenuItemProps[][]>([menuItems]);
    useEffect(() => {
        setMenu([menuItems]);
    }, [menuItems]);

    const { pathname } = useRouter();

    const getMatch = useCallback((link?: string) => link && new RegExp(link).test(pathname), [pathname]);

    /** Найдем активные пункты меню, соответсвующие урлу */
    const activeMenuPoints = useMemo(() => {
        const points: MenuItemProps[] = [];
        const findActive = (items?: MenuItemProps[]): MenuItemProps | undefined => {
            if (!items) return undefined;
            const finded = items.find(i => {
                if (i.link) return getMatch(i.link);
                return findActive(i.subMenu);
            });
            if (finded) points.push(finded);
            return finded;
        };
        findActive(menuItems);
        return points;
    }, [getMatch, menuItems]);

    /** Установим выбранные пользователем активные пункты */
    const [activeMenuPointsByUser, setActiveMenuPointsByUser] = useState<string[]>([]);

    const menuRef = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(menuRef, () => {
        setMenu([menuItems]);
        if (closeMenu) closeMenu();
        if (setOverlay) setOverlay(false);
        setActiveMenuPointsByUser([]);
    });

    return (
        <nav
            css={{
                display: 'flex',
                position: 'relative',
                zIndex: 1,
                [md]: {
                    position: 'fixed',
                    overflow: 'auto',
                    height: '100%',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 2,
                    boxShadow: shadows?.box,
                },
            }}
            ref={menuRef}
            {...props}
        >
            <Media query={{ minWidth: layout?.breakpoints.md || 1024 }}>
                {matches =>
                    matches || isSidebarOpenAdaptive ? (
                        <>
                            {menu.map((items, index) => (
                                <List
                                    setMenu={setMenu}
                                    key={index}
                                    items={items}
                                    level={index}
                                    allLevels={menu.length}
                                    isCutDown={matches ? isCutDown : false}
                                    cutDownHandler={cutDownHandler}
                                    activeMenuPoints={activeMenuPoints}
                                    activeMenuPointsByUser={activeMenuPointsByUser}
                                    setActiveMenuPointsByUser={setActiveMenuPointsByUser}
                                />
                            ))}
                        </>
                    ) : null
                }
            </Media>
        </nav>
    );
};

export default Sidebar;
