import { useState, HTMLProps } from 'react';
import type { SVGRIcon } from '@customTypes/index';
import { FieldInputProps, FieldHelperProps, FieldMetaProps } from 'formik';
import { useTheme, scale } from '@scripts/gds';
import { useFieldCSS } from '@scripts/hooks';
import ViewIcon from '@icons/view.svg';

export interface PasswordProps extends HTMLProps<HTMLInputElement> {
    /** Formik field object (inner) */
    field?: FieldInputProps<string>;
    /** Custom icon */
    Icon?: SVGRIcon;
    /** Formik helpers object (inner) */
    helpers?: FieldHelperProps<string>;
    /** Formik meta object (inner) */
    meta?: FieldMetaProps<string>;
}

const Password = ({ field, meta, Icon = ViewIcon, ...props }: PasswordProps) => {
    delete props.helpers;
    const [isVisible, setIsVisible] = useState(false);
    const { colors } = useTheme();
    const { basicFieldCSS } = useFieldCSS(meta);

    return (
        <div css={{ position: 'relative' }}>
            <input
                {...field}
                {...props}
                type={isVisible ? 'text' : 'password'}
                css={{ ...basicFieldCSS, ...(props.css as any), paddingRight: scale(6) }}
            />
            <div
                css={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: scale(6),
                    height: '100%',
                }}
            >
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    css={{
                        width: '100%',
                        height: '100%',
                        color: isVisible ? colors?.black : colors?.grey200,
                        transition: 'fill ease 300ms',
                        ':focus': { outlineOffset: -2 },
                    }}
                >
                    <Icon title={`${isVisible ? 'Скрыть' : 'Показать'} пароль`} css={{ fill: 'currentColor' }} />
                </button>
            </div>
        </div>
    );
};

export default Password;
