import { useState, useMemo, ReactNode } from 'react';
import { useCombobox } from 'downshift';
import { FieldMetaProps, FieldInputProps, FieldHelperProps } from 'formik';
import { useQuery } from 'react-query';
import { CSSObject } from '@emotion/core';

import CrossIcon from '@icons/small/closed.svg';

import { scale, useTheme, typography } from '@scripts/gds';
import { useDebounce, useFieldCSS } from '@scripts/hooks';

import Loader from '@icons/spinner.svg';

export interface SearchItem {
    label: string | number | ReactNode;
    // any необходим, так как значение может быть асболютно любое
    value: any;
}

export interface SearchProps {
    /** асинхронная функция поиска */
    searchAsyncFunc: (inputValue: string) => Promise<SearchItem[]>;
    /** колбэк при выборе item */
    onSelect?: (searchedItem?: SearchItem | null) => void;
    /** минимальная длина слова для начала поиска */
    minInputLength?: number;
    /** вспомогательные значения формика */
    field?: FieldInputProps<any>;
    meta?: FieldMetaProps<any>;
    helpers?: FieldHelperProps<any>;
    /** Значение в поле по умолчанию */
    defaultInputValue?: string;
    /** Имя поля */
    name?: string;
}

const Autocomplete = ({
    searchAsyncFunc,
    onSelect,
    minInputLength = 1,
    helpers,
    field,
    defaultInputValue,
    name = '',
}: SearchProps) => {
    const { basicFieldCSS } = useFieldCSS();
    const { colors, shadows } = useTheme();

    const selectedItem = useMemo(
        () => (field ? { label: field.value?.label, value: field.value?.value } : undefined),
        [field]
    );

    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce<string>(inputValue);

    const {
        data: items,
        isLoading,
        isError,
        isIdle,
    } = useQuery({
        enabled: debouncedInputValue.length >= minInputLength,
        queryKey: [`autocomplete-${field?.name || name}`, debouncedInputValue],
        queryFn: () => searchAsyncFunc(debouncedInputValue),
    });

    const { isOpen, getMenuProps, reset, getInputProps, getComboboxProps, highlightedIndex, getItemProps } =
        useCombobox({
            inputValue,
            onInputValueChange: ({ inputValue: val }) => setInputValue(val || ''),
            itemToString: item => item?.label || '',
            items: items || [],
            selectedItem,
            onSelectedItemChange: changes => {
                if (helpers) helpers.setValue(changes.selectedItem);
                if (onSelect) onSelect(changes.selectedItem);
            },
        });

    const listItemStyles: CSSObject = useMemo(
        () => ({
            padding: scale(1),
            display: 'flex',
            ...typography('bodySm'),
        }),
        []
    );

    return (
        <div css={{ position: 'relative' }}>
            <div {...getComboboxProps()} css={{ display: 'flex', width: '100%' }}>
                <input
                    {...getInputProps({ id: field?.name, defaultValue: defaultInputValue })}
                    css={{
                        border: 'none',
                        borderRadius: 2,
                        paddingLeft: scale(1),
                        flexGrow: 1,
                        background: colors?.white,
                        ...basicFieldCSS,
                    }}
                />
                {isLoading ? (
                    <Loader
                        css={{ position: 'absolute', top: scale(1), right: scale(1) }}
                        width={scale(2)}
                        height={scale(2)}
                    />
                ) : null}
                {!isLoading && inputValue.length > 0 ? (
                    <button
                        type="button"
                        onClick={reset}
                        css={{
                            width: scale(3),
                            height: '100%',
                            fill: 'currentColor',
                            position: 'absolute',
                            right: scale(1, true),
                            display: 'grid',
                            placeItems: 'center',
                            ':hover': { opacity: 0.7 },
                        }}
                    >
                        <CrossIcon />
                    </button>
                ) : null}
            </div>
            <ul
                {...getMenuProps()}
                css={{
                    position: 'absolute',
                    top: scale(4),
                    left: 0,
                    width: '100%',
                    backgroundColor: colors?.white,
                    borderRadius: '0 0 4px 4px',
                    boxShadow: shadows?.small,
                    overflow: 'auto',
                    maxHeight: scale(54),
                    zIndex: 1,
                }}
            >
                {isOpen && (
                    <>
                        {/* eslint-disable */}
                        {isIdle ? (
                            <li css={{ ...listItemStyles, color: colors?.grey800 }}>Начните вводить</li>
                        ) : isLoading ? (
                            <li css={{ ...listItemStyles, color: colors?.grey800 }}>Поиск ...</li>
                        ) : isError ? (
                            <li css={{ ...listItemStyles, color: colors?.danger }}>Произошла ошибка</li>
                        ) : !items || items.length === 0 ? (
                            <li css={{ ...listItemStyles, color: colors?.grey800 }}>Ничего не найдено</li>
                        ) : (
                            items?.map((item, index) => (
                                <li
                                    key={`${item.value}-${index}`}
                                    {...getItemProps({
                                        item,
                                        index,
                                    })}
                                    css={{
                                        backgroundColor: highlightedIndex === index ? colors?.lightBlue : colors?.white,
                                        ...listItemStyles,
                                    }}
                                >
                                    {item.label}
                                </li>
                            ))
                        )}
                    </>
                )}
            </ul>
        </div>
    );
};

export default Autocomplete;
