import { useMemo } from 'react';
import { CSSObject } from '@emotion/core';
import { useTheme, typography } from '@scripts/gds';
import { FieldMetaProps } from 'formik';

export const useFieldCSS = (meta?: FieldMetaProps<any>) => {
    const { components } = useTheme();
    const inputTheme = components?.Input;

    const isError = meta?.touched && meta?.error;

    const basicFieldCSS: CSSObject = useMemo<CSSObject>(
        () => ({
            width: '100%',
            minHeight: inputTheme?.height,
            padding: inputTheme?.padding,
            color: inputTheme?.color,
            border: `1px solid ${isError ? inputTheme?.errorBorderColor : inputTheme?.borderColor}`,
            borderRadius: inputTheme?.borderRadius,
            background: inputTheme?.bg,
            ...(inputTheme?.typography && typography(inputTheme?.typography)),
            ':focus': { outline: 'none', borderColor: inputTheme?.focusBorderColor },
            ':disabled': {
                background: inputTheme?.disabledBg,
                border: `1px solid ${inputTheme?.disabledBorderColor}`,
                color: inputTheme?.placeholderColor,
                cursor: 'not-allowed',
            },
            placeholder: { color: inputTheme?.placeholderColor },
        }),
        [
            inputTheme?.height,
            inputTheme?.padding,
            inputTheme?.color,
            inputTheme?.errorBorderColor,
            inputTheme?.borderColor,
            inputTheme?.borderRadius,
            inputTheme?.bg,
            inputTheme?.typography,
            inputTheme?.focusBorderColor,
            inputTheme?.disabledBg,
            inputTheme?.disabledBorderColor,
            inputTheme?.placeholderColor,
            isError,
        ]
    );

    const inputWrapperCSS: CSSObject = {
        position: 'relative',
        fill: inputTheme?.iconColor,
    };

    return { basicFieldCSS, inputWrapperCSS };
};
