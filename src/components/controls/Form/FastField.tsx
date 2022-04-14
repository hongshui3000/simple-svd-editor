import { Children, isValidElement, FC, cloneElement } from 'react';
import { FastField, FastFieldProps } from 'formik';
import Legend from '@components/controls/Legend';
import { FieldProps } from '@components/controls/Form';
import BasicField from './BasicField';
import { FormFieldProps } from './Field';

export const FormFastField = ({
    name,
    children,
    label,
    isLegend = false,
    hint,
    Icon,
    iconCss,
    className,
    showMessage,
    messageText,
    messageType = 'warning',
    ...props
}: FormFieldProps) => {
    const inputProps = {
        type: 'text',
        ...props,
    };

    return (
        <div css={{ width: '100%' }} className={className}>
            <FastField name={name}>
                {({ field, meta, form }: FastFieldProps) =>
                    children ? (
                        <>
                            {Children.map(children, child => {
                                if (isValidElement(child)) {
                                    const formikProps: FieldProps<any> = {
                                        field,
                                        meta,
                                        helpers: form.getFieldHelpers(name),
                                        name,
                                        id: (child?.type as FC)?.displayName !== 'Legend' ? name : '',
                                        ...inputProps,
                                        ...child.props,
                                    };
                                    return (
                                        <>
                                            {((isLegend && meta) || label) && (
                                                <Legend
                                                    name={name}
                                                    meta={meta}
                                                    label={label}
                                                    hint={hint}
                                                    showMessage={showMessage}
                                                    messageText={messageText}
                                                    messageType={messageType}
                                                />
                                            )}
                                            {cloneElement(child, { ...formikProps })}
                                        </>
                                    );
                                }
                            })}
                        </>
                    ) : (
                        <BasicField
                            label={label}
                            isLegend={isLegend}
                            hint={hint}
                            Icon={Icon}
                            iconCss={iconCss}
                            field={field}
                            meta={meta}
                            name={name}
                            showMessage={showMessage}
                            messageText={messageText}
                            messageType={messageType}
                            {...inputProps}
                            {...props}
                        />
                    )
                }
            </FastField>
        </div>
    );
};

export default FormFastField;
