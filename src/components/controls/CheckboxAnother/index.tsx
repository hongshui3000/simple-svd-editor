import { HTMLProps, useRef, ChangeEvent } from 'react';
import { FieldInputProps, FieldHelperProps, FormikValues } from 'formik';
import Checkbox from '@components/controls/Checkbox';
import Form from '@components/controls/Form';
import Textarea from '@components/controls/Textarea';

export interface CheckboxAnotherProps extends HTMLProps<HTMLInputElement> {
    /** Checkbox group name (inner) */
    name?: string;
    /** Formik field object (inner) */
    field?: FieldInputProps<string[]>;
    /** Value of checkbox item */
    value: string;
    /** Additional class */
    className?: string;
    /** Values of Formik (inner) */
    values?: FormikValues;
    /** Formik helpers object (inner) */
    helpers?: FieldHelperProps<string>;
}

export const CheckboxAnother = ({
    name,
    required,
    value,
    field,
    children,
    values,
    helpers,
    ...props
}: CheckboxAnotherProps) => {
    const inputProps = {
        field,
        type: 'checkbox',
        name: name as string,
        id: name as string,
        required,
        value,
        ...props,
    };

    const ref = useRef<HTMLInputElement>(null);

    const validateText = (text: string) => {
        const currentValue = (values as FormikValues)[name as string];
        const isHasVal = currentValue.find((item: string) => item === value);
        if (text.length) {
            if (ref.current) ref.current.checked = true;
            if (!isHasVal) currentValue.push(value);
            if (helpers) helpers.setValue(currentValue);
        } else {
            const index = currentValue.indexOf(value);
            if (ref.current) ref.current.checked = false;
            if (index !== -1) currentValue.splice(index, 1);
            if (helpers) helpers.setValue(currentValue);
        }
    };

    const handler = (e: ChangeEvent<HTMLTextAreaElement>) => validateText(e.target.value);

    return (
        <Checkbox {...inputProps} innerRef={ref}>
            {children}
            <Form.Field name={value}>
                <Textarea onFocus={handler} onInput={handler} onBlur={handler} />
            </Form.Field>
        </Checkbox>
    );
};

export default CheckboxAnother;
