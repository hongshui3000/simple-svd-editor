import { HTMLProps, ReactNode } from 'react';
import cn from 'classnames';
import { TabList as ReactTabList } from 'react-tabs';

export interface TabsListProps extends HTMLProps<HTMLUListElement> {
    /** Tabs.Tab components */
    children: ReactNode;
}

export const TabsList = ({ children, className, ...props }: TabsListProps) => {
    const baseClass = 'tabs__list';
    const classes = cn(baseClass, className);

    return (
        <ReactTabList className={classes} {...props}>
            {children}
        </ReactTabList>
    );
};

export default TabsList;
