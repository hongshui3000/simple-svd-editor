import { useState, useMemo, FC, useCallback } from 'react';
import { FieldHelperProps, FieldInputProps } from 'formik';
import { useQuery } from 'react-query';
import { useDebounce } from '@scripts/hooks';

import { apiClient } from '@api/index';
import MultiSelect, { SelectItemProps, SelectProps, OnChangeProps } from '../MultiSelect';

export interface AutocompleteProps extends Omit<SelectProps, 'field' | 'helpers' | 'items'> {
    /** Formik helpers object (inner) */
    helpers?: FieldHelperProps<SelectItemProps[]>;
    /** Formik field */
    field?: FieldInputProps<SelectItemProps[]>;
    /** Search request url */
    url: string;
    /** Min count of characters to start searching */
    minInputLength?: number;
    /** Function to prepare right data object for query */
    getQueryData?: (inputValue: string) => Record<string, any>;
    /** Function to tranform request result to select item type */
    transformQueryResult?: (data: any) => SelectItemProps[];
    /** on change handler */
    onChange?: (changes: OnChangeProps) => void;
}

const AutocompleteMulti: FC<AutocompleteProps> = ({
    field,
    helpers,
    minInputLength = 1,
    url,
    getQueryData = query => ({ filter: { query } }),
    transformQueryResult = data => data?.map((d: any) => ({ label: d.title, value: d.id })) || [],
    onChange: onChangeFromProps,
    ...props
}) => {
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce<string>(inputValue);

    const fieldValue = useMemo(() => field?.value || [], [field?.value]);
    const { data, isLoading, isError, isIdle } = useQuery({
        enabled: debouncedInputValue.length > minInputLength,
        queryKey: [`autocompleteMulti-${field?.name || props.name}`, getQueryData(debouncedInputValue)],
        queryFn: () => apiClient.post(url, { data: getQueryData(debouncedInputValue) }),
    });

    const items: SelectItemProps[] = useMemo(() => {
        const transformedQueryResult: SelectItemProps[] = transformQueryResult(data?.data);
        return [...fieldValue, ...transformedQueryResult.filter(r => !fieldValue.find(v => v.value === r.value))];
    }, [transformQueryResult, data?.data, fieldValue]);

    const value = useMemo(() => field?.value?.map(i => i.value) || [], [field?.value]);

    const onChange = useCallback(
        (changes: OnChangeProps) => {
            helpers?.setValue(changes.selectedItems || []);
            if (onChangeFromProps) onChangeFromProps(changes);
        },
        [helpers, onChangeFromProps]
    );

    return (
        <MultiSelect
            {...props}
            items={items}
            value={value}
            onChange={onChange}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            isError={isError}
            isIdle={isIdle}
            emptyText="Ничего не найдено"
        />
    );
};

export default AutocompleteMulti;
