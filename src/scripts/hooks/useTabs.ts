import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';

/** useTabs - хук, который возвращает пропгеттер для компонента <Tabs />
 * @param {string} name - используй в случае нескольких отдельных компонентов табов
 */
export const useTabs = (tabName = 'tab') => {
    const { push, query } = useRouter();

    const tabIndex = Number(query[tabName]) || 0;
    const [index, setIndex] = useState(tabIndex);

    /** обновляем значение в useEffect, чтобы можно было пользоваться стрелками вперед/назад в браузере */
    useEffect(() => {
        if (tabIndex >= 0) setIndex(tabIndex);
    }, [tabIndex]);

    const getTabsProps = useCallback(
        () => ({
            onSelect: (index: number) => {
                const newQuery = JSON.parse(JSON.stringify(query));
                /** для того, чтобы ?tab=0 не показывалось, удалим из обоих объектов */
                if (index === 0) {
                    delete newQuery[tabName];
                } else {
                    newQuery[tabName] = `${index}`;
                }

                push({ query: newQuery });
            },
            selectedIndex: index,
        }),
        [index, push, tabName, query]
    );

    return {
        getTabsProps,
    };
};
