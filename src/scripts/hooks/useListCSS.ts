import { CSSObject } from '@emotion/core';
import { useTheme, scale, typography } from '@scripts/gds';

export const useListCSS = () => {
    const { colors } = useTheme();

    const dlBaseStyles: CSSObject = { display: 'grid', gridTemplateColumns: "'1fr 1fr'" };
    const dtBaseStyles: CSSObject = {
        padding: `${scale(1)}px ${scale(1)}px ${scale(1)}px 0 `,
        borderBottom: `1px solid ${colors?.grey200}`,
        ...typography('bodySmBold'),
        ':last-of-type': { border: 'none' },
    };
    const ddBaseStyles: CSSObject = {
        padding: `${scale(1)}px 0`,
        borderBottom: `1px solid ${colors?.grey200}`,
        ':last-of-type': { border: 'none' },
    };

    return { dlBaseStyles, dtBaseStyles, ddBaseStyles };
};
