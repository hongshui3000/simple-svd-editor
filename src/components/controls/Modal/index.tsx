import { useCallback, FC, ReactNode, ReactNodeArray } from 'react';
import { CSSObject } from '@emotion/core';
import { scale, typography, useTheme } from '@scripts/gds';

import SuccessIcon from '@icons/20/checkCircle.svg';
import ErrorIcon from '@icons/20/closedCircle.svg';
import InfoIcon from '@icons/20/info.svg';
import WarningIcon from '@icons/20/warning.svg';
import CloseIcon from '@icons/20/closed.svg';

export interface ModalProps {
    title?: string;
    message?: string;
    theme?: 'white' | 'dark' | 'error' | 'warning' | 'success';
    icon?: boolean;
    closeBtn?: boolean;
    onClose?: () => void;
    className?: string;
    children?: ReactNode | ReactNodeArray;
}

const Modal: FC<ModalProps> = ({ title, message, theme = 'dark', icon, onClose, closeBtn, className, children }) => {
    const { colors } = useTheme();

    const getIcon = useCallback((t: ModalProps['theme']) => {
        const styles: CSSObject = {
            flexShrink: 0,
            marginRight: scale(1),
            marginTop: scale(1),
        };
        switch (t) {
            case 'dark':
            case 'white':
                return <InfoIcon css={styles} />;
            case 'error':
                return <ErrorIcon css={styles} />;
            case 'warning':
                return <WarningIcon css={styles} />;
            case 'success':
                return <SuccessIcon css={styles} />;
            default:
                return null;
        }
    }, []);

    const getStyles = useCallback(
        (t: ModalProps['theme']) => {
            const styles: CSSObject = {
                fill: 'currentColor',
            };
            switch (t) {
                case 'white':
                    styles.background = colors?.white;
                    styles.color = colors?.grey900;
                    styles.border = `1px solid ${colors?.grey200}`;
                    break;

                case 'error':
                    styles.background = colors?.danger;
                    styles.color = colors?.white;
                    break;
                case 'warning':
                    styles.background = colors?.warning;
                    styles.color = colors?.white;
                    break;
                case 'success':
                    styles.background = colors?.success;
                    styles.color = colors?.white;
                    styles.fill = colors?.white;
                    break;
                case 'dark':
                default:
                    styles.background = colors?.secondaryHover;
                    styles.color = colors?.white;
                    break;
            }
            return styles;
        },
        [
            colors?.danger,
            colors?.grey200,
            colors?.grey900,
            colors?.secondaryHover,
            colors?.success,
            colors?.warning,
            colors?.white,
        ]
    );

    return message || title ? (
        <div
            css={{
                display: 'flex',
                paddingLeft: scale(1),
                alignItems: 'flex-start',
                borderRadius: scale(1, true),
                ...getStyles(theme),
            }}
            className={className}
        >
            {icon ? getIcon(theme) : null}
            <div
                css={{
                    flexShrink: 1,
                    flexGrow: 1,
                    padding: `${scale(1)}px 0`,
                    alignSelf: 'stretch',
                    ...typography('bodySm'),
                }}
            >
                {title && <p css={typography('bodySmBold')}>{title}</p>}
                {message && <p>{message}</p>}
                {children && <div>{children}</div>}
            </div>
            {closeBtn && onClose ? (
                <button
                    type="button"
                    onClick={onClose}
                    css={{
                        display: 'grid',
                        color: 'inherit',
                        flexShrink: 0,
                        alignSelf: 'stretch',
                        padding: scale(1),
                        ':hover': { opacity: 0.8 },
                    }}
                    title="Закрыть"
                >
                    <CloseIcon />
                </button>
            ) : null}
        </div>
    ) : null;
};

export default Modal;
