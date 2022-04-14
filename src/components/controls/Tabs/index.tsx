import { FC, HTMLProps, ReactNode } from 'react';
import { Global } from '@emotion/core';
import cn from 'classnames';
import { Tabs as ReactTabs } from 'react-tabs';

import { useTheme, typography } from '@scripts/gds';
import TabsList, { TabsListProps } from './List';
import TabsTab, { TabsTabProps } from './Tab';
import TabsPanel, { TabsPanelProps } from './Panel';

export interface TabsCompositionProps {
    List: FC<TabsListProps>;
    Tab: FC<TabsTabProps>;
    Panel: FC<TabsPanelProps>;
}

export interface TabsProps extends Omit<HTMLProps<HTMLDivElement>, 'onSelect'> {
    /** Tabs.List and Tabs.Panel components */
    children: ReactNode;
    /** Initially opened tab in uncontrolled mode */
    defaultIndex?: number;
    /** Currently opened tab in controlled mode */
    selectedIndex?: number;
    /** Tab select handler */
    onSelect?: (index: number, last: number, event: Event) => boolean | void;
}

export const Tabs: FC<TabsProps> & TabsCompositionProps = ({ children, className, ...props }) => {
    const { components } = useTheme();
    const tabsTheme = components?.Tabs;
    const baseClass = 'tabs';
    const classes = cn(baseClass, className);

    return (
        <>
            <Global
                styles={{
                    '.tabs': {
                        '&__list': {
                            display: 'flex',
                        },

                        '&__tab': {
                            display: 'grid',
                            placeItems: 'center',
                            height: tabsTheme?.height,
                            padding: tabsTheme?.padding,
                            color: tabsTheme?.color,
                            backgroundColor: tabsTheme?.bg,
                            whiteSpace: 'nowrap',
                            borderTop: `${tabsTheme?.borderWidth}px solid ${tabsTheme?.borderColor}`,
                            ...typography(tabsTheme?.typography),

                            ':hover:not(&--selected):not(&--disabled)': {
                                cursor: 'pointer',
                            },

                            '&--selected': {
                                color: tabsTheme?.activeColor,
                                backgroundColor: tabsTheme?.activeBg,
                                borderTopColor: tabsTheme?.activeBorderColor,
                            },

                            '&--disabled': {
                                color: tabsTheme?.disabledColor,
                                bg: tabsTheme?.disabledBg,
                                cursor: 'not-allowed',
                            },
                        },

                        '&__panel': {
                            display: 'none',
                            '&--selected': { display: 'block' },
                        },
                    },
                }}
            />
            <ReactTabs className={classes} {...props}>
                {children}
            </ReactTabs>
        </>
    );
};
(TabsList as any).tabsRole = 'TabList';
(TabsTab as any).tabsRole = 'Tab';
(TabsPanel as any).tabsRole = 'TabPanel';

Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

export default Tabs;
