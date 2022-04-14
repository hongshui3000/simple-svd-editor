import { HTMLProps, ReactNode } from 'react';
import { AccordionItem as ReactAccordionItem } from 'react-accessible-accordion';
import { useTheme } from '@scripts/gds';

export interface AccordionItemProps extends Omit<HTMLProps<HTMLDivElement>, 'ref'> {
    /** Accordion.Heading and Accordion.Panel */
    children: ReactNode;
    /** Unique panel id */
    uuid?: string;
}

export const AccordionItem = ({ children, uuid, ...props }: AccordionItemProps) => {
    const { components } = useTheme();
    const AT = components?.Accordion;

    return (
        <ReactAccordionItem
            uuid={uuid}
            css={{
                ':not(:first-of-type)': {
                    borderTop: `1px solid ${AT?.itemBorderColor}`,
                },
            }}
            {...props}
        >
            {children}
        </ReactAccordionItem>
    );
};

export default AccordionItem;
