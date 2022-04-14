import { FC, RefCallback, useCallback, useRef } from 'react';
import cn from 'classnames';
import { isEqual, isLastDayOfMonth, isSameDay, isToday, isWithinInterval, startOfMonth } from 'date-fns';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Button, useTheme, typography } from '@scripts/gds';
import { usePrevious } from '@scripts/hooks';

import { WEEKDAYS, getSelectionRange } from '../../utils';
import { Day } from '../../typings';
import styles from './index.module.scss';

export type DaysTableProps = {
    /**
     * Массив-календарь недель
     */
    weeks?: Day[][];

    /**
     * Активный месяц
     */
    activeMonth?: Date;

    /**
     * Начало выделенного периода
     */
    selectedFrom?: Date | number;

    /**
     * Конец выделенного периода
     */
    selectedTo?: Date | number;

    /**
     * Подсвеченная дата (ховер)
     */
    highlighted?: Date | number;

    /**
     * Доп. пропсы для переданного дня
     */
    getDayProps: (day: Day) => Record<string, unknown> & { ref: RefCallback<HTMLButtonElement> };
};

export const DaysTable: FC<DaysTableProps> = ({
    weeks = [],
    activeMonth = new Date(),
    highlighted,
    selectedFrom,
    selectedTo,
    getDayProps,
}) => {
    const { components, colors } = useTheme();
    const calendarTheme = components?.Calendar;

    const activeMonthRef = useRef(activeMonth);

    activeMonthRef.current = activeMonth;

    const prevActiveMonth = usePrevious(activeMonth);

    const direction = prevActiveMonth && (activeMonth < prevActiveMonth ? 'right' : 'left');

    const selection = getSelectionRange(selectedFrom, selectedTo, highlighted);

    const renderHeader = useCallback(
        () =>
            WEEKDAYS.map(dayName => (
                <th
                    key={dayName}
                    css={{
                        ...typography(calendarTheme?.typography),
                        color: calendarTheme?.dayOfWeekColor,
                        backgroundColor: calendarTheme?.dayOfWeekBg,
                        width: calendarTheme?.daySize,
                        height: calendarTheme?.daySize,
                    }}
                >
                    {dayName}
                </th>
            )),
        [calendarTheme?.dayOfWeekBg, calendarTheme?.dayOfWeekColor, calendarTheme?.daySize, calendarTheme?.typography]
    );

    const renderDay = (day: Day) => {
        const daySelected =
            day.selected ||
            (selectedFrom && isSameDay(day.date, selectedFrom)) ||
            (selectedTo && isSameDay(day.date, selectedTo));

        const inRange = !daySelected && selection && isWithinInterval(day.date, selection);

        const firstDay = day.date.getDate() === 1;
        const lastDay = isLastDayOfMonth(day.date);

        const transitLeft = firstDay && inRange && selection && day.date > selection.start;
        const transitRight = lastDay && inRange && selection && day.date < selection.end;

        const rangeStart = selection && isSameDay(day.date, selection.start);

        const dayProps = getDayProps(day);

        return (
            <Button
                {...dayProps}
                ref={(node: any) => {
                    /**
                     * После анимации реф-коллбэк вызывается еще раз, и в него передается null и старый activeMonth.
                     * Поэтому приходится хранить актуальный месяц в рефе и сравнивать с ним.
                     */
                    if (startOfMonth(day.date).getTime() === activeMonthRef.current.getTime()) {
                        dayProps.ref(node as HTMLButtonElement);
                    }
                }}
                type="button"
                theme="ghost"
                size="sm"
                disabled={day.disabled}
                className={cn({
                    highlighted: highlighted && isEqual(day.date, highlighted),
                    selected: daySelected,
                    range: inRange,
                    rangeStart,
                    transitLeft,
                    transitRight,
                    today: isToday(day.date),
                    firstDay,
                    lastDay,
                    event: day.event,
                    disabled: day.disabled,
                })}
                css={{
                    position: 'relative',
                    width: calendarTheme?.daySize,
                    height: calendarTheme?.daySize,
                    display: 'grid',
                    placeItems: 'center',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    borderRadius: `${calendarTheme?.borderRadius}% !important`,
                    '&.event': {
                        '&::before': {
                            content: "''",
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            transform: 'translate(-50%, 50%)',
                            width: '6px',
                            height: '6px',
                            borderRadius: `${calendarTheme?.markerBorderRadius}%`,
                            background: calendarTheme?.markerBg,
                        },
                    },
                    '&.today': {
                        ...(calendarTheme?.typographyForHighlight && typography(calendarTheme?.typographyForHighlight)),
                        'span::after': {
                            content: "''",
                            border: `1px solid ${calendarTheme?.todayBorderColor}`,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: `${calendarTheme?.dayBorderRadius}%`,
                            boxSizing: 'border-box',
                        },
                    },
                    '&.highlighted': {
                        color: calendarTheme?.highlightedColor,
                        background: `${calendarTheme?.highlightedBg} !important`,
                    },
                    '&.disabled': {
                        pointerEvents: 'none',
                        color: calendarTheme?.disabledColor,
                        background: calendarTheme?.disabledBg,
                        cursor: 'default',
                    },
                    '&.range': {
                        color: calendarTheme?.rangeColor,
                        background: calendarTheme?.rangeBg,
                        borderRadius: 0,
                    },
                    '&.selected, &.disabled.selected': {
                        color: calendarTheme?.selectedColor,
                        background: `${calendarTheme?.selectedBg} !important`,
                        cursor: 'default',
                    },
                    '&.rangeStart': { cursor: 'pointer' },
                    '&.firstDay, &.lastDay': {
                        '&::after': {
                            transition: 'opacity 0.2s ease',
                            content: "''",
                            position: 'absolute',
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            pointerEvents: 'none',
                        },
                    },
                    '&.firstDay': {
                        '&::after': {
                            right: '100%',
                            background: `linear-gradient(
                                270deg,
                                ${calendarTheme?.rangeBg} 0%,
                                ${colors?.white} 100%
                            )`,
                        },
                    },
                    '&.lastDay': {
                        '&::after': {
                            left: '100%',
                            background: `linear-gradient(
                                270deg,
                                ${colors?.white} 0%,
                                ${calendarTheme?.rangeBg} 100%
                            )`,
                        },
                    },
                    '&.transitLeft, &.transitRight': {
                        '&::after': { opacity: 1 },
                    },
                    '&:focus': { zIndex: 1 },
                }}
            >
                {day.date.getDate()}
            </Button>
        );
    };

    const renderWeek = (week: Day[], weekIdx: number) => (
        <tr key={weekIdx}>
            {week.map((day: Day, dayIdx: number) => (
                <td key={day ? day.date.getTime() : dayIdx}>{day && renderDay(day)}</td>
            ))}
        </tr>
    );

    return (
        <table
            width="100%"
            className={cn(direction && styles[direction])}
            css={{
                borderCollapse: 'collapse',
                borderSpacing: 0,
                position: 'relative',
                th: { padding: 0 },
                td: {
                    '&:first-of-type .transitLeft': {
                        background: `linear-gradient(270deg, ${calendarTheme?.rangeBg} 0%, ${colors?.white} 100%)`,
                        '&::after': { display: 'none' },
                    },
                    '&:last-of-type .transitRight': {
                        background: `linear-gradient(270deg, ${colors?.white} 0%, ${calendarTheme?.rangeBg} 100%)`,
                        '&::after': { display: 'none' },
                    },
                },
            }}
        >
            <thead>
                <tr>{renderHeader()}</tr>
            </thead>
            <TransitionGroup component={null}>
                <CSSTransition
                    key={activeMonth.getTime()}
                    timeout={300}
                    classNames={{
                        enter: styles.daysEnter,
                        enterActive: styles.daysEnterActive,
                        exit: styles.daysExit,
                        exitActive: styles.daysExitActive,
                    }}
                >
                    <tbody>{weeks.map(renderWeek)}</tbody>
                </CSSTransition>
            </TransitionGroup>
        </table>
    );
};
