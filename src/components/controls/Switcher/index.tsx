import { useEffect, useRef, HTMLProps, Ref } from 'react';
import { useTheme, scale, typography } from '@scripts/gds';
import { FieldInputProps, FieldMetaProps, FieldHelperProps } from 'formik';
import { CSSObject } from '@emotion/core';

export interface SwitcherProps extends HTMLProps<HTMLInputElement> {
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
    /** Switcher description */
    description?: string;
    css?: CSSObject;
    // Small size
    isSmall?: boolean;
}

const Switcher = ({
    name,
    field,
    value,
    isIndeterminate = false,
    all = false,
    indeterminate,
    innerRef,
    children,
    className,
    description,
    css,
    isSmall = false,
    ...props
}: SwitcherProps) => {
    delete props.helpers;
    delete props.meta;
    const { colors } = useTheme();
    const id = `${name}-${value}`;

    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!indeterminate) return;
        if (ref.current) ref.current.indeterminate = isIndeterminate;
        if (ref.current) ref.current.checked = all;
    }, [ref, all, indeterminate, isIndeterminate]);

    let checked: boolean | undefined;
    if (field) {
        if (typeof value === 'string') {
            checked = field?.value?.includes(value);
        } else if (typeof field?.value === 'boolean') checked = field.value;
    }
    return (
        <div className={className} css={css}>
            <input
                checked={checked}
                {...props}
                {...field}
                value={value}
                name={name}
                id={id}
                type="checkbox"
                ref={innerRef || ref}
                css={{
                    height: 0,
                    width: 0,
                    clip: 'rect(0 0 0 0)',
                    position: 'absolute',
                    '&:focus': {
                        outline: `none`,
                    },
                }}
            />
            <label
                htmlFor={id}
                css={{
                    display: 'flex',
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: scale(7),
                    cursor: 'pointer',
                    color: colors?.grey900,
                    zIndex: 0,
                    ...typography('bodySm'),

                    'input:disabled + &': {
                        color: colors?.grey600,
                    },
                    'input:focus + &': {
                        outline: `2px solid ${colors?.grey900}`,
                        outlineOffset: '4px',
                    },
                    '.js-focus-visible input:focus:not(.focus-visible) + &': {
                        outline: 'none',
                    },

                    ...(isSmall && { paddingLeft: scale(5) }),

                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 'calc(50% - 12px)',
                        left: 0,
                        display: 'block',
                        width: scale(6),
                        height: scale(3),
                        background: colors?.grey300,
                        borderRadius: '100px',
                        transition: 'background-color .2s',
                        zIndex: 1,
                        'input:checked + &': {
                            backgroundColor: colors?.primary,
                        },
                        'input:disabled + &': {
                            backgroundColor: colors?.grey200,
                            border: '1px solid #CDD2D7',
                            cursor: 'not-allowed',
                        },

                        ...(isSmall && { width: scale(4), height: scale(2), top: `calc(50% - ${scale(1)}px)` }),
                    },

                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 'calc(50% - 10px)',
                        left: '2px',
                        width: scale(5, true),
                        height: scale(5, true),
                        borderRadius: '100%',
                        transition: '.2s',
                        background: colors?.white,
                        boxShadow: '1px 1px 2px rgba(38, 41, 43, 0.2), 0px 1px 5px rgba(38, 41, 43, 0.2)',
                        zIndex: 2,
                        'input:checked + &': {
                            left: 'calc(46px)',
                            transform: 'translateX(-100%)',
                        },
                        'input:active:not(:disabled) + &': {
                            width: '24px',
                        },
                        'input:disabled + &': {
                            background: colors?.grey400,
                            cursor: 'not-allowed',
                        },

                        ...(isSmall && {
                            width: scale(3, true),
                            height: scale(3, true),
                            top: 'calc(50% - 6px)',
                            'input: checked + &': { left: '30px' },
                        }),
                    },
                }}
            >
                {children}
            </label>
            {description && (
                <span css={{ display: 'block', marginTop: scale(1), color: colors?.grey800 }}>{description}</span>
            )}
        </div>
    );
};

export default Switcher;
