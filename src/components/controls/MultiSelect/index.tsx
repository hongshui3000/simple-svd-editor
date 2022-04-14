import { ReactNode, HTMLProps, useState, useCallback, useMemo, FC, useRef } from 'react';
import { CSSObject } from '@emotion/core';
import {
    useCombobox,
    useMultipleSelection,
    UseMultipleSelectionStateChange,
    UseMultipleSelectionState,
} from 'downshift';
import { FieldMetaProps, FieldHelperProps, FieldInputProps } from 'formik';
import AutosizeInput from 'react-input-autosize';

import { useTheme, scale } from '@scripts/gds';
import { useFieldCSS } from '@scripts/hooks';
import { FormMessageProps, useMessageColor } from '@components/controls/Form/Message';

import Legend from '@components/controls/Legend';

import ArrowIcon from '@icons/small/chevronDown.svg';
import CloseIcon from '@icons/small/closed.svg';

export interface SelectItemProps {
    /** Select option value */
    value: string | number | null;
    /** Select option text */
    label: ReactNode;
}

export type SelectedItem = SelectItemProps | null | undefined;

export type OnChangeProps = Partial<UseMultipleSelectionState<SelectItemProps>> & { name: string };

export interface SelectProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange' | 'value'> {
    /** Input name */
    name?: string;
    /** Formik meta object (inner) */
    meta?: FieldMetaProps<Array<SelectItemProps['value']>>;
    /** Formik helpers object (inner) */
    helpers?: FieldHelperProps<Array<SelectItemProps['value']>>;
    /** Formik field */
    field?: FieldInputProps<Array<SelectItemProps['value']>>;
    /** Label text */
    label?: string;
    /** Hint text */
    hint?: string;
    /** Required field */
    required?: boolean;
    /** Options list */
    items: SelectItemProps[];
    /** Select value */
    value?: Array<SelectItemProps['value']>;
    /** Change event handler */
    onChange?: (changes: OnChangeProps) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Select height */
    heightProp?: number;
    /** Show message flag */
    showMessage?: boolean;
    /** Custom message text */
    messageText?: string;
    /** Message type */
    messageType?: FormMessageProps['type'];
    /** inputValue from props */
    inputValue?: string;
    /** input value dispatcher */
    setInputValue?: (val: string) => void;
    /** isLoading flag, for autocomplete */
    isLoading?: boolean;
    /** isError flag, for autocomplete  */
    isError?: boolean;
    /** isIdle flag, for autocomplete  */
    isIdle?: boolean;
    /** Text when items array is [] */
    emptyText?: string | null;
}

export const getLabel = (item: SelectedItem) => {
    if (typeof item?.label === 'string') return item.label;
    if (item?.value) return item.value.toString();
    return '';
};

