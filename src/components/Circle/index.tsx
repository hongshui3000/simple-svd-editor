import { HTMLAttributes, FC } from 'react';
import { useTheme } from '@scripts/gds';

const Circle: FC<HTMLAttributes<HTMLSpanElement>> = props => {
    const { colors } = useTheme();
    return (
        <span
            css={{
                display: 'inline-block',
                verticalAlign: 'middle',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colors?.primary,
            }}
            {...props}
        />
    );
};

export default Circle;
