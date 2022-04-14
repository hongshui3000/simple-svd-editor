import { scale } from '@greensight/gds';
import { TypographyParam, ColorsTheme } from '@scripts/gds';
import tokens from '../../../public/tokens.json';

const { colors } = tokens;

export type AccordionTheme = {
    itemBorderColor: keyof ColorsTheme | string;

    buttonTypography: TypographyParam;
    buttonColor: keyof ColorsTheme | string;
    buttonBg: keyof ColorsTheme | string;
    buttonPadding: string;
    buttonOutlineColor: keyof ColorsTheme | string;
    buttonIconColor: keyof ColorsTheme | string;
    buttonIconTopPosition: string | number;
    buttonIconRightPosition: string | number;

    pannelPadding: string | number;
    pannelBg: keyof ColorsTheme | string;
};

export const Accordion: AccordionTheme = {
    itemBorderColor: colors.grey400,

    buttonTypography: 'bodyMdBold',
    buttonColor: colors.primary,
    buttonBg: colors.grey100,
    buttonPadding: `${scale(1)}px ${scale(5)}px ${scale(1)}px ${scale(3, true)}px`,
    buttonOutlineColor: colors.warning,
    buttonIconColor: colors.grey800,
    buttonIconTopPosition: '50%',
    buttonIconRightPosition: scale(3, true),

    pannelPadding: `${scale(1)}px ${scale(3, true)}px`,
    pannelBg: colors?.white,
};
