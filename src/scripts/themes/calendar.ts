import { scale } from '@greensight/gds';
import { TypographyParam } from '@scripts/gds';
import { Link } from '@scripts/hooks/useLinkCSS';
import tokens from '../../../public/tokens.json';

const { colors, shadows } = tokens;

export interface CalendarTheme {
    /* Настройки самого календаря */
    width: number;
    height: number;
    typography: TypographyParam;
    typographyForHighlight: TypographyParam;
    shadow: string;
    borderColor: string;
    borderRadius: number;
    bg: string;

    /* Отступы для контейнера */
    containerPaddingX: number;
    containerPaddingY: number;

    /* смотри тип Link в useLinkCSS */
    monthAndYearSelectionLinkType: Link;

    /* Настройки дня недели */
    dayOfWeekColor: string;
    dayOfWeekBg: string;

    /* День */
    daySize: number;
    dayBorderRadius: number;

    /* today */
    todayBorderColor: string;

    /* highlighted (hovered) */
    highlightedColor: string;
    highlightedBg: string;

    /* range */
    rangeColor: string;
    rangeBg: string;

    /* selected */
    selectedColor: string;
    selectedBg: string;

    /* disabled */
    disabledColor: string;
    disabledBg: string;

    /* marker для событий */
    markerBg: string;
    markerBorderRadius: number;
}

export const Calendar: CalendarTheme = {
    /* Настройки самого календаря */
    width: 268,
    height: 262,
    typography: 'bodySm',
    typographyForHighlight: 'bodySmBold',
    shadow: shadows.box,
    borderColor: colors?.grey300,
    borderRadius: 0,
    bg: colors.white,

    /* Отступы для контейнера */
    containerPaddingX: scale(1),
    containerPaddingY: scale(1),

    /* смотри тип Link в useLinkCSS */
    monthAndYearSelectionLinkType: 'blue',

    /* Настройки дня недели */
    dayOfWeekColor: colors?.grey600,
    dayOfWeekBg: colors?.white,

    /* День */
    daySize: scale(9, true),
    dayBorderRadius: 0,

    /* today */
    todayBorderColor: colors.white,

    /* highlighted (hovered) */
    highlightedColor: colors.black,
    highlightedBg: colors.grey300,

    /* range */
    rangeColor: colors.dark,
    rangeBg: colors.grey300,

    /* selected */
    selectedColor: colors.white,
    selectedBg: colors.primary,

    /* disabled */
    disabledColor: colors.grey600,
    disabledBg: `${colors?.white} !important`,

    /* marker для событий */
    markerBg: colors.danger,
    markerBorderRadius: 50,
};
