import { HTMLProps, ReactNode } from 'react';
import { CSSObject } from '@emotion/core';
import { CSSTransition } from 'react-transition-group';
import {
    AccordionItemPanel as ReactAccordionItemPanel,
    AccordionItemState as ReactAccordionItemState,
} from 'react-accessible-accordion';
import { useTheme } from '@scripts/gds';
import useAccordion from './useAccordion';

export interface AccordionPanelProps extends Omit<HTMLProps<HTMLDivElement>, 'ref'> {
    /** Panel content */
    children: ReactNode;
}

export const AccordionPanel = ({ children, ...props }: AccordionPanelProps) => {
    const { components } = useTheme();
    const AT = components?.Accordion;

    const { animationType, transitionTimeout, transitionTimeoutExit, onEnter, onEntering, onExit } = useAccordion();

    const handleEnter = (...args: [HTMLElement, boolean]) => {
        const [instance] = args;
        if (onEnter) {
            onEnter(...args);
        } else if (animationType === 'height') {
            instance.style.height = `0px`;
            instance.style.transition = `height ease ${transitionTimeout}ms`;
        } else if (animationType === 'fadeIn') {
            instance.style.animation = `fade-in ${transitionTimeout}ms ease`;
        }
    };

    const handleEntering = (...args: [HTMLElement, boolean]) => {
        const [instance] = args;
        if (onEntering) {
            onEntering(...args);
        } else if (animationType === 'height' && instance.children[0] instanceof HTMLElement) {
            instance.style.height = `${instance.children[0].offsetHeight}px`;
        }
    };

    const handleExit = (...args: [HTMLElement]) => {
        const [instance] = args;
        if (onExit) {
            onExit(...args);
        } else if (animationType === 'height') {
            instance.style.height = `0px`;
        } else if (animationType === 'fadeIn') {
            instance.style.animation = ``;
        }
    };

    const panelCSS: CSSObject = {
        padding: AT?.pannelPadding,
        backgroundColor: AT?.pannelBg,
        '.exit-active &[hidden]': {
            display: 'block',
        },
    };

    return animationType ? (
        <ReactAccordionItemState>
            {({ expanded }) => (
                <CSSTransition
                    in={expanded}
                    timeout={{ enter: transitionTimeout, exit: transitionTimeoutExit }}
                    onEnter={handleEnter}
                    onEntering={handleEntering}
                    onExit={handleExit}
                    unmountOnExit
                >
                    <div
                        css={{
                            overflow: 'hidden',
                            '@keyframes fade-in': {
                                '0%': { opacity: 0 },
                                '100%': { opacity: 1 },
                            },
                        }}
                        {...props}
                    >
                        <ReactAccordionItemPanel css={panelCSS}>{children}</ReactAccordionItemPanel>
                    </div>
                </CSSTransition>
            )}
        </ReactAccordionItemState>
    ) : (
        <ReactAccordionItemPanel css={panelCSS} {...props}>
            {children}
        </ReactAccordionItemPanel>
    );
};

export default AccordionPanel;
