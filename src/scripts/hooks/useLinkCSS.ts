import { rgba } from 'emotion-rgba';
import { CSSObject } from '@emotion/core';
import { useTheme } from '@scripts/gds';

export type Link = 'blue' | 'black' | 'grey';

const getLinkStyles = (color: string | undefined, hoverColor: string | undefined): CSSObject => ({
    fill: 'currentColor',
    color,
    svg: { verticalAlign: 'middle' },
    span: {
        borderBottomColor: rgba(color || '', 0.2),
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
    },
    ':hover': { color: hoverColor, span: { borderBottomColor: rgba(hoverColor || '', 0.2) } },
});

export const useLinkCSS = (type: Link = 'blue') => {
    const { colors } = useTheme();

    if (type === 'black') {
        return getLinkStyles(colors?.grey900, colors?.link);
    }

    if (type === 'grey') {
        return getLinkStyles(colors?.grey800, colors?.grey900);
    }

    return getLinkStyles(colors?.link, colors?.primaryHover);
};
