import { ReactNode, HTMLProps } from 'react';

import { UseSelectState } from 'downshift';
import { FieldMetaProps, FieldHelperProps, FieldInputProps } from 'formik';

import { FormMessageProps } from '@components/controls/Form/Message';

export interface SelectItemProps {
    /** Select option value */
    value: string | number | null;
    /** Select option text */
    label: ReactNode;
}

type SelectedItem = SelectItemProps | null | undefined;

export type OnChangeProps = Partial<UseSelectState<SelectItemProps | null>> & { name: string };

export interface SelectProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
    /** Input name */
    name?: string;
    /** Formik meta object (inner) */
    meta?: FieldMetaProps<any>;
    /** Formik helpers object (inner) */
    helpers?: FieldHelperProps<any>;
    /** Formik field */
    field?: FieldInputProps<any>;
    /** Label text */
    label?: string;
    /** Hint text */
    hint?: string;
    /** Required field */
    required?: boolean;
    /** Options list */
    items: SelectItemProps[];
    /** Index of option selected by default */
    defaultIndex?: number;
    /** Select option value */
    value?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Simple select without search */
    simple?: boolean;
    /** Select height */
    heightProp?: number;
    /** legend visible flag */
    isLegend?: boolean;
    /** Change event handler */
    onChange?: (changes: OnChangeProps) => void;
    /** Selected item */
    selectedItem?: SelectItemProps;
    /** Do we need filter options when typing */
    search?: boolean;
    /** Show message flag */
    showMessage?: boolean;
    /** Custom message text */
    messageText?: string;
    /** Message type */
    messageType?: FormMessageProps['type'];
    /** Dropdown placement */
    placement?: 'bottom' | 'top';
}

export const getLabel = (item: SelectedItem) => {
    if (typeof item?.label === 'string') return item.label;
    if (item?.value) return item.value.toString();
    return '';
};

export const getValue = (item: SelectedItem) => {
    if (item?.value) return item.value;
    return null;
};
