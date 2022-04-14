import { HTMLProps, ReactNode } from 'react';
import { useTheme } from '@scripts/gds';

interface OverlayProps extends HTMLProps<HTMLDivElement> {
    /** is overlay active */
    active: boolean;
    children: ReactNode;
}
const Overlay = ({ active, ...props }: OverlayProps) => {
    const { colors } = useTheme();

    return (
        <div
            css={{
                width: '100%',
                ...(active && {
                    '&::after': {
                        content: '""',
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: colors?.black,
                        opacity: 0.3,
                    },
                }),
            }}
            {...props}
        />
    );
};

export default Overlay;
