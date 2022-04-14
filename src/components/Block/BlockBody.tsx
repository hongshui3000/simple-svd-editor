import { ReactNode } from 'react';
import { scale } from '@scripts/gds';

export interface BlockBodyProps {
    className?: string;
    children?: ReactNode;
}

const BlockBody = ({ className, children }: BlockBodyProps) => (
    <div
        className={className}
        css={{
            padding: `${scale(2)}px ${scale(3)}px`,
        }}
    >
        {children}
    </div>
);

export default BlockBody;
