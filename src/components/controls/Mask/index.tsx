import { IMaskInput } from 'react-imask';
import { FieldHelperProps, FieldMetaProps, FieldInputProps } from 'formik';
import { useFieldCSS } from '@scripts/hooks';

export interface MaskProps {
    /** Mask for input */
    mask: string;
    /** Formik helpers object (inner) */
    helpers?: FieldHelperProps<string>;
    /** Placeholder for mask */
    placeholderChar?: string;
    /** Is show placholder */
    lazy?: boolean;
    /** from formik */
    field?: FieldInputProps<any>;
    /** from formik */
    meta?: FieldMetaProps<any>;
}

const Mask = ({ mask, meta, field, helpers, placeholderChar = '_', lazy = true, ...props }: MaskProps) => {
    const value = field?.value || undefined;
    const { basicFieldCSS } = useFieldCSS(meta);
    return (
        <IMaskInput
            mask={mask}
            value={value}
            {...props}
            css={basicFieldCSS}
            lazy={lazy}
            placeholderChar={placeholderChar}
            onAccept={(val: string) => {
                if (helpers) helpers.setValue(val);
            }}
        />
    );
};

export default Mask;
