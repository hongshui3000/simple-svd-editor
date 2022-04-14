import { HTMLProps, ReactNode } from 'react';
import { AccordionItemButton as ReactAccordionItemButton } from 'react-accessible-accordion';
import { useTheme, typography } from '@scripts/gds';
import useAccordion from './useAccordion';

export interface AccordionButtonProps extends HTMLProps<HTMLDivElement> {
    /** Heading content */
    children: ReactNode;
}

export const AccordionButton = ({ children, ...props }: AccordionButtonProps) => {
    const { Icon } = useAccordion();
    const { components } = useTheme();
    const AT = components?.Accordion;

    return (
        <ReactAccordionItemButton
            css={{
                ...typography(AT?.buttonTypography),
                position: 'relative',
                color: AT?.buttonColor,
                backgroundColor: AT?.buttonBg,
                padding: AT?.buttonPadding,
                cursor: 'pointer',
                transition: 'color ease 200ms, background-color ease 200ms, box-shadow ease 200ms',
                '.js-focus-visible &.focus-visible:focus': {
                    zIndex: 1,
                    outline: `2px solid ${AT?.buttonOutlineColor}`,
                },
            }}
            {...props}
        >
            {children}
            {Icon && (
                <Icon
                    aria-hidden
                    css={{
                        position: 'absolute',
                        top: AT?.buttonIconTopPosition,
                        right: AT?.buttonIconRightPosition,
                        transform: 'translateY(-50%)',
                        fill: AT?.buttonIconColor,
                        transition: 'transform ease 300ms, fill ease 300ms',
                        '[aria-expanded="true"] &': {
                            transform: 'translateY(-50%) rotate(-180deg)',
                        },
                    }}
                />
            )}
        </ReactAccordionItemButton>
    );
};

export default AccordionButton;
