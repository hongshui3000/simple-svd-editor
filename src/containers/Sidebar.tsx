import { ReactNode, ReactNodeArray, useState, useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';

import { useMenu } from '@api/menu';

import Sidebar from '@components/Sidebar';
import { MenuItemProps } from '@components/Sidebar/types';

import LoadWrapper from '@components/controls/LoadWrapper';
import Overlay from '@components/Overlay';

import mockMenu from '@scripts/data/menu';
import { MAX_AGE_NEVER } from '@scripts/constants';
import { scale, useTheme } from '@scripts/gds';

import { useError } from '@context/modal';
import { useCommon } from '@context/common';
import Media from 'react-media';

interface SidebarContainerProps {
    children: ReactNode | ReactNodeArray;
}

const SidebarContainer = ({ children }: SidebarContainerProps) => {
    const { layout } = useTheme();

    const [cookies, setCookie] = useCookies(['isCutDown']);
    const [isCutDown, setIsCutDown] = useState(cookies.isCutDown === 'true');

    const { data: menuData, isLoading, error } = useMenu();
    useError(error);

    const filterMockMenu = useCallback(
        (menu: MenuItemProps[]) => {
            const filtered: MenuItemProps[] = [];
            if (!menuData) return [];
            menu.forEach(i => {
                if (i.subMenu && filterMockMenu(i.subMenu).length > 0)
                    filtered.push({ ...i, subMenu: filterMockMenu(i.subMenu) });
                if (i.link && menuData?.data?.items.includes(i.code)) filtered.push(i);
            });
            return filtered;
        },
        [menuData]
    );

    const userMenuItems = useMemo(() => filterMockMenu(mockMenu), [filterMockMenu]);

    const { isSidebarOpen, setIsSidebarOpen, isOverlayOpen, setIsOverlayOpen } = useCommon();

    return (
        <LoadWrapper isLoading={isLoading} error={undefined}>
            <Media query={{ maxWidth: layout?.breakpoints.md || 1023 }}>
                {matches => (
                    <Overlay active={isOverlayOpen && matches}>
                        <div
                            css={{
                                display: 'flex',
                                width: '100%',
                                height: '100%',
                                minHeight: `calc(100vh - ${scale(7)}px)`,
                            }}
                        >
                            <Sidebar
                                isSidebarOpenAdaptive={isSidebarOpen}
                                closeMenu={() => {
                                    setIsSidebarOpen(false);
                                    setIsOverlayOpen(false);
                                }}
                                menuItems={userMenuItems}
                                isCutDown={isCutDown}
                                cutDownHandler={() => {
                                    if (matches) {
                                        setIsSidebarOpen(false);
                                        setIsOverlayOpen(false);
                                    } else {
                                        const state = !isCutDown;
                                        setCookie('isCutDown', state, { maxAge: MAX_AGE_NEVER, path: '/' });
                                        setIsCutDown(state);
                                    }
                                }}
                                setOverlay={setIsOverlayOpen}
                            />
                            <div css={{ flexGrow: 1, flexShrink: 1, minHeight: '100vh' }}>{children}</div>
                        </div>
                    </Overlay>
                )}
            </Media>
        </LoadWrapper>
    );
};

export default SidebarContainer;
