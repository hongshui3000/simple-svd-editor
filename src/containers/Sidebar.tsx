import { ReactNode, ReactNodeArray, useState } from 'react';
import { useCookies } from 'react-cookie';

import Sidebar from '@components/Sidebar';
// import { MenuItemProps } from '@components/Sidebar/types';

import LoadWrapper from '@components/controls/LoadWrapper';
import Overlay from '@components/Overlay';

// import mockMenu from '@scripts/data/menu';
import { MAX_AGE_NEVER } from '@scripts/constants';
import { scale, useTheme } from '@scripts/gds';

// import { useError } from '@context/modal';
import { useCommon } from '@context/common';
import Media from 'react-media';

interface SidebarContainerProps {
    children: ReactNode | ReactNodeArray;
}

const SidebarContainer = ({ children }: SidebarContainerProps) => {
    const { layout } = useTheme();

    const [cookies, setCookie] = useCookies(['isCutDown']);
    const [isCutDown, setIsCutDown] = useState(cookies.isCutDown === 'true');

    const { isSidebarOpen, setIsSidebarOpen, isOverlayOpen, setIsOverlayOpen } =
        useCommon();

    return (
        <LoadWrapper isLoading={false} error={undefined}>
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
                                menuItems={[]}
                                isCutDown={isCutDown}
                                cutDownHandler={() => {
                                    if (matches) {
                                        setIsSidebarOpen(false);
                                        setIsOverlayOpen(false);
                                    } else {
                                        const state = !isCutDown;
                                        setCookie('isCutDown', state, {
                                            maxAge: MAX_AGE_NEVER,
                                            path: '/',
                                        });
                                        setIsCutDown(state);
                                    }
                                }}
                                setOverlay={setIsOverlayOpen}
                            />
                            <div css={{ flexGrow: 1, flexShrink: 1, minHeight: '100vh' }}>
                                {children}
                            </div>
                        </div>
                    </Overlay>
                )}
            </Media>
        </LoadWrapper>
    );
};

export default SidebarContainer;
