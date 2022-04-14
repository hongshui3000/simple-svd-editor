import { useRef, useEffect, HTMLProps, Ref } from 'react';
import { useTheme, scale, typography } from '@scripts/gds';
import { FieldInputProps, FieldMetaProps, FieldHelperProps, FormikValues } from 'formik';
import CheckIcon from '@icons/check.svg';

export interface CheckboxProps extends HTMLProps<HTMLInputElement> {
    /** Formik field object (inner) */
    field?: FieldInputProps<string[]>;
    /** Active state indeterminate */
    isIndeterminate?: boolean;
    /** Are all values selected for indeterminate state */
    all?: boolean;
    /** Checkbox text with indeterminate state */
    indeterminate?: string;
    /** Ref for inner input */
    innerRef?: Ref<HTMLInputElement>;
    /** Additional class for label */
    labelClass?: string;
    /** Additional class */
    className?: string;
    /** Formik meta object (inner) */
    meta?: FieldMetaProps<any>;
    /** Formik helpers (inner) */
    helpers?: FieldHelperProps<any>;
    /** Values of Formik */
    values?: FormikValues;
    /** Additional classes from form (inner) */
    inputClasses?: string;
}

const Checkbox = ({
    name,
    field,
    value,
    meta,
    isIndeterminate = false,
    all = false,
    indeterminate,
    innerRef,
    children,
    className,
    css,
    checked: checkedFromProps,
    ...props
}: CheckboxProps) => {
    delete props.helpers;
    const { colors } = useTheme();
    const outerSize = scale(5, true);
    const id = `${name || field?.name}-${value}`;
    const ref = useRef<HTMLInputElement>(null);

    const isError = meta?.touched && meta?.error;

    useEffect(() => {
        if (!isIndeterminate) return;
        if (ref.current) ref.current.indeterminate = isIndeterminate;
        if (ref.current) ref.current.checked = all;
    }, [ref, all, indeterminate, isIndeterminate]);

    let checked: boolean | undefined = checkedFromProps;

    if (field) {
        if (typeof value === 'string' && Array.isArray(field?.value)) {
            checked = field?.value?.includes(value);
        } else if (typeof field?.value === 'boolean') {
            checked = field.value;
        }
    }

    return (
        <div className={className} css={css}>
            <input
                name={name}
                {...props}
                {...field}
                id={id}
                type="checkbox"
                checked={checked}
                value={value}
                ref={innerRef || ref}
                css={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}
            />
            <label
                htmlFor={id}
                css={{
                    minHeight: 19,
                    position: 'relative',
                    display: 'block',
                    paddingLeft: scale(4),
                    ...typography('bodySm'),
                    textAlign: 'left',
                    color: colors?.black,
                    cursor: 'pointer',
                    transition: 'color ease 300ms',
                    'input:disabled + &': {
                        color: colors?.grey600,
                        cursor: 'not-allowed',
                    },
                    '::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-2px',
                        left: 0,
                        width: outerSize,
                        height: outerSize,
                        border: `1px solid ${isError ? colors?.danger : colors?.grey600}`,
                        borderRadius: '2px',
                        background: colors?.white,
                        'input:focus + &': {
                            border: `1px solid ${colors?.primary}`,
                        },
                        '.js-focus-visible input:focus:not(.focus-visible) + &': {
                            outline: 'none',
                        },
                        'input:checked + &': {
                            background: colors?.primary,
                        },
                        'input:disabled + &': {
                            borderColor: colors?.grey400,
                            background: colors?.grey200,
                        },
                    },
                    ':hover': {
                        '::before': {
                            borderColor: colors?.primary,
                        },
                    },
                }}
            >
                <CheckIcon
                    css={{
                        position: 'absolute',
                        top: outerSize / 2 - 2,
                        left: outerSize / 2,
                        fill: colors?.white,
                        transform: 'translate(-50%, -50%) scale(0)',
                        transition: 'transform ease 300ms',
                        'input:checked + label &': {
                            transform: 'translate(-50%, -50%) scale(1)',
                        },
                        'input:disabled + label &': {
                            fill: colors?.grey600,
                        },
                    }}
                />
                {children}
            </label>
        </div>
    );
};

export default Checkbox;
