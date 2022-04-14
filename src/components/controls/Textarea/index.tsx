import { HTMLProps, useState, ChangeEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { declOfNum } from '@scripts/helpers';
import { CSSObject } from '@emotion/core';
import { FieldInputProps, FieldMetaProps, FieldHelperProps } from 'formik';
import { scale, useTheme } from '@scripts/gds';

export interface TextareaProps extends Omit<HTMLProps<HTMLTextAreaElement>, 'ref'> {
    /** Input name (inner) */
    name?: string;
    /** Formik field object (inner) */
    field?: FieldInputProps<string>;
    /** Formik css object (inner) */
    css?: CSSObject;
    /** Minimum number of visible rows */
    minRows?: number;
    /** Maximum number of visible rows */
    maxRows?: number;
    /** Maximum length of value */
    maxLength?: number;
    /** Threshold in percentage of limit */
    threshold?: number;
    /** Formik meta object (inner) */
    meta?: FieldMetaProps<any>;
    /** Formik helpers (inner) */
    helpers?: FieldHelperProps<any>;
    /** resize flag */
    isResize?: boolean;
}

export const Textarea = ({
    name,
    value,
    field,
    css,
    meta,
    minRows = 3,
    maxRows,
    maxLength = 0,
    threshold = 0,
    isResize = false,
    ...props
}: TextareaProps) => {
    delete props.helpers;

    const [lenEnd, setLenEnd] = useState(maxLength);
    const [isExceed, setExceed] = useState(false);
    const isError = meta?.touched && meta?.error;
    const { colors } = useTheme();

    const handlerInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (maxLength) {
            const valLen = e.target.value.length;
            setLenEnd(maxLength - valLen);
            setExceed(valLen >= Math.max(maxLength, 0) * (Math.min(Math.max(threshold, 0), 100) / 100));
        }
    };

    const renderErrorMax = () => {
        if (Number.isInteger(maxLength)) {
            if (isExceed) {
                return (
                    <p id="exceeding-characters-info" aria-live="polite" style={{ color: lenEnd < 0 ? 'red' : '' }}>
                        {lenEnd >= 0 ? `У тебя осталось` : `Ты превышаешь на`} {Math.abs(lenEnd)}{' '}
                        {declOfNum(Math.abs(lenEnd), ['символ', 'символа', 'символов'])}
                    </p>
                );
            }
        }
        return '';
    };

    return (
        <>
            <TextareaAutosize
                name={name}
                value={value as string}
                minRows={minRows}
                maxRows={maxRows}
                {...field}
                onInput={handlerInput}
                aria-describedby={isExceed ? 'exceeding-characters-info' : ''}
                css={{
                    ...css,
                    width: '100%',
                    padding: scale(1),
                    borderRadius: 2,
                    background: colors?.grey100,
                    borderColor: isError ? colors?.danger : colors?.grey400,
                    ':focus': { borderColor: colors?.primary, outline: 'none' },
                    ...(!isResize && { resize: 'none' }),
                }}
                {...props}
            />
            {renderErrorMax()}
        </>
    );
};

export default Textarea;
