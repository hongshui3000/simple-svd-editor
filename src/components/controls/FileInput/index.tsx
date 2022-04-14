import { useState, useRef, HTMLProps } from 'react';
import { scale, useTheme, Button, VisuallyHidden } from '@scripts/gds';
import TrashIcon from '@icons/small/trash.svg';
import FileAttach from '@icons/small/fileAttach.svg';
import { FieldProps, FieldMetaProps, FieldHelperProps } from 'formik';
import { useMount } from '@scripts/hooks';

export interface FileInputProps extends HTMLProps<HTMLInputElement> {
    /** on change handler */
    onChangeHandler?: (file: File | null) => void;
    /** default uploaded file */
    defaultFile?: File | null;
    /** class name */
    className?: string;
    helpers?: FieldHelperProps<any>;
    field?: FieldProps;
    meta?: FieldMetaProps<any>;
}

// !!! DEPRECATED!!! use Dropzone instead
const FileInput = ({
    id,
    onChangeHandler,
    children,
    name = '',
    className,
    defaultFile = null,
    helpers,
    ...props
}: FileInputProps) => {
    delete props.field;
    delete props.meta;

    useMount(() => console.warn('Use Dropzone component instead of FileInput'));

    const { colors } = useTheme();
    const fieldId = id || `${name}`;
    const [file, setFile] = useState<File | null>(defaultFile);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const onChange = (f: File | null) => {
        setFile(f);
        if (onChangeHandler) onChangeHandler(f);
        if (helpers) helpers.setValue(f);
    };

    return (
        <>
            <div css={{ display: 'flex', alignItems: 'center' }} className={className}>
                <VisuallyHidden>
                    <input
                        type="file"
                        id={fieldId}
                        name={name}
                        onChange={e => {
                            if (e.currentTarget.files?.length) onChange(e.currentTarget.files[0]);
                        }}
                        ref={fileRef}
                        {...props}
                    />
                </VisuallyHidden>
                {!file ? (
                    <>
                        <label
                            htmlFor={fieldId}
                            css={{
                                cursor: 'pointer',
                                'input[data-focus-visible-added] + &': {
                                    outline: `2px solid ${colors?.primary} !important`,
                                    outlineOffset: '2px',
                                },
                            }}
                        >
                            <Button
                                type="button"
                                Icon={FileAttach}
                                theme="ghost"
                                hidden
                                css={{ pointerEvents: 'none' }}
                            >
                                Прикрепить
                            </Button>
                            Прикрепить файл
                        </label>
                        {children}
                    </>
                ) : (
                    <>
                        <span
                            css={{
                                marginRight: scale(1, true),
                                wordBreak: 'break-word',
                            }}
                        >
                            {file?.name}
                        </span>
                        <Button type="button" onClick={() => onChange(null)} Icon={TrashIcon} theme="ghost" hidden>
                            Удалить
                        </Button>
                    </>
                )}
            </div>
        </>
    );
};

export default FileInput;