const MultiSelect: FC<SelectProps> = ({
    name,
    field,
    meta,
    helpers,
    label,
    hint,
    required = true,
    items,
    placeholder = '',
    heightProp,
    disabled = false,
    onChange,
    value,
    showMessage,
    messageText,
    messageType = 'warning',
    inputValue: inputValueFromProps,
    setInputValue: setInputValueFromProps,
    isLoading,
    isError,
    isIdle,
    emptyText = 'Список пуст',
    ...props
}) => {
    const borderColor = useMessageColor(messageType);

    const { components, colors } = useTheme();

    /** темы селекта и инпута */
    const ST = components?.Select;
    const IT = components?.Input;
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValueInner, setInputValueInner] = useState('');

    // выберем, как контроллируется инпут: извне или изнутри
    const inputValue = typeof inputValueFromProps !== 'undefined' ? inputValueFromProps : inputValueInner;
    const setInputValue = typeof setInputValueFromProps !== 'undefined' ? setInputValueFromProps : setInputValueInner;

    const { basicFieldCSS, inputWrapperCSS } = useFieldCSS(meta);

    const controlled = (typeof field?.value !== 'undefined' && helpers) || (onChange && typeof value !== 'undefined');
    const innerValue = field?.value || value;
    if (controlled && !Array.isArray(innerValue)) {
        throw new Error(`You must use array as initialValues for '${name}' field`);
    }

    const selectedItemsFromProps = useMemo(
        () =>
            innerValue?.reduce((acc, val) => {
                const findedItem = items.find(i => i.value === val);
                if (findedItem) acc.push(findedItem);
                return acc;
            }, [] as SelectItemProps[]),
        [innerValue, items]
    );

    const onSelectedItemsChange = useCallback(
        (changes: UseMultipleSelectionStateChange<SelectItemProps>) => {
            if (helpers && changes.selectedItems) helpers.setValue(changes.selectedItems.map(i => i.value));
            if (onChange) onChange({ name: name || '', ...changes });
        },
        [helpers, name, onChange]
    );

    const { getSelectedItemProps, getDropdownProps, addSelectedItem, removeSelectedItem, selectedItems, reset } =
        useMultipleSelection({
            ...(controlled && { selectedItems: selectedItemsFromProps, onSelectedItemsChange }),
        });

    const filteredItems = useMemo(
        () =>
            items.filter(item => {
                const selectedItem = selectedItems.find(selected => selected?.value === item.value);
                if (selectedItem) return false;

                if (inputValue.length === 0) return true;

                return getLabel(item).toLowerCase().includes(inputValue.toLowerCase());
            }),
        [inputValue, items, selectedItems]
    );

    const {
        isOpen,
        openMenu,
        highlightedIndex,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        getComboboxProps,
        selectItem,
    } = useCombobox({
        items: filteredItems,
        // приводит item к строковому значению
        itemToString: getLabel,
        stateReducer: (state, actionAndChanges) => {
            const { type, changes } = actionAndChanges;
            switch (type) {
                case useCombobox.stateChangeTypes.ItemClick:
                    return {
                        ...changes,
                        isOpen: state.isOpen, // keep menu open.
                    };
                default:
                    return changes; // otherwise business as usual.
            }
        },
        onStateChange: ({ inputValue, selectedItem, type }) => {
            switch (type) {
                case useCombobox.stateChangeTypes.InputChange:
                    setInputValue(inputValue || '');
                    break;
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    if (selectedItem) {
                        setInputValue('');
                        addSelectedItem(selectedItem);
                        // @ts-ignore
                        selectItem(null);
                    }
                    break;
                default:
                    break;
            }
        },
    });

    const legendProps = useMemo(
        () => ({
            as: 'div',
            name,
            label,
            required,
            hint,
            meta,
            showMessage,
            messageText,
            messageType,
        }),
        [hint, label, messageText, messageType, meta, name, required, showMessage]
    );

    const selectedOptionCSS: CSSObject = useMemo(
        () => ({
            backgroundColor: ST?.selectedBg,
            color: ST?.selectedColor,
        }),
        [ST?.selectedBg, ST?.selectedColor]
    );

    const optionHeight = heightProp || ST?.optionHeight || 0;

    const buttonStyles: CSSObject = useMemo(
        () => ({
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'grid',
            placeItems: 'center',
            padding: `0 ${scale(1)}px`,
            height: '100%',
            ':disabled': { cursor: 'not-allowed' },
            ':hover': { opacity: 0.8 },
        }),
        []
    );

    const SelectedItemElement: FC<{ item: SelectItemProps; index: number }> = ({ item, index }) => (
        <div
            css={{
                display: 'inline-flex',
                verticalAlign: 'top',
                alignItems: 'center',
                margin: 2,
                background: colors?.white,
                border: `1px solid ${colors?.grey300}`,
                padding: `2px ${scale(1)}px`,
                borderRadius: 2,
                height: scale(3),
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                overflow: 'hidden',
            }}
            {...getSelectedItemProps({ selectedItem: item, index })}
        >
            <span
                css={{
                    flexShrink: 1,
                    flexGrow: 1,
                    overflow: 'hidden',
                    width: 'calc(100% - 24px)',
                    textOverflow: 'ellipsis',
                }}
            >
                {item.label}
            </span>
            <button
                type="button"
                title="Remove"
                disabled={disabled}
                onClick={e => {
                    e.stopPropagation(); // we need this https://github.com/downshift-js/downshift/issues/1188#issuecomment-714571134
                    removeSelectedItem(item);
                }}
                css={{
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    marginLeft: scale(1, true),
                    '&:hover': { opacity: 0.8 },
                    ':disabled': { cursor: 'not-allowed' },
                }}
            >
                <CloseIcon />
            </button>
        </div>
    );

    const lastSelectedItemIndex = selectedItems.length - 1;

    const menuItemStyles: CSSObject = useMemo(
        () => ({
            ...basicFieldCSS,
            display: 'flex',
            alignItems: 'center',
            minHeight: optionHeight,
            background: ST?.bg,
            border: 'none',
            cursor: 'pointer',
            borderRadius: 0,
        }),
        [ST?.bg, basicFieldCSS, optionHeight]
    );
    const menuItemHoverStyles: CSSObject = useMemo(
        () => ({
            '&:focus, &:hover': selectedOptionCSS,
        }),
        [selectedOptionCSS]
    );

    const menuItemDisabled: CSSObject = useMemo(
        () => ({
            color: colors?.grey800,
            cursor: 'default',
        }),
        [colors?.grey800]
    );

    return (
        <div css={{ position: 'relative' }} {...props}>
            {label && <Legend {...legendProps} {...getLabelProps()} as="label" />}

            <div
                {...getComboboxProps({
                    css: {
                        ...inputWrapperCSS,
                        ...basicFieldCSS,
                        ...(isOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                        paddingRight: scale(8),
                        ':focus-within': { borderColor: IT?.focusBorderColor },
                        ...(showMessage && !(meta?.error && meta.touched) && { borderColor }),
                    },
                    onClick: e => {
                        if (e.currentTarget === e.target) {
                            inputRef?.current?.focus();
                        }
                    },
                })}
            >
                {selectedItems?.map((selectedItem, index) => {
                    if (index !== lastSelectedItemIndex)
                        return <SelectedItemElement key={selectedItem.value} item={selectedItem} index={index} />;
                    return null;
                })}

                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 1,
                        flexGrow: 0,
                        input: {
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            outline: 'none',
                            marginLeft: scale(1, true),
                            height: scale(3),
                            display: 'flex',
                            alignItems: 'center',
                            alignSelf: 'center',
                            flexShrink: 1,
                            flexGrow: 0,
                        },
                    }}
                >
                    {selectedItems.length > 0 ? (
                        <SelectedItemElement
                            item={selectedItems[lastSelectedItemIndex]}
                            index={lastSelectedItemIndex}
                        />
                    ) : null}
                    <AutosizeInput
                        {...getInputProps({
                            disabled,
                            placeholder: selectedItems.length === 0 ? placeholder : undefined,
                            autoComplete: 'off',
                            onFocus: () => {
                                if (!isOpen) openMenu();
                            },
                            onKeyDown: e => {
                                if (
                                    // @ts-ignore
                                    e.target?.value?.length === 0 &&
                                    e.key === 'Backspace' &&
                                    selectedItems.length > 0
                                ) {
                                    removeSelectedItem(selectedItems[lastSelectedItemIndex]);
                                }
                            },
                            ...getDropdownProps({ preventKeyAction: isOpen, ref: inputRef }),
                        })}
                    />
                </div>

                {selectedItems.length > 0 ? (
                    <button
                        type="button"
                        disabled={disabled}
                        css={{
                            ...buttonStyles,
                            right: 30,
                            ':after': {
                                content: '""',
                                position: 'absolute',
                                right: 0,
                                height: scale(2),
                                width: 1,
                                background: IT?.iconColor,
                            },
                        }}
                        onClick={() => reset()}
                    >
                        <CloseIcon />
                    </button>
                ) : null}
                <button type="button" disabled={disabled} {...getToggleButtonProps({ css: buttonStyles })}>
                    <ArrowIcon
                        css={{
                            transition: 'transform ease 300ms',
                            ...(isOpen && { transform: 'rotate(180deg)' }),
                        }}
                    />
                </button>
            </div>
            <ul
                {...getMenuProps({
                    css: {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        overflowY: 'auto',
                        maxHeight: optionHeight * (ST?.maxOptionsInView || 8),
                        zIndex: 100,
                        boxShadow: ST?.menuShadow,
                        borderRadius: ST?.menuBorderRadius,
                        ':focus': { outlineOffset: -2 },
                        ...(isOpen && filteredItems.length > 0 && { border: ST?.menuBorder, borderTop: 0 }),
                    },
                })}
            >
                {isOpen && (
                    <>
                        {/* eslint-disable */}
                        {isIdle ? (
                            <li css={{ ...menuItemStyles, ...menuItemDisabled }}>Начните вводить</li>
                        ) : isLoading ? (
                            <li css={{ ...menuItemStyles, ...menuItemDisabled }}>Поиск ...</li>
                        ) : isError ? (
                            <li css={{ ...menuItemStyles, ...menuItemDisabled, color: colors?.danger }}>
                                Произошла ошибка
                            </li>
                        ) : filteredItems.length === 0 && emptyText ? (
                            <li css={{ ...menuItemStyles, ...menuItemDisabled }}>{emptyText}</li>
                        ) : (
                            filteredItems.map((option, index) => (
                                <li
                                    key={option.value}
                                    {...getItemProps({
                                        item: option,
                                        index,
                                        css: {
                                            ...menuItemStyles,
                                            ...menuItemHoverStyles,
                                            ...(index === highlightedIndex && selectedOptionCSS),
                                        },
                                    })}
                                >
                                    {option.label}
                                </li>
                            ))
                        )}
                    </>
                )}
            </ul>
        </div>
    );
};

export default MultiSelect;
