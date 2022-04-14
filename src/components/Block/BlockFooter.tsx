import { ReactNode } from 'react';
import { scale, useTheme } from '@scripts/gds';

export interface BlockFooterProps {
    className?: string;
    children?: ReactNode;
}

const BlockFooter = ({ className, children }: BlockFooterProps) => {
    const { colors } = useTheme();

    return (
        <div
            css={{
                borderTop: `1px solid ${colors?.grey400}`,
                padding: `${scale(2)}px ${scale(3)}px`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: scale(8),
            }}
            className={className}
        >
            {children}
        </div>
    );
};

export default BlockFooter;
