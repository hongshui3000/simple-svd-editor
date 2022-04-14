import { ReactNode, ElementType } from 'react';
import { FieldMetaProps, FormikValues, FieldHelperProps, FieldInputProps } from 'formik';
import { jsx } from '@emotion/core';
import { scale, useTheme, typography } from '@scripts/gds';
import { Form } from '@components/controls/Form';
import { FormMessageProps } from '@components/controls/Form/Message';
import { MergeElementProps } from '@scripts/utils';

export interface LegendBaseProps {
    /** Name for form (inner) */
    name?: string;
    /** Label for Legend */
    label?: string | ReactNode | null;
    /** Flag required for forms */
    required?: boolean;
    /** Hint for legend */
    hint?: string;
    /** Formik meta object (inner) */
    meta?: FieldMetaProps<any>;
    /** All values from Formik */
    values?: FormikValues;
    /** Formik helpers (inner) */
    helpers?: FieldHelperProps<any>;
    /** Type for form */
    type?: string;
    /** Formik field object (inner) */
    field?: FieldInputProps<any>;
    /** Success text */
    success?: string;
    /** Show message flag */
    showMessage?: boolean;
    /** Custom message text */
    messageText?: string;
    /** Message type */
    messageType?: FormMessageProps['type'];
}

export type LegendProps<P extends ElementType = 'label'> = {
    /** Use your own React component for render. */
    as?: P;
} & MergeElementProps<P, LegendBaseProps>;

export const Legend = <T extends ElementType = 'label'>({
    as,
    label,
    required = true,
    hint,
    meta,
    name,
    showMessage,
    messageType = 'warning',
    messageText = 'Есть изменения',
    ...props
}: LegendProps<T>) => {
    const { colors } = useTheme();
    delete props.id;
    delete props.field;
    delete props.helpers;

    return jsx(
        as || 'label',
        { htmlFor: name, css: { display: 'block', position: 'relative', paddingBottom: scale(1) }, ...props },
        <>
            <div>
                {label && typeof label === 'string' ? <span css={typography('bodySmBold')}>{label}</span> : label}
                {!required && (
                    <span css={{ ...typography('small'), marginLeft: scale(1, true) }}>(необязательное)</span>
                )}
            </div>
            {hint && (
                <div css={{ ...typography('bodySm'), color: colors?.grey800, marginTop: scale(1, true) }}>{hint}</div>
            )}
            {meta?.error && meta?.touched && <Form.Message message={meta.error} css={{ marginTop: scale(1, true) }} />}
            {!(meta?.error && meta?.touched) && showMessage ? (
                <Form.Message message={messageText} type={messageType} css={{ marginTop: scale(1, true) }} />
            ) : null}
        </>
    );
};

export default Legend;
