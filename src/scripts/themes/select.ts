import { scale } from '@greensight/gds';
import tokens from '../../../public/tokens.json';

const { colors, shadows } = tokens;

/** Дополняет тему Input, тут определены специфические свойства, которые в Input не вмещаются */
export const Select = {
    // Настройки для опций
    bg: colors.white,
    hoverColor: colors?.grey900,
    hoverBg: colors?.lightBlue,
    selectedColor: colors?.white,
    selectedBg: colors?.primary,
    optionHeight: scale(4),
    // максимальное  количество опций в видимой части выпадающего меню
    maxOptionsInView: 8,

    // Настройка выпадающего меню
    menuBorder: `1px solid ${colors?.grey400}`,
    menuShadow: shadows.box,
    menuBorderRadius: '0 0 2px 2px',
};

export type SelectTheme = typeof Select;
