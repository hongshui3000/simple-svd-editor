import { scale, useTheme } from '@scripts/gds';

export const Marker = () => {
    const { colors } = useTheme();

    return (
        <span
            css={{
                width: 6,
                height: 6,
                display: 'inline-block',
                alignSelf: 'flex-start',
                background: colors?.success,
                borderRadius: '50%',
                marginLeft: scale(1, true),
                marginRight: scale(2),
                flexShrink: 0,
            }}
        />
    );
};
