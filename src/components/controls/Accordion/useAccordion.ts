import { createContext, useContext } from 'react';
import { SVGRIcon } from '@customTypes/index';

export interface AccordionContextProps {
    /** CSSTransition handler, triggers after add 'enter' class */
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    /** CSSTransition handler, triggers after add 'enter-active' class */
    onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
    /** CSSTransition handler, triggers after add 'exit' class */
    onExit?: (node: HTMLElement) => void;
    /** CSSTransition timeout */
    transitionTimeout?: number;
    /** CSSTransition timeout on exit (if differs) */
    transitionTimeoutExit?: number;
    /** Type of panel toggle animation */
    animationType?: 'height' | 'fadeIn' | 'custom';
    /** Icon for arrow */
    Icon?: SVGRIcon;
}

export const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

const useAccordion = (): AccordionContextProps => {
    const context = useContext(AccordionContext);

    if (!context) {
        throw new Error('This component must be used within a <Accordion> component');
    }

    return context;
};

export default useAccordion;
