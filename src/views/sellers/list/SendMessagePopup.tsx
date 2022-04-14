import { useState } from 'react';
import { FormikValues } from 'formik';

import { Button, scale } from '@scripts/gds';

import FilePond from '@components/controls/FilePond';

import Form from '@components/controls/Form';
import Select, { SelectItemProps } from '@components/controls/Select';
import Popup from '@components/controls/Popup';
import MultiSelect from '@components/controls/MultiSelect';
import Textarea from '@components/controls/Textarea';

export interface SendData extends FormikValues {
    files: File[];
}

const SendMessagePopup = ({
    onSubmit,
    isOpen,
    close,
    channels,
    statuses,
    sellers,
    types,
}: {
    onSubmit: (vals: FormikValues) => void;
    isOpen: boolean;
    close: () => void;
    channels: SelectItemProps[];
    statuses: SelectItemProps[];
    types: SelectItemProps[];
    sellers: SelectItemProps[];
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const onSubmitHandler = (values: FormikValues) => {
        onSubmit({
            ...values,
            files,
        });
    };

    return (
        <Popup
            isOpen={isOpen}
            onRequestClose={close}
            title="Отправить сообщение"
            popupCss={{ minWidth: scale(60) }}
            scrollInside
        >
            <Form
                onSubmit={onSubmitHandler}
                initialValues={{
                    seller: '',
                    channel: '',
                    subject: '',
                    status: '',
                    type: '',
                    message: '',
                }}
            >
                <Form.Field name="seller" label="Продавец" css={{ marginBottom: scale(2) }}>
                    <MultiSelect items={sellers} />
                </Form.Field>
                <Form.Field name="channel" label="Канал" css={{ marginBottom: scale(2) }}>
                    <Select items={channels} />
                </Form.Field>
                <Form.Field name="status" label="Статус" css={{ marginBottom: scale(2) }}>
                    <Select items={statuses} />
                </Form.Field>
                <Form.Field name="type" label="Тип" css={{ marginBottom: scale(2) }}>
                    <Select items={types} />
                </Form.Field>
                <Form.Field name="subject" label="Тема" css={{ marginBottom: scale(2) }} />
                <Form.Field name="message" label="Сообщение" css={{ marginBottom: scale(2) }}>
                    <Textarea />
                </Form.Field>
                <FilePond onUpdateFiles={setFiles} />
                <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Form.Reset theme="outline" onClick={close} css={{ marginRight: scale(2) }}>
                        Отменить
                    </Form.Reset>
                    <Button type="submit" theme="primary">
                        Создать чат
                    </Button>
                </div>
            </Form>
        </Popup>
    );
};

export default SendMessagePopup;
