import { useState } from 'react';
import { FilePond as ReactFilePond, FilePondProps as ReactFilePondProps, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import { useMount } from '@scripts/hooks';
import { labels } from './labels';
import { useFilePondStyles } from './styles';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

interface ComponentProps {
    imageLayout?: boolean;
    defaultFiles?: File[];
    onUpdateFiles?: (files: File[]) => void;
    field?: FieldInputProps<File[]>;
    meta?: FieldMetaProps<File[]>;
    helpers?: FieldHelperProps<File[]>;
}

export type FilePondProps = ComponentProps & ReactFilePondProps;

const getLabelIdle = (fewFiles = false) => `
    <div class="filepond--label-action">
        <div class="filepond--image-placeholder">
            <img src='/union.svg' alt="Иконка загрузки"/>
        </div>
        <p>Нажмите для загрузки файл${fewFiles ? 'ов' : 'а'} или</p>
        <p>перетащите ${fewFiles ? 'их' : 'его'} в эту область</p>
    </div>
`;

// !!! DEPRECATED !!! use Dropzone instead
const FilePond = ({
    imageLayout,
    maxFileSize = '10MB',
    maxTotalFileSize = '100MB',
    allowMultiple = true,
    maxFiles = 10,
    defaultFiles = [],
    onUpdateFiles,
    helpers,
    ...props
}: FilePondProps) => {
    delete props.meta;
    delete props.field;

    useMount(() => console.warn('Use Dropzone component instead of Filepond'));

    const [files, setFiles] = useState<File[]>(defaultFiles);

    const styles = useFilePondStyles();

    return (
        <div css={styles} className={`file-input${imageLayout ? ' image-preview' : ''}`}>
            <ReactFilePond
                files={files}
                onupdatefiles={fileItems => {
                    const newFiles = fileItems.map(f => f.file);
                    if (onUpdateFiles) onUpdateFiles(newFiles);
                    if (helpers) helpers.setValue(newFiles);
                    setFiles(newFiles);
                }}
                maxFileSize={maxFileSize}
                maxTotalFileSize={maxTotalFileSize}
                maxFiles={maxFiles}
                allowMultiple={allowMultiple}
                allowReorder
                labelIdle={getLabelIdle(allowMultiple && maxFiles !== 1)}
                styleButtonRemoveItemPosition="right"
                styleItemPanelAspectRatio="1:1"
                iconRemove={`<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM10.3536 5.64645C10.5488 5.84171 10.5488 6.15829 10.3536 6.35355L8.70711 8L10.3536 9.64645C10.5488 9.84171 10.5488 10.1583 10.3536 10.3536C10.1583 10.5488 9.84171 10.5488 9.64645 10.3536L8 8.70711L6.35355 10.3536C6.15829 10.5488 5.84171 10.5488 5.64645 10.3536C5.45118 10.1583 5.45118 9.84171 5.64645 9.64645L7.29289 8L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L8 7.29289L9.64645 5.64645C9.84171 5.45118 10.1583 5.45118 10.3536 5.64645Z"/>
                </svg>`}
                {...labels}
                {...props}
                // @ts-ignore
                credits={false}
            />
        </div>
    );
};

export default FilePond;
