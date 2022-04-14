import { ComponentsTheme, scale } from '@greensight/gds';
import tokens from '../../../public/tokens.json';

const { colors } = tokens;

export const Button: ComponentsTheme['Button'] = {
    base: {
        default: {
            borderRadius: 2,
            half: false,
        },
    },
    sizes: {
        sm: {
            height: scale(3),
            padding: scale(1),
            iconOffset: scale(1, true),
            iconSize: scale(2),
            typography: 'button',
        },
        md: {
            height: scale(4),
            padding: scale(3, true),
            iconOffset: scale(1),
            iconSize: scale(2),
            typography: 'buttonBold',
        },
    },
    themes: {
        primary: {
            default: {
                bg: colors.primary,
                color: colors.white,
            },
            hover: {
                bg: colors.primaryHover,
            },
            disabled: {
                bg: colors.grey200,
                color: colors.grey800,
            },
        },
        secondary: {
            default: {
                bg: colors?.white,
                border: colors.grey600,
                color: colors?.grey900,
            },
            hover: {
                border: colors.primary,
            },
            disabled: {
                border: colors.grey300,
                color: colors.grey800,
            },
        },
        outline: {
            default: {
                bg: colors?.white,
                color: colors.primary,
                border: colors.primary,
            },
            hover: {
                color: colors.primaryHover,
                border: colors.primaryHover,
            },
            disabled: {
                border: colors.grey300,
                color: colors.grey800,
            },
        },
        fill: {
            default: {
                bg: colors?.grey200,
                color: colors.grey900,
            },
            hover: {
                bg: colors.grey300,
            },
            disabled: {
                bg: colors.grey200,
                color: colors.grey800,
            },
        },
        ghost: {
            default: {
                bg: 'transparent',
                color: colors.grey900,
            },
            hover: {
                bg: colors.grey200,
            },
            disabled: {
                bg: colors.grey200,
                color: colors.grey800,
            },
        },
        dangerous: {
            default: {
                bg: 'transparent',
                color: colors.danger,
                border: colors.dangerDivider,
            },
            hover: {
                color: colors.secondaryHover,
            },
            disabled: {
                color: colors?.grey600,
                border: colors.grey300,
            },
        },
    },
};
