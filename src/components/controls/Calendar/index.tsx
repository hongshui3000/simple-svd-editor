import { forwardRef, useCallback, useMemo, useState } from 'react';
import { startOfDay, startOfMonth, endOfDay } from 'date-fns';
import { useDidUpdateEffect } from '@scripts/hooks';

import { useTheme } from '@scripts/gds';
import { Header } from './components/header';
import { DaysTable } from './components/days-table';
import { YearsTable } from './components/years-table';
import { MonthsTable } from './components/months-table/index';

import { useCalendar } from './useCalendar';
import { limitDate, monthName } from './utils';
import { View, SelectorView } from './typings';

export type CalendarProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Вид по умолчанию (выбор дней, месяцев, лет)
     */
    defaultView?: View;

    /**
     * Вид шапки — месяц и год или только месяц
     */
    selectorView?: SelectorView;

    /**
     * Выбранная дата (timestamp)
     */
    value?: number;

    /**
     * Открытый месяц (timestamp)
     */
    month?: number;

    /**
     * Месяц, открытый по умолчанию (timestamp)
     */
    defaultMonth?: number;

    /**
     * Минимальная дата, доступная для выбора (timestamp)
     */
    minDate?: number;

    /**
     * Максимальная дата, доступная для выбора (timestamp)
     */
    maxDate?: number;

    /**
     * Начало выделенного периода (timestamp)
     */
    selectedFrom?: number;

    /**
     * Конец выделенного периода (timestamp)
     */
    selectedTo?: number;

    /**
     * Список событий
     */
    events?: Array<Date | number>;

    /**
     * Список выходных
     */
    offDays?: Array<Date | number>;

    /**
     * Обработчик изменения месяца (или года)
     */
    onMonthChange?: (month: number) => void;

    /**
     * Обработчик выбора даты
     */
    onChange?: (date: number) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
    (
        {
            className,
            defaultView = 'days',
            selectorView = 'full',
            value,
            month: monthTimestamp,
            minDate: minDateTimestamp,
            maxDate: maxDateTimestamp,
            defaultMonth: defaultMonthTimestamp = +new Date(),
            selectedFrom,
            selectedTo,
            offDays,
            events,
            onChange,
            onMonthChange,
            dataTestId,
        },
        ref
    ) => {
        const { components } = useTheme();
        const calendarTheme = components?.Calendar;

        const [view, setView] = useState<View>(defaultView);
        const [scrolled, setScrolled] = useState(false);

        const selected = useMemo(() => (value ? new Date(value) : undefined), [value]);

        const defaultMonth = useMemo(
            () => startOfMonth(selected || limitDate(defaultMonthTimestamp, minDateTimestamp, maxDateTimestamp)),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        );

        const month = useMemo(() => (monthTimestamp ? new Date(monthTimestamp) : undefined), [monthTimestamp]);

        const minDate = useMemo(
            () => (minDateTimestamp ? startOfDay(minDateTimestamp) : undefined),
            [minDateTimestamp]
        );

        const maxDate = useMemo(() => (maxDateTimestamp ? endOfDay(maxDateTimestamp) : undefined), [maxDateTimestamp]);

        const {
            activeMonth,
            weeks,
            months,
            years,
            canSetPrevMonth,
            canSetNextMonth,
            setMonthByDate,
            setPrevMonth,
            setNextMonth,
            highlighted,
            getDayProps,
            getMonthProps,
            getYearProps,
            getRootProps,
        } = useCalendar({
            month,
            defaultMonth,
            view,
            minDate,
            maxDate,
            selected,
            offDays,
            events,
            onChange,
            onMonthChange,
        });

        const toggleView = useCallback(
            (newView: View) => {
                setView(view === newView ? 'days' : newView);
            },
            [view]
        );

        const handleScroll = useCallback((scrollTop: number) => {
            setScrolled(scrollTop > 0);
        }, []);

        const handlePrevArrowClick = useCallback(() => {
            // TODO: Что должны делать стрелки при view !== days?
            setPrevMonth();
        }, [setPrevMonth]);

        const handleNextArrowClick = useCallback(() => {
            setNextMonth();
        }, [setNextMonth]);

        const handleMonthClick = useCallback(() => {
            toggleView('months');
        }, [toggleView]);

        const handleYearClick = useCallback(() => {
            toggleView('years');
        }, [toggleView]);

        useDidUpdateEffect(() => {
            setView('days');
        }, [activeMonth]);

        useDidUpdateEffect(() => {
            setScrolled(false);
        }, [view]);

        useDidUpdateEffect(() => {
            const newMonth = value && startOfMonth(value);
            if (newMonth && newMonth.getTime() !== activeMonth.getTime()) {
                setMonthByDate(newMonth);
            }
        }, [value]);

        return (
            <div
                {...getRootProps({ ref })}
                data-test-id={dataTestId}
                className={className}
                css={{
                    width: calendarTheme?.width,
                    height:
                        weeks.length === 6
                            ? (calendarTheme?.height || 0) + (calendarTheme?.daySize || 0)
                            : calendarTheme?.height,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    outline: 'none',
                    border: `1px solid ${calendarTheme?.borderColor}`,
                    borderRadius: `${calendarTheme?.borderRadius}%`,
                    boxShadow: calendarTheme?.shadow,
                    background: calendarTheme?.bg,
                }}
            >
                <Header
                    month={monthName(activeMonth)}
                    year={activeMonth.getFullYear().toString()}
                    prevArrowVisible={canSetPrevMonth}
                    nextArrowVisible={canSetNextMonth}
                    onPrevArrowClick={handlePrevArrowClick}
                    onNextArrowClick={handleNextArrowClick}
                    onMonthClick={handleMonthClick}
                    onYearClick={handleYearClick}
                    view={selectorView}
                    withShadow={scrolled}
                />

                <div
                    css={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxSizing: 'border-box',
                        flexGrow: 1,
                        overflow: 'hidden',
                        padding: `${calendarTheme?.containerPaddingY}px ${calendarTheme?.containerPaddingX}px`,
                    }}
                >
                    {view === 'days' && (
                        <DaysTable
                            weeks={weeks}
                            activeMonth={activeMonth}
                            selectedFrom={selectedFrom}
                            selectedTo={selectedTo}
                            getDayProps={getDayProps}
                            highlighted={highlighted}
                        />
                    )}

                    {view === 'months' && (
                        <MonthsTable selectedMonth={activeMonth} months={months} getMonthProps={getMonthProps} />
                    )}

                    {view === 'years' && (
                        <YearsTable
                            selectedYear={activeMonth}
                            years={years}
                            getYearProps={getYearProps}
                            onScroll={handleScroll}
                        />
                    )}
                </div>
            </div>
        );
    }
);

export default Calendar;
