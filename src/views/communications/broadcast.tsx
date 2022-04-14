import { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useFormikContext } from 'formik';
import { scale, Button, Layout, typography } from '@scripts/gds';

import {
    useCommunicationsBroadcasts,
    useCommunicationsChannels,
    useCommunicationsStatuses,
    useCommunicationsTypes,
} from '@api/communications';

import Block from '@components/Block';
import FilePond from '@components/controls/FilePond';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Legend from '@components/controls/Legend';
import Switcher from '@components/controls/Switcher';
import Textarea from '@components/controls/Textarea';
import MultiSelect from '@components/controls/MultiSelect';
import LoadWrapper from '@components/controls/LoadWrapper';

import { prepareForSelect } from '@scripts/helpers';
import { ErrorMessages, FileTypes } from '@scripts/constants';

const roles = prepareForSelect([
    'Оператор продавца',
    'Администратор продавца',
    'Профессионал',
    'Реферальный партнер',
    'Неавторизованный пользователь',
]);

const users = prepareForSelect(['Дмитрий', 'Василий', 'Роман', 'Владилен', 'Иосиф', 'Илья', 'Мартин', 'Иван']);

const sellers = prepareForSelect(['ООО "Рога и копыта"', 'Ашан', 'Леруа Мерлен', 'Б.Ю. Александров', 'М.П. Почтомат']);

const UsersSelect = () => {
    const {
        values: { addAllUsers },
    } = useFormikContext();
    return addAllUsers ? null : (
        <Form.Field name="users" label="Пользователи" disabled={addAllUsers} css={{ marginTop: scale(2) }}>
            <MultiSelect items={users} />
        </Form.Field>
    );
};

const CommunicationsBroadcasts = () => {
    const {
        mutate: handlerBroadcastCreate,
        error: broadcastError,
        isLoading: isBroadcastsLoading,
    } = useCommunicationsBroadcasts();

    const { data: channelsData, isLoading: isChannelsLoading } = useCommunicationsChannels({});

    const convertedChannels = useMemo(
        () =>
            channelsData?.data?.map(c => ({
                value: c.id,
                label: c.name,
            })) || [],
        [channelsData?.data]
    );

    const { data: statusesData, isLoading: isStatusesLoading } = useCommunicationsStatuses({});

    const convertedStatuses = useMemo(
        () =>
            statusesData?.data?.map(c => ({
                value: c.id,
                label: c.name,
            })) || [],
        [statusesData?.data]
    );

    const { data: typesData, isLoading: isTypesLoading } = useCommunicationsTypes({});

    const convertedTypes = useMemo(
        () =>
            typesData?.data?.map(c => ({
                value: c.id,
                label: c.name,
            })) || [],
        [typesData?.data]
    );

    const [files, setFiles] = useState<File[]>([]);

    return (
        <PageWrapper h1="Массовая рассылка">
            <LoadWrapper
                isLoading={isBroadcastsLoading || isChannelsLoading || isStatusesLoading || isTypesLoading}
                error={broadcastError ? JSON.stringify(broadcastError) : undefined}
            >
                <Block>
                    <Block.Body>
                        <Form
                            initialValues={{
                                role: '',
                                seller: [],
                                channel: '',
                                users: [],
                                addAllUsers: false,
                                theme: '',
                                status: '',
                                type: '',
                                message: '',
                            }}
                            validationSchema={Yup.object().shape({
                                message: Yup.string().required(ErrorMessages.REQUIRED),
                                status: Yup.string().required(ErrorMessages.REQUIRED),
                                theme: Yup.string().required(ErrorMessages.REQUIRED),
                                channel: Yup.string().required(ErrorMessages.REQUIRED),
                                users: Yup.array().min(1, ErrorMessages.REQUIRED),
                            })}
                            onSubmit={async values => {
                                await handlerBroadcastCreate({
                                    user_ids: values?.users.map((u: { id: number }) => u.id),
                                    theme: values?.theme,
                                    type_id: values?.type ? +values?.type : undefined,
                                    status_id: values?.status ? +values?.status : undefined,
                                    message: values?.message,
                                    files: files.map(f => f.name),
                                });
                            }}
                        >
                            <Layout cols={1} css={{ maxWidth: scale(128) }}>
                                <Layout.Item col={1}>
                                    <Form.FastField name="role" label="Роли пользователей">
                                        <MultiSelect items={roles} />
                                    </Form.FastField>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="seller" label="Продавец">
                                        <Select items={sellers} />
                                    </Form.FastField>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="channel" label="Канал">
                                        <Select items={convertedChannels} />
                                    </Form.FastField>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="addAllUsers">
                                        <Switcher>Добавить всех пользователей</Switcher>
                                    </Form.FastField>
                                    <UsersSelect />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="theme" label="Тема" />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="status" label="Статус">
                                        <Select items={convertedStatuses} />
                                    </Form.FastField>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="type" label="Тип">
                                        <Select items={convertedTypes} />
                                    </Form.FastField>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="message">
                                        <Legend label={<p css={typography('h3')}>Сообщение</p>} />
                                        <Textarea />
                                    </Form.FastField>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <hr />
                                </Layout.Item>
                                <Layout.Item col={1} css={{ marginBottom: scale(3) }}>
                                    <p css={{ ...typography('h3'), marginBottom: scale(2) }}>Файлы</p>
                                    <Form.Field name="file">
                                        <FilePond onUpdateFiles={setFiles} acceptedFileTypes={FileTypes.IMAGES} />
                                    </Form.Field>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.Reset theme="outline">Очистить</Form.Reset>
                                    <Button theme="primary" type="submit" css={{ marginLeft: scale(2) }}>
                                        Создать рассылку
                                    </Button>
                                </Layout.Item>
                            </Layout>
                        </Form>
                    </Block.Body>
                </Block>
            </LoadWrapper>
        </PageWrapper>
    );
};

export default CommunicationsBroadcasts;
