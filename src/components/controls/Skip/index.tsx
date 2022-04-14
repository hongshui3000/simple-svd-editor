import { HTMLProps } from 'react';
import { scale, useTheme, typography } from '@scripts/gds';

export interface SkipProps extends HTMLProps<HTMLAnchorElement> {
    /** Anchor link ('#example') */
    link: string;
    /** Link text */
    children: string;
}

const Skip = ({ link, children, ...props }: SkipProps) => {
    const { colors } = useTheme();

    return (
        <a
            href={link}
            css={{
                position: 'absolute',
                top: '-100%',
                left: 0,
                padding: scale(1),
                borderBottomRightRadius: scale(1),
                ...typography('h2'),
                background: colors?.primary,
                color: colors?.white,
                zIndex: 1000,
                ':focus': { top: 0, outline: 'none' },
                ':hover': { backgroundColor: colors?.primaryHover },
            }}
            {...props}
        >
            {children}
        </a>
    );
};

export default Skip;
