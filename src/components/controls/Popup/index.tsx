import { useRef, ReactNode, useEffect, FC, HTMLProps } from 'react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { CSSObject } from '@emotion/core';
import cn from 'classnames';
import Modal, { Props as ReactModalProps } from 'react-modal';

import { useTheme, scale, typography } from '@scripts/gds';
import { useMedia } from '@scripts/hooks';

import CrossIcon from '@icons/cross.svg';

import { Footer, FooterProps } from './Footer';
import { Body, BodyProps } from './Body';

export interface PopupProps extends ReactModalProps {
    /** Popup content */
    children: ReactNode | ReactNode[];
    /** Add close button */
    isCloseButton?: boolean;
    /** Fullscreen mode */
    isFullscreen?: boolean;
    /** Title text */
    title?: ReactNode;
    /** Unique name for headings association. Set id yourself for multiple popups differing */
    id?: string;
    /** Enable  or disable scroll inside, for use ID prop required */
    scrollInside?: boolean;
    /** Сss for children wrapper in popup */
    popupCss?: CSSObject;
    /** Class name */
    className?: string;
    /** Does popup appear from right */
    rightHanded?: boolean;
    /** Does popup appear from left */
    leftHanded?: boolean;
}

const CloseButton: FC<HTMLProps<HTMLButtonElement>> = props => (
    <button
        aria-label="Закрыть попап"
        css={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: scale(8) + scale(1, true),
            height: scale(6) + scale(1, true),
            transition: 'opacity ease-in 300ms',
            ':hover': { opacity: 0.8 },
        }}
        {...props}
        type="button"
    >
        <CrossIcon />
    </button>
);

const Popup: FC<PopupProps> & { Body: FC<BodyProps>; Footer: FC<FooterProps> } = ({
    className,
    popupCss,
    children,
    onRequestClose,
    closeTimeoutMS = 300,
    isCloseButton = true,
    isFullscreen = false,
    title,
    scrollInside = false,
    rightHanded,
    leftHanded,
    onAfterOpen,
    id = 'popup',
    isOpen,
    ...props
}) => {
    if (rightHanded && leftHanded) {
        console.error(`You must use either rightHanded or leftHanded prop, not both at the same time`);
    }

    if (popupCss) {
        console.warn(`Use css prop on Popup component. popupCss prop will be removed`);
    }

    const { colors } = useTheme();
    const { sm } = useMedia();
    const baseContentClass = cn('popup-content', {
        leftHanded,
        rightHanded,
        isFullscreen,
        scrollInside: scrollInside || rightHanded || leftHanded,
    });

    const overlayClass = cn('popup-overlay', { isFullscreen });

    const contentRef = useRef<HTMLElement | null>(null);

    /** Enable body scroll when close popup */
    useEffect(() => {
        if (contentRef?.current && !isOpen) enableBodyScroll(contentRef.current);
    }, [isOpen]);

    return (
        <Modal
            bodyOpenClassName={null}
            contentRef={node => {
                contentRef.current = node;
            }}
            overlayClassName={{
                base: overlayClass,
                beforeClose: 'popup-overlay--before-close',
                afterOpen: 'popup-overlay--after-open',
            }}
            className={{
                base: baseContentClass,
                beforeClose: 'popup-content--before-close',
                afterOpen: 'popup-content--after-open',
            }}
            aria={{ labelledby: id }}
            closeTimeoutMS={closeTimeoutMS}
            {...(process.env.IS_STORYBOOK && { ariaHideApp: false })}
            {...props}
            onRequestClose={onRequestClose}
            onAfterOpen={e => {
                if (onAfterOpen) onAfterOpen(e);
                // Disable body scroll when open popup
                if (contentRef?.current) disableBodyScroll(contentRef.current);
            }}
            isOpen={isOpen}
        >
            <div
                css={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    ...((rightHanded || leftHanded) && { width: scale(42) }),
                    [sm]: {
                        maxWidth: 'initial',
                        width: '100%',
                        height: '100%',
                    },
                    ...(!isFullscreen &&
                        !rightHanded &&
                        !leftHanded && { borderRadius: `${scale(1, true)}px`, maxWidth: scale(72) }),
                    ...popupCss,
                }}
                className={className}
            >
                {isCloseButton && <CloseButton onClick={onRequestClose} />}
                {title && (
                    <p
                        id={id}
                        css={{
                            padding: `${scale(2)}px ${scale(3)}px`,
                            borderBottom: `1px solid ${colors?.grey200}`,
                            ...typography('h3'),
                            ...(isCloseButton && { paddingRight: scale(8) + scale(1, true) }),
                        }}
                    >
                        {title}
                    </p>
                )}
                {children}
            </div>
        </Modal>
    );
};

if (!process.env.IS_STORYBOOK) {
    Modal.setAppElement('#__next');
}

Popup.Body = Body;
Popup.Footer = Footer;

export default Popup;
