import { FC, HTMLProps, Children, isValidElement, cloneElement } from 'react';
import Legend from '@components/controls/Legend';
import { FieldInputProps, FieldMetaProps } from 'formik';
import { VisuallyHidden, useTheme } from '@scripts/gds';
import RadioItem, { RadioItemProps } from './Item';
import RadioAnother, { RadioAnotherProps } from './Another';

export interface RadioCompositionProps {
    Item: FC<RadioItemProps>;
    Another: FC<RadioAnotherProps>;
}

export interface RadioProps extends HTMLProps<HTMLInputElement> {
    /** Radio group name */
    name?: string;
    /** Formik field object (inner) */
    field?: FieldInputProps<string>;
    /** Formik meta object (inner) */
    meta?: FieldMetaProps<any>;
    /** Field legend */
    legend?: string;
    /** Visually hidden legend */
    isHiddenLegend?: boolean;
    /** Required field */
    required?: boolean;
    /** Hint text */
    hint?: string;
    /** View tabs of */
    tabsView?: boolean;
}

export const Radio: FC<RadioProps> & RadioCompositionProps = ({
    name,
    field,
    meta,
    children,
    legend,
    isHiddenLegend = false,
    required = true,
    hint,
    tabsView,
    ...props
}) => {
    const { colors } = useTheme();
    return (
        <fieldset>
            {isHiddenLegend ? (
                <VisuallyHidden>
                    <Legend as="legend" name={name} label={legend} required={required} hint={hint} meta={meta} />
                </VisuallyHidden>
            ) : (
                <Legend
                    as="legend"
                    css={{ color: colors?.grey900 }}
                    name={name}
                    label={legend}
                    required={required}
                    hint={hint}
                    meta={meta}
                />
            )}
            <div css={tabsView && { display: 'flex', border: `1px solid ${colors?.grey300}`, borderRadius: 2 }}>
                {children &&
                    Children.map(children, child => {
                        if (isValidElement(child)) {
                            return cloneElement(child, {
                                name,
                                field,
                                meta,
                                tabsView,
                                ...props,
                            });
                        }
                    })}
            </div>
        </fieldset>
    );
};

Radio.Item = RadioItem;
Radio.Another = RadioAnother;

export default Radio;
