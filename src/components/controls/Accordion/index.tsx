import { FC, HTMLProps, ReactNode } from 'react';
import { Accordion as ReactAccordion } from 'react-accessible-accordion';
import { useTheme } from '@scripts/gds';
import ArrowDownIcon from '@icons/small/chevronDown.svg';
import { AccordionContext, AccordionContextProps } from './useAccordion';
import AccordionItem, { AccordionItemProps } from './Item';
import AccordionHeading, { AccordionHeadingProps } from './Heading';
import AccordionPanel, { AccordionPanelProps } from './Panel';
import AccordionButton, { AccordionButtonProps } from './Button';

export interface AccordionCompositionProps {
    Item: FC<AccordionItemProps>;
    Heading: FC<AccordionHeadingProps>;
    Panel: FC<AccordionPanelProps>;
    Button: FC<AccordionButtonProps>;
}

export interface AccordionProps extends AccordionContextProps, Omit<HTMLProps<HTMLDivElement>, 'onChange' | 'ref'> {
    /** List of Accordion.Item components */
    children: ReactNode;
    /** Panel change handler */
    onChange?: (ids: string[]) => void;
    /** Allow to simultaneously open multiple panels */
    allowMultipleExpanded?: boolean;
    /** Allow to simultaneously close all panels */
    allowZeroExpanded?: boolean;
    /** List of expanded panels by default */
    preExpanded?: string[];
}

export const Accordion: FC<AccordionProps> & AccordionCompositionProps = ({
    children,
    allowMultipleExpanded = true,
    allowZeroExpanded = true,
    preExpanded,
    onChange,
    Icon = ArrowDownIcon,
    animationType,
    transitionTimeout = 300,
    transitionTimeoutExit = transitionTimeout,
    onEnter,
    onEntering,
    onExit,
    ...props
}) => {
    const { components } = useTheme();
    const AT = components?.Accordion;

    return (
        <AccordionContext.Provider
            value={{ Icon, animationType, transitionTimeout, transitionTimeoutExit, onEnter, onEntering, onExit }}
        >
            <ReactAccordion
                allowMultipleExpanded={allowMultipleExpanded}
                allowZeroExpanded={allowZeroExpanded}
                preExpanded={preExpanded}
                onChange={onChange}
                css={{ width: '100%', border: `1px solid ${AT?.itemBorderColor}` }}
                {...props}
            >
                {children}
            </ReactAccordion>
        </AccordionContext.Provider>
    );
};

Accordion.Item = AccordionItem;
Accordion.Heading = AccordionHeading;
Accordion.Button = AccordionButton;
Accordion.Panel = AccordionPanel;

export default Accordion;
