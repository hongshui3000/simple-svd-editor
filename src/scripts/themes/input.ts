import { scale } from '@greensight/gds';
import { TypographyParam } from '@scripts/gds';
import tokens from '../../../public/tokens.json';

const { colors } = tokens;

export type InputTheme = {
    padding: string | number;
    height: string | number;

    color: string;
    disabledColor: string;
    placeholderColor: string;

    iconColor: string;

    bg: string;
    disabledBg: string;

    typography: TypographyParam;

    borderRadius: 2;
    borderColor: string;
    disabledBorderColor: string;
    focusBorderColor: string;
    errorBorderColor: string;
};

export const Input: InputTheme = {
    padding: `${scale(1, true)}px ${scale(1)}px`,
    height: scale(4),

    color: colors?.grey900,
    disabledColor: colors?.grey600,
    placeholderColor: colors?.grey800,

    iconColor: colors?.grey800,

    bg: colors?.grey100,
    disabledBg: colors?.grey200,

    typography: 'bodySm',

    borderRadius: 2,
    borderColor: colors?.grey400,
    disabledBorderColor: colors?.grey400,
    focusBorderColor: colors?.primary,
    errorBorderColor: colors?.danger,
};
