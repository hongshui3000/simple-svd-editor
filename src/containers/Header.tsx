import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

import Header from '@components/Header';

import { preparedFlatMenu } from '@scripts/data/menu';
import { regNextQueryParam } from '@scripts/regex';
import { useCommon } from '@context/common';

const HeaderContainer = ({ onLogout }: { onLogout: () => void }) => {
    const queryClient = useQueryClient();
    const { pathname } = useRouter();

    const breadcrumb = useMemo(() => {
        const preparedPathname = pathname.replace(regNextQueryParam, '');

        if (preparedPathname === '/') return { text: 'Главная', parent: [], link: '/' };

        /**  найдем пункт меню с точным совпадением ссылки */
        const exactMenuItem = preparedFlatMenu.find(m => m.link === preparedPathname);
        if (exactMenuItem) return exactMenuItem;

        /** если точного совпадения не найдено, то найдем приблизительное */
        const estimateMenuItem = preparedFlatMenu.find(
            m => (m.link && preparedPathname.includes(m.link)) || m.link?.includes(preparedPathname)
        );

        return estimateMenuItem;
    }, [pathname]);

    const { setIsSidebarOpen, setIsOverlayOpen } = useCommon();

    return (
        <Header
            breadcrumb={breadcrumb}
            onLogout={() => {
                onLogout();
                queryClient.clear();
            }}
            onMenuClick={() => {
                setIsSidebarOpen(true);
                setIsOverlayOpen(true);
            }}
            // onSearch={search => alert(`Поиск еще не реализован ${search}`)}
        />
    );
};

export default HeaderContainer;
