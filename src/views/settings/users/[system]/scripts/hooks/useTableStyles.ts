import { CSSObject } from '@emotion/core';
import { scale, useTheme } from '@greensight/gds';

export const useTableStyles = () => {
    const { colors } = useTheme();

    const h3Styles: CSSObject = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };
    const blockBodyStyles: CSSObject = {
        display: 'grid',
        gridTemplateColumns: `max-content`,
        justifyContent: 'space-between'
    };
    const dlStyles: CSSObject = { display: 'grid', gridTemplateColumns: "'1fr 1fr'", gridColumnStart: 'span 2' };
    const dtStyles: CSSObject = {
        padding: `${scale(1, true)}px ${scale(1)}px ${scale(1, true)}px 0`,
        borderBottom: `1px solid ${colors?.grey200}`,
        ':last-of-type': { border: 'none' },
    };
    const ddStyles: CSSObject = {
        padding: `${scale(1, true)}px 0`,
        borderBottom: `1px solid ${colors?.grey200}`,
        ':last-of-type': { border: 'none' },
    };

    return { h3Styles, blockBodyStyles, dlStyles, dtStyles, ddStyles };
}
