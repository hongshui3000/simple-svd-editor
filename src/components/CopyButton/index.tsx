import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { useLinkCSS } from '@scripts/hooks';
import CopyIcon from '@icons/small/copy.svg';
import { scale } from '@scripts/gds';
import CheckIcon from '@icons/small/check.svg';

export interface CopyButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
    children: string;
    timeout?: number;
}

const CopyButton: FC<CopyButtonProps> = ({ children, timeout = 1000, ...props }) => {
    const linkStyles = useLinkCSS();
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isSuccess) setIsSuccess(false);
        }, timeout);
        return () => clearTimeout(timer);
    }, [isSuccess, timeout]);

    return (
        <button
            type="button"
            css={linkStyles}
            {...props}
            aria-label="Копировать"
            title="Копировать"
            onClick={() => {
                navigator?.clipboard.writeText(children).then(() => setIsSuccess(true));
            }}
        >
            {children}
            {isSuccess ? (
                <CheckIcon css={{ marginLeft: scale(1, true) }} />
            ) : (
                <CopyIcon css={{ marginLeft: scale(1, true) }} />
            )}
        </button>
    );
};

export default CopyButton;
