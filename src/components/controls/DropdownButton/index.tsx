import { useState, useRef, ReactNode, ButtonHTMLAttributes, Children, isValidElement, cloneElement } from 'react';
import { CSSObject } from '@emotion/core';
import { useOnClickOutside } from '@scripts/hooks';
import ArrowDown from '@icons/arrow-down.svg';
import { useTheme, scale, Button } from '@scripts/gds';

export interface DropdownButtonProps {
    /** Dropdown content */
    children: ReactNode;
    /** Button template */
    buttonContent: ReactNode;
    /** Button styles */
    buttonStyles?: CSSObject;
    /** Open state */
    isDropOpen?: boolean;
    /** Dropdown position */
    isDropRight?: boolean;
    /** Close on click option */
    isCloseOnClick?: boolean;
    /** Disabled button */
    isDisabled?: boolean;
    /** Emotion css prop */
    css?: CSSObject;
}

export interface DropdownButtonOptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    css?: CSSObject;
}

const DropdownButtonOption = ({ children, ...props }: DropdownButtonOptionProps) => (
    <button type="button" {...props}>
        {children}
    </button>
);

const DropdownButton = ({
    children,
    buttonContent,
    buttonStyles,
    isDropOpen = false,
    isDropRight = false,
    isCloseOnClick = true,
    isDisabled,
    ...props
}: DropdownButtonProps) => {
    const { colors } = useTheme();
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(isDropOpen);
    useOnClickOutside(dropdownRef, () => setIsOpen(false));

    const clickOption = (clbFunc?: () => void) => {
        if (isCloseOnClick) {
            setIsOpen(!isOpen);
        }
        if (clbFunc) {
            clbFunc();
        }
    };

    return (
        <div ref={dropdownRef} css={{ position: 'relative' }}>
            <Button
                theme="primary"
                Icon={ArrowDown}
                iconAfter
                css={{ ...buttonStyles }}
                onClick={() => setIsOpen(!isOpen)}
                disabled={isDisabled}
            >
                {buttonContent}
            </Button>
            {isOpen && children && (
                <div
                    {...props}
                    css={[
                        {
                            position: 'absolute',
                            top: `100%`,
                            ...(isDropRight ? { right: 0 } : { left: 0 }),
                            zIndex: 2,
                            whiteSpace: 'nowrap',
                            border: `1px solid ${colors?.grey400}`,
                            borderRadius: 4,
                            backgroundColor: colors?.white,
                            display: 'flex',
                            flexDirection: 'column',
                        },
                        props.css,
                    ]}
                >
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            return cloneElement(child, {
                                ...child.props,
                                css: [
                                    {
                                        padding: `${scale(1)}px ${scale(3)}px`,
                                        textAlign: 'left',
                                        '&:hover': {
                                            backgroundColor: colors?.grey300,
                                            cursor: 'pointer',
                                        },
                                    },
                                    child.props.css,
                                ],
                                onClick: () => clickOption(child.props.onClick),
                            });
                        }
                    })}
                </div>
            )}
        </div>
    );
};

DropdownButton.Option = DropdownButtonOption;

export default DropdownButton;
