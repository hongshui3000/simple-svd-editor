import { useState, useMemo, useEffect, useRef } from 'react';
import { useCombobox } from 'downshift';
import { CSSObject } from '@emotion/core';

import { useTheme, scale } from '@scripts/gds';
import { useFieldCSS } from '@scripts/hooks';

import { useMessageColor } from '@components/controls/Form/Message';
import Legend from '@components/controls/Legend';

import ArrowIcon from '@icons/small/chevronDown.svg';
import CloseIcon from '@icons/small/closed.svg';

import { getLabel, getValue, SelectProps } from './types';

export const SelectSearch = ({
    name,
    field,
    meta,
    helpers,
    label,
    hint,
    required = true,
    items,
    defaultIndex,
    selectedItem: selectedItemFromProps,
    placeholder = '',
    heightProp,
    disabled = false,
    onChange,
    showMessage,
    placement = 'bottom',
    messageText,
    messageType = 'warning',
    isLegend,
    ...props
}: SelectProps) => {
    const borderColor = useMessageColor(messageType);
    const { components } = useTheme();
    // темы селекта и инпута
    const ST = components?.Select;
    const IT = components?.Input;

    const { basicFieldCSS, inputWrapperCSS } = useFieldCSS(meta);

    const [inputItems, setInputItems] = useState(items);
    const itemsRef = useRef(items);
    // to update internal state whet items prop changed
    useEffect(() => {
        if (itemsRef.current !== items) {
            setInputItems(items);
        }
    }, [items]);

    const {
        isOpen,
        openMenu,
        selectedItem,
        highlightedIndex,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        getComboboxProps,
        reset,
    } = useCombobox({
        items: inputItems,
        // фильтрация items по значению
        onInputValueChange: ({ inputValue }) => {
            setInputItems(
                items.filter(i =>
                    getLabel(i)
                        .toLowerCase()
                        .includes(inputValue?.toLowerCase() || '')
                )
            );
        },
        // приводит item к строковому значению
        itemToString: getLabel,
        initialHighlightedIndex: defaultIndex !== undefined ? defaultIndex : undefined,
        initialSelectedItem: defaultIndex !== undefined ? items[defaultIndex] : null,
        // Если селект контроллируется извне
        selectedItem: selectedItemFromProps,
        // Если используется в форме, то изменим selectedItem
        ...(field !== undefined && { selectedItem: items.find(item => item.value === field?.value) || null }),
        onSelectedItemChange: changes => {
            if (helpers) helpers.setValue(getValue(changes.selectedItem));
            if (onChange) onChange({ name: name || '', ...changes });
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
            messageType,
            messageText,
        }),
        [hint, label, messageText, messageType, meta, name, required, showMessage]
    );

    const selectedOptionCSS: CSSObject = {
        backgroundColor: ST?.hoverBg,
        color: ST?.hoverColor,
    };

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

    return (
        <div {...props} css={{ position: 'relative' }}>
            {(label || (isLegend && meta)) && <Legend {...legendProps} {...getLabelProps()} />}
            <div {...getComboboxProps({ css: inputWrapperCSS })}>
                <input
                    {...getInputProps({
                        css: {
                            ...basicFieldCSS,
                            ...(isOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
                            ...(showMessage && !(meta?.error && meta.touched) && { borderColor }),
                        },
                        disabled,
                        placeholder,
                        autoComplete: 'off',
                        onFocus: () => {
                            if (!isOpen) openMenu();
                        },
                    })}
                />
                {selectedItem?.value && (
                    <button
                        type="button"
                        disabled={disabled}
                        css={{
                            ...buttonStyles,
                            right: 30,
                            '::after': {
                                content: '""',
                                position: 'absolute',
                                right: 0,
                                height: scale(2),
                                width: 1,
                                background: IT?.iconColor,
                            },
                        }}
                        onClick={reset}
                    >
                        <CloseIcon />
                    </button>
                )}
                <button
                    type="button"
                    disabled={disabled}
                    {...getToggleButtonProps({
                        css: buttonStyles,
                    })}
                >
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
                        ...(isOpen && { border: ST?.menuBorder }),
                        ...(placement === 'top' && { bottom: optionHeight }),
                    },
                })}
            >
                {isOpen &&
                    inputItems.map((option, index) => (
                        <li
                            key={option.value}
                            {...getItemProps({
                                item: option,
                                index,
                                css: {
                                    ...basicFieldCSS,
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: optionHeight,
                                    background: ST?.bg,
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: 0,
                                    '&:focus, &:hover': selectedOptionCSS,
                                    ...(index === highlightedIndex && selectedOptionCSS),
                                    ...(option.value === selectedItem?.value && {
                                        background: `${ST?.selectedBg} !important`,
                                        color: `${ST?.selectedColor} !important`,
                                    }),
                                },
                            })}
                        >
                            {option.label}
                        </li>
                    ))}
            </ul>
        </div>
    );
};
