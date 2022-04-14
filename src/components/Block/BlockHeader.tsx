import { ReactNode } from 'react';
import { scale, useTheme } from '@scripts/gds';

export interface BlockHeaderProps {
    className?: string;
    children?: ReactNode;
}

const BlockHeader = ({ className, children }: BlockHeaderProps) => {
    const { colors } = useTheme();

    return (
        <div
            className={className}
            css={{
                borderBottom: `1px solid ${colors?.grey400}`,
                padding: `${scale(2)}px ${scale(3)}px`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: scale(8),
                flexWrap: 'wrap',
            }}
        >
            {children}
        </div>
    );
};

export default BlockHeader;
