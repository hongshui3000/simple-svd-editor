import { FC, HTMLProps } from 'react';
import { scale, useTheme } from '@scripts/gds';

export type FooterProps = HTMLProps<HTMLDivElement>;

export const Footer: FC<FooterProps> = props => {
    const { colors } = useTheme();
    return (
        <footer
            css={{
                padding: `${scale(2)}px ${scale(3)}px`,
                borderTop: `1px solid ${colors?.grey200}`,
                background: colors?.white,
                marginTop: 'auto',
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: scale(1),
                position: 'sticky',
                left: 0,
                right: 0,
                bottom: 0,
            }}
            {...props}
        />
    );
};
