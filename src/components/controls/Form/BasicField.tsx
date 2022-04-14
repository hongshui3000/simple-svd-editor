import { forwardRef } from 'react';
import { FieldInputProps, FieldMetaProps } from 'formik';
import Legend from '@components/controls/Legend';
import { scale } from '@scripts/gds';
import { useFieldCSS } from '@scripts/hooks';
// eslint-disable-next-line import/no-cycle
import { FormFieldProps } from './Field';
import { FormMessageProps, useMessageColor } from './Message';

export interface BasicFieldProps extends Omit<FormFieldProps, 'name' | 'ref'> {
    field?: FieldInputProps<any>;
    meta?: FieldMetaProps<any>;
    className?: string;
    name?: string;
    /** Show message flag */
    showMessage?: boolean;
    /** Custom message text */
    messageText?: string;
    /** Message type */
    messageType?: FormMessageProps['type'];
}

export const BasicField = forwardRef<any, BasicFieldProps>(
    (
        {
            name,
            label,
            isLegend = false,
            hint,
            Icon,
            iconCss,
            field,
            meta,
            className,
            showMessage,
            messageText,
            messageType = 'warning',
            ...props
        },
        ref
    ) => {
        const { basicFieldCSS, inputWrapperCSS } = useFieldCSS(meta);
        const color = useMessageColor(messageType);
        const isError = meta?.touched && meta?.error;
        return (
            <>
                {((isLegend && meta) || label) && (
                    <Legend
                        name={name}
                        meta={!props?.disabled ? meta : undefined}
                        label={label}
                        hint={hint}
                        showMessage={showMessage}
                        messageText={messageText}
                        messageType={messageType}
                    />
                )}
                <div css={inputWrapperCSS} className={className}>
                    <input
                        id={name}
                        {...field}
                        {...props}
                        css={{
                            ...basicFieldCSS,
                            ...(Icon && { paddingRight: scale(4) }),
                            ...(!isError && showMessage && { borderColor: color }),
                        }}
                        ref={ref}
                    />
                    {Icon && (
                        <Icon
                            css={{
                                position: 'absolute',
                                right: scale(1),
                                top: '50%',
                                transform: 'translateY(-50%)',
                                ...iconCss,
                            }}
                        />
                    )}
                </div>
            </>
        );
    }
);

export default BasicField;
