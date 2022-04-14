import Block from '@components/Block';
import Dropzone from '@components/controls/Dropzone';
import Form from '@components/controls/Form';
import { scale } from '@scripts/gds';
import { useFormikContext } from 'formik';
import { downloadFile } from '@api/common';

export const Files = () => {
    const { values, setFieldValue } = useFormikContext<{ files_to_delete: number[] }>();

    return (
        <Block css={{ padding: scale(3) }}>
            <Form.Field label="Прикрепите вложения" name="files">
                <Dropzone
                    onFileRemove={(index, file) => {
                        if (file?.id) {
                            setFieldValue('files_to_delete', [...values.files_to_delete, file?.id]);
                        }
                    }}
                    onFileClick={f => downloadFile(f.file, f.name)}
                />
            </Form.Field>
        </Block>
    );
};
