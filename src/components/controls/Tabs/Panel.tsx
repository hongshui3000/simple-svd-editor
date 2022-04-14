import { HTMLProps, ReactNode } from 'react';
import cn from 'classnames';
import { TabPanel as ReactTabPanel } from 'react-tabs';

export interface TabsPanelProps extends HTMLProps<HTMLDivElement> {
    /** Panel content */
    children: ReactNode;
}

export const TabsPanel = ({ children, className, ...props }: TabsPanelProps) => {
    const baseClass = 'tabs__panel';
    const classes = cn(baseClass, className);

    return (
        <ReactTabPanel className={classes} selectedClassName={`${baseClass}--selected`} {...props}>
            {children}
        </ReactTabPanel>
    );
};

export default TabsPanel;
