import { HTMLProps, useMemo } from 'react';
import { FieldInputProps, FieldHelperProps, FormikValues, FieldMetaProps } from 'formik';
import { useTheme, scale, typography } from '@scripts/gds';
import { CSSObject } from '@emotion/core';

export interface RadioItemProps extends HTMLProps<HTMLInputElement> {
    /** Radio group name (inner) */
    name?: string;
    /** Formik field object (inner) */
    field?: FieldInputProps<string>;
    /** Value of radio item */
    value: string;
    /** Formik helpers object (inner) */
    helpers?: FieldHelperProps<string>;
    /** Values of Formik */
    values?: FormikValues;
    /** Meta from Formik */
    meta?: FieldMetaProps<any>;
    /** Change view of radio buttons */
    tabsView?: boolean;
}

export const RadioItem = ({ name, meta, field, value, children, tabsView, ...props }: RadioItemProps) => {
    delete props.values;
    delete props.helpers;

    const { colors } = useTheme();

    const id = `${name}-${value}`;
    const outerSize = scale(5, true);
    const innerSize = scale(1);

    const isError = meta?.touched && meta?.error;

    const commonStyles: CSSObject = useMemo(
        () => ({
            ...typography('bodySm'),
            cursor: 'pointer',
            color: colors?.grey900,
        }),
        [colors?.grey900]
    );

    const labelStyles: CSSObject = useMemo(
        () =>
            tabsView
                ? {
                      ...commonStyles,
                      display: 'grid',
                      placeItems: 'center',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      padding: `${scale(1, true)}px ${scale(2)}px`,
                      height: scale(4),
                      'input:focus + &': {
                          outline: `2px solid ${colors?.warning}`,
                      },
                      '.js-focus-visible input:focus:not(.focus-visible) + &': {
                          outline: 'none',
                      },
                      'input:disabled + &': {
                          color: colors?.grey700,
                          background: colors?.grey200,
                          cursor: 'not-allowed',
                      },
                      'input:checked + &': {
                          background: colors?.primary,
                          color: colors?.white,
                      },
                  }
                : {
                      ...commonStyles,
                      position: 'relative',
                      display: 'block',
                      paddingLeft: scale(4),
                      transition: `color ease 300ms`,
                      ':hover': {
                          '::before': {
                              borderColor: colors?.primary,
                          },
                      },
                      'input:disabled + &': {
                          color: colors?.grey800,
                          cursor: 'not-allowed',
                      },
                      '::before, ::after': {
                          content: '""',
                          position: 'absolute',
                          borderRadius: '50%',
                          transition: 'transform ease 300ms',
                      },
                      '::before': {
                          top: 0,
                          left: 0,
                          width: outerSize,
                          height: outerSize,
                          border: `1px solid ${isError ? colors?.danger : colors?.grey600}`,
                          'input:focus + &': {
                              outline: `2px solid ${colors?.warning}`,
                          },
                          '.js-focus-visible input:focus:not(.focus-visible) + &': {
                              outline: 'none',
                          },
                          'input:checked + &': {
                              backgroundColor: colors?.primary,
                          },
                          'input:disabled + &': {
                              borderColor: colors?.grey400,
                              backgroundColor: colors?.grey200,
                          },
                      },
                      '::after': {
                          position: 'absolute',
                          top: outerSize / 2,
                          left: outerSize / 2,
                          width: innerSize,
                          height: innerSize,
                          backgroundColor: colors?.primary,
                          transform: 'translate(-50%, -50%) scale(0)',
                          'input:checked + &': {
                              backgroundColor: colors?.white,
                              transform: 'translate(-50%, -50%) scale(1)',
                          },
                          'input:disabled + &': {
                              backgroundColor: colors?.grey800,
                          },
                      },
                  },
        [
            colors?.danger,
            colors?.grey200,
            colors?.grey400,
            colors?.grey600,
            colors?.grey700,
            colors?.grey800,
            colors?.primary,
            colors?.warning,
            colors?.white,
            commonStyles,
            innerSize,
            isError,
            outerSize,
            tabsView,
        ]
    );

    return (
        <div
            css={{
                ':not(:last-of-type)': tabsView
                    ? { borderRight: `1px solid ${colors?.grey300}` }
                    : { marginBottom: scale(1) },
            }}
        >
            <input
                {...field}
                {...props}
                type="radio"
                id={id}
                value={value}
                checked={field ? value === field?.value : undefined}
                css={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}
            />
            <label htmlFor={id} css={labelStyles}>
                {children}
            </label>
        </div>
    );
};

export default RadioItem;
