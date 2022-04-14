import { FC, ReactNodeArray, ReactNode } from 'react';
import { scale, useTheme } from '@scripts/gds';

export const TableHeader: FC<{ children: ReactNode | ReactNodeArray }> = props => {
    const { colors } = useTheme();

    return (
        <header
            css={{ background: colors?.white, padding: scale(2), display: 'flex', alignItems: 'center' }}
            {...props}
        />
    );
};
