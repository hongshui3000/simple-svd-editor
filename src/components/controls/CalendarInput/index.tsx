import {
    useCallback,
    useState,
    useRef,
    FocusEvent,
    KeyboardEvent,
    ChangeEvent,
    useEffect,
    MouseEvent,
    forwardRef,
} from 'react';
import { FieldInputProps, FieldMetaProps, FieldHelperProps } from 'formik';

import BasicField, { BasicFieldProps } from '@components/controls/Form/BasicField';
import Calendar, { CalendarProps } from '@components/controls/Calendar';
import { dateInLimits } from '@components/controls/Calendar/utils';
import Tooltip, { TippyProps } from '@components/controls/Tooltip';
import { useOnClickOutside } from '@scripts/hooks';

import CalendarIcon from '@icons/small/calendar.svg';

import {
    formatDate,
    MAX_DATE_STRING_LENGTH,
    MAX_DATE_STRING_LENGTH_WITH_DOTS,
    prepareInputValue,
    parseDateString,
} from './utils';
import Legend from '../Legend';

interface CalendarInputProps extends Omit<BasicFieldProps, 'onChange'> {
    /** Параметры формика */
    field?: FieldInputProps<number>;
    meta?: FieldMetaProps<number>;
    helpers?: FieldHelperProps<number>;

    /** Прятать ли календарик при выборе даты в календарике */
    hideCalendarOnChange?: boolean;

    calendarProps?: Omit<CalendarProps, 'minDate' | 'maxDate'>;

    /** Значение, контроллируемое извне */
    value?: number;
    /** Функция коллбэк, для контроля извне */
    onChange?: (date: number) => void;

    /** timestamp */
    minDate?: number;

    /** timestamp */
    maxDate?: number;

    /** Если  */
    onStateChange?: (changedValue: number) => void;

    /** Позиционирование типпи */
    placement?: TippyProps['placement'];
}

const CalendarInput = forwardRef<HTMLDivElement, CalendarInputProps>(
    (
        {
            field,
            helpers,
            hideCalendarOnChange = true,
            minDate = new Date('1950-01-01').getTime(),
            maxDate = new Date('2036-01-01').getTime(),
            calendarProps = {},
            disabled,
            value,
            onChange,
            placement = 'bottom-start',
            label,
            meta,
            name: nameFromProps,
            ...props
        },
        ref
    ) => {
        const controlled = (helpers && field?.value !== undefined) || (value !== undefined && onChange);
        const controlledValue = field?.value ?? value;
        const initiatorRef = useRef<'calendar' | 'input' | 'outside'>('outside');
        const name = field?.name || nameFromProps;
        const [open, setOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);
        const calendarRef = useRef<HTMLDivElement>(null);

        const [stateValue, setStateValue] = useState<number>();
        const calendarValue = controlled ? controlledValue : stateValue;
        const [inputValue, setInputValue] = useState<string>();

        useEffect(() => {
            if (controlled) {
                const formattedValue = formatDate(controlledValue);

                /** если обновился инпут, то нужно обновить значение формы */
                if (initiatorRef.current === 'input' && inputValue?.length === MAX_DATE_STRING_LENGTH_WITH_DOTS) {
                    const parsedDate = parseDateString(inputValue);
                    helpers?.setValue(parsedDate);
                    if (onChange) onChange(parsedDate);
                }

                /** Если значение controlledValue изменилось и не соответствует значению в инпуте */
                if (
                    (initiatorRef.current === 'outside' || initiatorRef.current === 'calendar') &&
                    formattedValue !== inputValue
                ) {
                    setInputValue(formatDate(controlledValue));
                }

                initiatorRef.current = 'outside';
            }
        }, [controlled, inputValue, helpers, controlledValue, onChange]);

        const handleKeyDown = useCallback(
            (event: KeyboardEvent<HTMLDivElement>) => {
                if ((event.target as HTMLElement).tagName === 'INPUT' && event.key === 'Enter') {
                    setOpen(!open);
                }

                if (event.key === 'Escape') {
                    setOpen(false);
                }
            },
            [open]
        );

        const handleClick = useCallback(() => {
            if (!open) setOpen(true);
        }, [open]);

        const handleBlur = useCallback(
            (e: FocusEvent<HTMLDivElement>) => {
                const target = (e.relatedTarget || document.activeElement) as HTMLDivElement;
                if (
                    calendarRef.current &&
                    calendarRef.current.contains(target) === false &&
                    !(containerRef.current && containerRef.current.contains(target))
                ) {
                    setOpen(false);
                }
            },
            [containerRef]
        );

        const handleInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
            if (['ArrowDown', 'ArrowUp'].includes(event.key) && calendarRef.current) {
                event.preventDefault();
                calendarRef.current.focus();
            }
        }, []);

        const handleCalendarChange = useCallback(
            (newDate: number) => {
                initiatorRef.current = 'calendar';
                const formattedDate = formatDate(newDate);
                setInputValue(formattedDate);
                if (hideCalendarOnChange) setOpen(false);
                if (controlled) {
                    helpers?.setValue(newDate);
                    if (onChange) onChange(newDate);
                } else {
                    setStateValue(newDate);
                }
            },
            [controlled, helpers, hideCalendarOnChange, onChange]
        );

        const handleInputChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                initiatorRef.current = 'input';
                const newInputValue = e.target.value.replace(/\D/g, '');

                if (newInputValue.length > MAX_DATE_STRING_LENGTH) return;
                const preparedNewInputValue = prepareInputValue(newInputValue);
                setInputValue(preparedNewInputValue);

                if (!controlled) {
                    setStateValue(parseDateString(preparedNewInputValue));
                }
            },
            [controlled]
        );

        const handleInputBlur = useCallback(
            (e: FocusEvent<HTMLInputElement>) => {
                const newDate = parseDateString(e.target.value);
                if (!dateInLimits(new Date(newDate), minDate, maxDate)) {
                    setInputValue('');
                    if (controlled) {
                        helpers?.setValue(NaN);
                        if (onChange) onChange(NaN);
                    } else {
                        setStateValue(NaN);
                    }
                }
                handleBlur(e);
            },
            [controlled, handleBlur, helpers, maxDate, minDate, onChange]
        );

        const handleCalendarWrapperMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
            /** Не дает инпуту терять фокус при выборе даты */
            event.preventDefault();
        }, []);

        useOnClickOutside(containerRef, () => setOpen(false));

        return (
            <>
                <Legend label={label} meta={meta} name={name} />
                <div css={{ position: 'relative' }} onKeyDown={disabled ? undefined : handleKeyDown} ref={containerRef}>
                    <Tooltip
                        visible={open}
                        theme="none"
                        content={
                            <div onMouseDown={handleCalendarWrapperMouseDown} role="presentation">
                                <Calendar
                                    ref={calendarRef}
                                    value={calendarValue}
                                    onChange={handleCalendarChange}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    {...calendarProps}
                                />
                            </div>
                        }
                        placement={placement}
                    >
                        <BasicField
                            Icon={CalendarIcon}
                            disabled={disabled}
                            {...props}
                            meta={meta}
                            autoComplete="off"
                            value={inputValue}
                            onChange={disabled ? undefined : handleInputChange}
                            onKeyDown={disabled ? undefined : handleInputKeyDown}
                            onBlur={disabled ? undefined : handleInputBlur}
                            onFocus={disabled ? undefined : handleClick}
                            ref={ref}
                        />
                    </Tooltip>
                </div>
            </>
        );
    }
);

export default CalendarInput;
