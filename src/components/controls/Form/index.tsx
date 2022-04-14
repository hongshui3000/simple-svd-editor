import { FC, HTMLProps, ReactNode, ReactNodeArray } from 'react';
import {
    Formik,
    Form as FormikForm,
    FormikFormProps,
    FormikProps,
    FormikHelpers,
    FormikValues,
    FieldInputProps,
    FieldMetaProps,
    FieldHelperProps,
} from 'formik';
import * as Yup from 'yup';
import { CSSObject } from '@emotion/core';
import FormField, { FormFieldProps } from './Field';
import FormMessage, { FormMessageProps } from './Message';
import FormFastField from './FastField';
import FormReset, { FormResetProps } from './Reset';

export type NuberFieldValue = number | '';

export interface FormCompositionProps<T> {
    Field: FC<FormFieldProps>;
    Message: FC<FormMessageProps>;
    Reset: FC<FormResetProps<T>>;
    FastField: FC<FormFieldProps>;
}

export interface FormProps<T>
    extends FormikFormProps,
        Omit<HTMLProps<HTMLFormElement>, 'onSubmit' | 'ref' | 'onReset'> {
    /** Initial formik values */
    initialValues: T;
    /** Yup validation schema */
    validationSchema?: Yup.SchemaOf<any> | (() => Yup.SchemaOf<any>);
    /** Formik submit handler */
    onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>;
    /** Formik reset handler */
    onReset?: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>;
    /** enable reinitialize on initialvalues change */
    enableReinitialize?: boolean;
    children?: ReactNode | ReactNodeArray | ((props: FormikProps<T>) => ReactNode | ReactNodeArray);
}

export interface FieldProps<T> extends HTMLProps<HTMLInputElement> {
    /** `values` from `useFormikContext` */
    values: FormikValues;
    /** `field` from `useField` */
    field: FieldInputProps<T>;
    /** `meta` from `useField` */
    meta: FieldMetaProps<T>;
    /** `helpers` from `useField` */
    helpers: FieldHelperProps<T>;
    /** Field id. Equals name */
    id?: string;
    /** css object with form field styles */
    css?: CSSObject;
}

export const Form = <T,>({
    initialValues,
    validationSchema,
    onSubmit,
    onReset,
    children,
    enableReinitialize = false,
    ...props
}: FormProps<T> & Partial<FormCompositionProps<T>>) => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        onReset={onReset}
        enableReinitialize={enableReinitialize}
    >
        {formikProps => (
            <FormikForm noValidate {...props}>
                {typeof children === 'function' ? children(formikProps) : children}
            </FormikForm>
        )}
    </Formik>
);

Form.Field = FormField;
Form.Message = FormMessage;
Form.Reset = FormReset;
Form.FastField = FormFastField;

export default Form;
