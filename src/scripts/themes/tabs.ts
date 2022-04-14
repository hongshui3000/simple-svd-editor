import { scale } from '@greensight/gds';
import { TypographyParam } from '@scripts/gds';
import tokens from '../../../public/tokens.json';

const { colors } = tokens;

export type TabsTheme = {
    height: string | number;
    padding: string | number;
    borderWidth: number;
    borderColor: string;
    color: string;
    typography: TypographyParam;
    bg: string;

    // выбранный таб
    activeColor: string;
    activeBg: string;
    activeBorderColor: string;

    // маркер
    markerSize: number;
    markerBg: string;
    markerTop: number;
    markerRight: number;
    // отступ от слова до маркера
    markerMargin: number;

    // счетчик
    counterPadding: string | number;
    // отступ счетчика от слова
    counterMargin: string | number;
    counterColor: string;
    counterTypography: TypographyParam;
    counterBorder: string;
    counterBg: string;
    counterBorderRadius: number;
    counterDisabledBorderColor: string;
    counterDisabledBg: string;

    disabledColor: string;
    disabledBg: string;
};

export const Tabs: TabsTheme = {
    // значения для конкретного таба
    height: scale(6),
    padding: `0 ${scale(1)}px`,
    borderWidth: scale(1, true),
    borderColor: 'transparent',
    color: colors?.link,
    typography: 'bodyMd',
    bg: 'transparent',

    // выбранный таб
    activeColor: colors?.grey900,
    activeBg: colors?.white,
    activeBorderColor: colors.primary,

    // маркер
    markerSize: 6,
    markerBg: colors.success,
    markerTop: scale(1, true),
    markerRight: 0,
    // отступ от слова до маркера
    markerMargin: 4,

    // счетчик
    counterPadding: `0 ${scale(1, true)}px`,
    // отступ счетчика от слова
    counterMargin: scale(1, true),
    counterColor: colors?.link,
    counterTypography: 'smallBold',
    counterBorder: `1px solid ${colors?.infoDivider}`,
    counterBg: colors?.infoBg,
    counterBorderRadius: 2,
    counterDisabledBorderColor: colors?.grey400,
    counterDisabledBg: colors?.grey200,

    disabledColor: colors?.grey600,
    disabledBg: 'transparent',
};
