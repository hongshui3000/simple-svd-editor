import { ReactNode } from 'react';
import { scale, useTheme } from '@scripts/gds';
import BlockHeader from './BlockHeader';
import BlockBody from './BlockBody';
import BlockFooter from './BlockFooter';

interface BlockProps {
    children: ReactNode;
    className?: string;
}

const Block = ({ children, ...props }: BlockProps) => {
    const { shadows, colors } = useTheme();

    return (
        <section
            css={{ boxShadow: shadows?.big, width: '100%', backgroundColor: colors?.white, borderRadius: scale(1) }}
            {...props}
        >
            {children}
        </section>
    );
};

Block.Header = BlockHeader;
Block.Body = BlockBody;
Block.Footer = BlockFooter;

export default Block;
