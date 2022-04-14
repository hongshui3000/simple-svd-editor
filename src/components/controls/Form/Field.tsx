import { ReactNode, HTMLProps, Children, isValidElement, cloneElement, FC } from 'react';
import { useField } from 'formik';
import Legend from '@components/controls/Legend';
import { FieldProps } from '@components/controls/Form';
import { CSSObject } from '@emotion/core';
import { SVGRIcon } from '@customTypes/index';
// eslint-disable-next-line import/no-cycle
import BasicField from './BasicField';
import { FormMessageProps } from './Message';

export interface FormFieldProps extends Omit<HTMLProps<HTMLInputElement>, 'label' | 'ref'> {
    /** Input name */
    name: string;
    /** Label for Legend */
    label?: string | ReactNode;
    /** legend visible flag */
    isLegend?: boolean;
    /** hint */
    hint?: string;
    /** Icon */
    Icon?: SVGRIcon;
    /** icon styles */
    iconCss?: CSSObject;
    /** class name */
    className?: string;
    /** Show message flag */
    showMessage?: boolean;
    /** Custom message text */
    messageText?: string;
    /** Message type */
    messageType?: FormMessageProps['type'];
}

export const FormField = ({
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
    const [field, meta, helpers] = useField(name);

    const inputProps = {
        type: 'text',
        name,
        ...props,
    };

    return (
        <div css={{ width: '100%' }} className={className}>
            {children ? (
                <>
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            const formikProps: FieldProps<any> = {
                                field,
                                meta,
                                helpers,
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
                    showMessage={showMessage}
                    messageText={messageText}
                    messageType={messageType}
                    {...inputProps}
                    {...props}
                />
            )}
        </div>
    );
};

export default FormField;
