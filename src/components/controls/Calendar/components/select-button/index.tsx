import { ButtonHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';
import { Button, typography, useTheme } from '@scripts/gds';

export type SelectButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Вид кнопки
     */
    view?: 'default' | 'filled' | 'outlined' | 'selected';
};

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(
    ({ className, children, view = 'default', ...restProps }, ref) => {
        const { components } = useTheme();
        const calendarTheme = components?.Calendar;

        return (
            <Button
                {...restProps}
                ref={ref}
                theme="ghost"
                size="sm"
                className={cn(className, view)}
                css={{
                    display: 'grid',
                    placeItems: 'center',
                    height: calendarTheme?.daySize,
                    ':hover': {
                        color: `${calendarTheme?.highlightedColor} !important`,
                        background: `${calendarTheme?.highlightedBg} !important`,
                    },
                    '&.selected': {
                        color: calendarTheme?.selectedColor,
                        background: calendarTheme?.selectedBg,
                    },
                    '&:disabled': {
                        color: `${calendarTheme?.disabledColor} !important`,
                        background: `${calendarTheme?.disabledBg} !important`,
                    },
                    '&.outlined':
                        calendarTheme?.typographyForHighlight && typography(calendarTheme?.typographyForHighlight),
                }}
            >
                {children}
            </Button>
        );
    }
);
