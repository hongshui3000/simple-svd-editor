import { CSSObject } from '@emotion/core';
import { useSelect } from 'downshift';

import { useTheme, scale } from '@scripts/gds';
import { useFieldCSS } from '@scripts/hooks';

import { useMessageColor } from '@components/controls/Form/Message';
import Legend from '@components/controls/Legend';

import ArrowIcon from '@icons/small/chevronDown.svg';
import { SelectProps, getLabel, getValue } from './types';

export const SelectSimple = ({
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

    const { isOpen, selectedItem, highlightedIndex, getItemProps, getLabelProps, getMenuProps, getToggleButtonProps } =
        useSelect({
            items,
            // приводит item к строковому значению
            itemToString: getLabel,
            initialHighlightedIndex: defaultIndex !== undefined ? defaultIndex : undefined,
            initialSelectedItem: defaultIndex !== undefined ? items[defaultIndex] : null,
            // Если селект контроллируется извне
            selectedItem: selectedItemFromProps,
            onSelectedItemChange: changes => {
                if (helpers) helpers.setValue(getValue(changes.selectedItem));
                if (onChange) onChange({ name: name || '', ...changes });
            },
            // Если используется в форме, то изменим selectedItem
            ...(field !== undefined && { selectedItem: items.find(item => item.value === field?.value) || null }),
        });

    const legendProps = {
        as: 'div',
        name,
        label,
        required,
        hint,
        meta,
        showMessage,
        messageType,
        messageText,
    };

    const selectedOptionCSS: CSSObject = {
        backgroundColor: ST?.hoverBg,
        color: ST?.hoverColor,
    };

    const optionHeight = heightProp || ST?.optionHeight || 0;

    return (
        <div {...props} css={{ position: 'relative' }}>
            {(label || (isLegend && meta)) && <Legend {...legendProps} {...getLabelProps()} />}
            <div css={inputWrapperCSS}>
                <button
                    type="button"
                    {...getToggleButtonProps({
                        css: {
                            ...basicFieldCSS,
                            display: 'flex',
                            alignItems: 'center',
                            ...(getLabel(selectedItem).length === 0 && { color: IT?.placeholderColor }),
                            ...(isOpen && {
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                borderColor: IT?.focusBorderColor,
                            }),
                            ...(showMessage && !(meta?.error && meta.touched) && { borderColor }),
                        },
                        disabled,
                    })}
                >
                    {selectedItem?.label || placeholder}
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    {...getToggleButtonProps({
                        css: {
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            display: 'grid',
                            placeItems: 'center',
                            padding: `0 ${scale(1)}px`,
                            height: '100%',
                            ...(disabled && { cursor: 'not-allowed' }),
                        },
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
                    items.map((option, index) => (
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
