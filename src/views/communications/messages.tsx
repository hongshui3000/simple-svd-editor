import { useState, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { scale, Button, Layout, useTheme, typography } from '@scripts/gds';
import { useRouter } from 'next/router';
import { CSSObject } from '@emotion/core';
import { format } from 'date-fns';
import * as Yup from 'yup';

import { chatsUnread } from '@scripts/mock';
import {
    useCommunicationsChats,
    useCommunicationsCreateChat,
    useCommunicationsUpdateChat,
    useCommunicationsMessages,
    useCommunicationsPostNewMessage,
    useCommunicationsChannels,
    useCommunicationsStatuses,
    useCommunicationsTypes,
} from '@api/communications';

import { prepareForSelect } from '@scripts/helpers';
import { ErrorMessages, FileTypes, ITEMS_PER_COMMUNICATIONS_CHATS_PAGE } from '@scripts/constants';

import Block from '@components/Block';
import FilePond from '@components/controls/FilePond';
import PageWrapper from '@components/PageWrapper';

import OldTable, { expandableRowInfoProps } from '@components/OldTable';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Select from '@components/controls/Select';
import Legend from '@components/controls/Legend';
import Switcher from '@components/controls/Switcher';
import Textarea from '@components/controls/Textarea';
import Pagination from '@components/controls/Pagination';
import MultiSelect from '@components/controls/MultiSelect';
import LoadWrapper from '@components/controls/LoadWrapper';

import { useFiltersHelper } from '@hooks/useFiltersHelper';

import PlusIcon from '@icons/small/plus.svg';
import { useError } from '@context/modal';
import { CELL_TYPES } from '@scripts/enums';

const columns = [
    {
        Header: ' ',
        accessor: 'unread',
        getProps: () => ({ type: CELL_TYPES.DOT }),
    },
    {
        Header: 'Тема',
        accessor: 'theme',
    },
    {
        Header: 'Пользователь',
        accessor: 'user',
    },
    {
        Header: 'Канал',
        accessor: 'channel',
    },
    {
        Header: 'ID коммуникации',
        accessor: 'chatId',
    },
    {
        Header: 'Последнее сообщение',
        accessor: 'lastMsgData',
        getProps: () => ({ type: CELL_TYPES.DATE_TIME }),
    },
    {
        Header: 'Статус',
        accessor: 'status',
    },
    {
        Header: 'Тип',
        accessor: 'type',
    },
];

/** TODO add roles */
const roles = prepareForSelect([
    'Оператор продавца',
    'Администратор продавца',
    'Профессионал',
    'Реферальный партнер',
    'Неавторизованный пользователь',
]);

/** TODO add sellers */
const sellers = prepareForSelect(['ООО "Рога и копыта"', 'Ашан', 'Леруа Мерлен', 'Б.Ю. Александров', 'М.П. Почтомат']);

/** TODO add users */
const users = prepareForSelect(['Дмитрий', 'Василий', 'Роман', 'Владилен', 'Иосиф', 'Илья', 'Мартин', 'Иван']);

const UsersSelect = () => {
    const {
        values: { addAllUsers },
    } = useFormikContext();
    return addAllUsers ? null : (
        <Form.Field name="users" label="Пользователи" disabled={addAllUsers}>
            <MultiSelect items={users} />
        </Form.Field>
    );
};

const CreatePopup = ({
    isOpen,
    close,
    convertedChannels,
    convertedStatuses,
    convertedTypes,
}: {
    isOpen: boolean;
    close: () => void;
    convertedChannels: any;
    convertedStatuses: any;
    convertedTypes: any;
}) => {
    const {
        mutate: handlerPostNewChat,
        isLoading: isLoadingPostNewChat,
        error: postNewChatError,
    } = useCommunicationsCreateChat();

    return (
        <Popup isOpen={isOpen} onRequestClose={close} title="Создание чата" scrollInside>
            <LoadWrapper
                isLoading={isLoadingPostNewChat}
                error={postNewChatError ? JSON.stringify(postNewChatError) : undefined}
            >
                <Form
                    initialValues={{
                        roles: [],
                        seller: '',
                        channel: '',
                        users: [],
                        addAll: false,
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
                    })}
                    onSubmit={async (values: any) => {
                        handlerPostNewChat({
                            user_id: values?.users.map((u: { id: number }) => u.id),
                            theme: values?.theme,
                            type_id: values?.type,
                            channel_id: values?.channel,
                            status_id: values?.status,
                        });
                        close();
                    }}
                >
                    <Layout cols={1} gap={scale(1)}>
                        <Form.FastField name="roles" label="Роли пользователей">
                            <MultiSelect items={roles} />
                        </Form.FastField>

                        <Form.FastField name="seller" label="Продавец">
                            <Select items={sellers} />
                        </Form.FastField>

                        <Form.FastField name="channel" label="Канал">
                            <Select items={convertedChannels} />
                        </Form.FastField>

                        <Form.FastField name="addAllUsers">
                            <Switcher css={{ margin: `${scale(1)}px 0` }}>Добавить всех пользователей</Switcher>
                        </Form.FastField>

                        <UsersSelect />

                        <Form.FastField name="theme" label="Тема" />

                        <Form.FastField name="status" label="Статус">
                            <Select items={convertedStatuses} />
                        </Form.FastField>

                        <Form.FastField name="type" label="Тип">
                            <Select items={convertedTypes} />
                        </Form.FastField>

                        <Form.FastField name="message">
                            <Legend label="Сообщение" />
                            <Textarea />
                        </Form.FastField>

                        <p>Файлы</p>
                        <FilePond maxFileSize="10MB" maxTotalFileSize="100MB" />

                        <Button theme="primary" type="submit">
                            Создать чат
                        </Button>
                    </Layout>
                </Form>
            </LoadWrapper>
        </Popup>
    );
};

const EditPopup = ({
    isOpen,
    close,
    editData,
    convertedStatuses,
    convertedTypes,
}: {
    isOpen: boolean;
    close: () => void;
    editData: any;
    convertedStatuses: any;
    convertedTypes: any;
}) => {
    const {
        mutate: handlerPostUpdateChat,
        isLoading: isLoadingPostUpdateChat,
        error: postUpdateChatError,
    } = useCommunicationsUpdateChat();

    useError(postUpdateChatError);

    return (
        <Popup isOpen={isOpen} onRequestClose={close} title="Редактирование чата">
            <LoadWrapper isLoading={isLoadingPostUpdateChat}>
                <Form
                    initialValues={{
                        theme: editData?.theme,
                        status: editData?.status,
                        type: editData?.type,
                    }}
                    validationSchema={Yup.object().shape({
                        theme: Yup.string().required(ErrorMessages.REQUIRED),
                        status: Yup.string().nullable().required(ErrorMessages.REQUIRED),
                        type: Yup.string().nullable().required(ErrorMessages.REQUIRED),
                    })}
                    onSubmit={async (values: any) => {
                        handlerPostUpdateChat({
                            id: editData?.id,
                            theme: values?.theme,
                            status_id: values?.status,
                            type_id: values?.type,
                        });
                        close();
                    }}
                    enableReinitialize
                >
                    <Layout cols={1} gap={scale(1)} justify="start">
                        <Form.FastField name="theme" label="Тема" />

                        <Form.FastField name="status" label="Статус">
                            <Select items={convertedStatuses} />
                        </Form.FastField>

                        <Form.FastField name="type" label="Тип">
                            <Select items={convertedTypes} />
                        </Form.FastField>

                        <Button type="submit">Сохранить изменения</Button>
                    </Layout>
                </Form>
            </LoadWrapper>
        </Popup>
    );
};

const AdditionalInfo = ({ rowInfo }: { rowInfo: any }) => {
    const { colors } = useTheme();
    const [files, setFiles] = useState<File[]>([]);

    const infoRowCss: CSSObject = {
        borderBottom: `1px solid ${colors?.grey400}`,
        padding: `${scale(2)}px ${scale(7, true)}px`,
        width: '90%',
    };

    const formCss: CSSObject = {
        padding: `${scale(2)}px ${scale(7, true)}px`,
        width: '70%',
    };

    const { data: messageData, isLoading: isMessageLoading } = useCommunicationsMessages({
        filter: {
            user_id: rowInfo?.user,
            chat_id: rowInfo?.chatId,
            'chat.theme_like': rowInfo?.theme,
            'chat.type': rowInfo?.type,
            channel_id: rowInfo?.channel,
            'chat.unread_admin': rowInfo?.unread,
        },
    });

    const convertedMessageData = useMemo(
        () =>
            messageData?.data?.map(m => ({
                id: m.id,
                createdAt: m.created_at,
                userId: m.user_id,
                chatId: m.chat_id,
                text: m.text,
                files: m.files,
            })) || [],
        [messageData?.data]
    );
    console.log(convertedMessageData);

    const {
        mutate: handlerPostNewMessage,
        isLoading: isLoadingPostNewMessage,
        error: postNewMessageError,
    } = useCommunicationsPostNewMessage();

    useError(postNewMessageError);

    return (
        <LoadWrapper isLoading={isMessageLoading || isLoadingPostNewMessage}>
            <div css={{ borderBottom: `1px solid ${colors?.grey400}` }}>
                {convertedMessageData.length > 0 &&
                    convertedMessageData.map(message => (
                        <Layout cols={3} css={infoRowCss} key={message.id}>
                            <Layout.Item>{message?.userId}</Layout.Item>
                            <Layout.Item>{message?.text}</Layout.Item>
                            <Layout.Item>{format(new Date(message?.createdAt), 'dd.MM.yyyy H:m')}</Layout.Item>
                        </Layout>
                    ))}

                <Form
                    css={formCss}
                    initialValues={{
                        message: '',
                    }}
                    validationSchema={Yup.object().shape({
                        message: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                    onSubmit={async values => {
                        handlerPostNewMessage({
                            user_id: convertedMessageData[0]?.userId,
                            chat_id: convertedMessageData[0]?.chatId,
                            text: values?.message,
                            files: files.map(f => f.name),
                        });
                    }}
                >
                    <Form.FastField name="message">
                        <h2 css={typography('bodySmBold')}>Сообщение</h2>
                        <Textarea />
                    </Form.FastField>

                    <h2 css={{ margin: `${scale(1)}px 0`, ...typography('bodySmBold') }}>Файлы</h2>

                    <Form.Field name="file">
                        <FilePond
                            onUpdateFiles={setFiles}
                            acceptedFileTypes={FileTypes.IMAGES}
                            maxFileSize="10MB"
                            maxTotalFileSize="100MB"
                        />
                    </Form.Field>

                    <Button type="submit">Отправить сообщение</Button>
                </Form>
            </div>
        </LoadWrapper>
    );
};

const CommunicationMessages = () => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    /* Попап создания и редактирования сообщения */
    const [popupInfo, setPopupInfo] = useState(null);

    const { pathname, query, push } = useRouter();
    const activePage = +(query?.page || 1);
    /* Раскрытие строки таблицы */
    const [rowAdditional, setRowAdditional] = useState<expandableRowInfoProps | undefined>(undefined);

    const emptyInitialValues = {
        channel: [''],
        theme: [''],
        type: [''],
        status: [''],
    };

    const { initialValues, URLHelper } = useFiltersHelper(emptyInitialValues);

    const {
        data: chatsData,
        error: chatsLoadError,
        isLoading: isChatsLoading,
    } = useCommunicationsChats({
        filter: {
            theme: initialValues.theme,
            type_id: initialValues.type.map((i: { id: number }) => i.id),
            channel_id: initialValues.channel.map((i: { id: number }) => i.id),
            status_id: initialValues.status.map((i: { id: number }) => i.id),
        },
        pagination: {
            limit: ITEMS_PER_COMMUNICATIONS_CHATS_PAGE,
            type: 'offset',
            offset: (activePage - 1) * ITEMS_PER_COMMUNICATIONS_CHATS_PAGE,
        },
    });

    const convertedChatsData = useMemo(
        () =>
            chatsData?.data?.map(c => ({
                id: c.id,
                unread: false,
                theme: c.theme,
                user: c.user_id,
                channel: c.channel_id,
                chatId: c.id,
                lastMsgData: c.last_message_at,
                fullMsgData: c.last_message_at,
                status: c.status_id,
                type: c.type_id,
                messages: c.messages,
            })) || [],
        [chatsData?.data]
    );

    const totalChats = chatsData?.meta?.pagination?.total || 0;

    const pages = totalChats ? Math.ceil(totalChats / ITEMS_PER_COMMUNICATIONS_CHATS_PAGE) : null;

    const { data: channelsData, isLoading: isChannelsLoading } = useCommunicationsChannels({});

    const convertedChannels = useMemo(
        () =>
            channelsData?.data?.map(c => ({
                value: c.id,
                label: c.name,
            })) || [],
        [channelsData?.data]
    );

    const { data: statusesData, isLoading: isStatusesLoading, error: statusesError } = useCommunicationsStatuses();

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

    useError(chatsLoadError || statusesError);

    return (
        <PageWrapper h1="Непрочитанные сообщения">
            <LoadWrapper isLoading={isChatsLoading || isChannelsLoading || isStatusesLoading || isTypesLoading}>
                <Layout rows={['auto']} cols={1} gap={scale(3)}>
                    <Block>
                        <Block.Header>Фильтр</Block.Header>

                        <Form initialValues={initialValues} onSubmit={URLHelper} onReset={() => push(pathname)}>
                            <Block.Body>
                                <Layout cols={4}>
                                    <Form.FastField name="theme" label="Тема" placeholder="Введите тему" />
                                    <Form.Field name="channel" label="Канал">
                                        <MultiSelect items={convertedChannels} />
                                    </Form.Field>
                                    <Form.Field name="status" label="Статус">
                                        <MultiSelect items={convertedStatuses} />
                                    </Form.Field>
                                    <Form.Field name="type" label="Тип">
                                        <MultiSelect items={convertedTypes} />
                                    </Form.Field>
                                </Layout>
                            </Block.Body>

                            <Block.Footer>
                                <Layout cols={2} gap={scale(2)}>
                                    <Button theme="primary" type="submit">
                                        Применить
                                    </Button>
                                    <Form.Reset theme="secondary" type="button">
                                        Очистить
                                    </Form.Reset>
                                </Layout>
                            </Block.Footer>
                        </Form>
                    </Block>

                    <Layout.Item justify="start">
                        <Button theme="primary" onClick={() => setIsCreateOpen(true)} Icon={PlusIcon}>
                            Создать чат
                        </Button>
                    </Layout.Item>

                    <Block>
                        <Block.Body>
                            <OldTable
                                data={convertedChatsData.length > 0 ? convertedChatsData : chatsUnread}
                                columns={columns}
                                needCheckboxesCol={false}
                                editRow={(originalRow: any) => {
                                    setPopupInfo(originalRow);
                                    setIsEditOpen(true);
                                }}
                                onRowClick={row =>
                                    setRowAdditional(
                                        rowAdditional && rowAdditional.rowId === row.id
                                            ? undefined
                                            : {
                                                  rowId: row.id,
                                                  content: <AdditionalInfo rowInfo={row} />,
                                              }
                                    )
                                }
                                expandableRowInfo={rowAdditional}
                            />
                            {pages ? <Pagination pages={pages} css={{ marginTop: scale(2) }} /> : null}
                        </Block.Body>
                    </Block>
                </Layout>

                <CreatePopup
                    isOpen={isCreateOpen}
                    close={() => setIsCreateOpen(false)}
                    convertedChannels={convertedChannels}
                    convertedStatuses={convertedStatuses}
                    convertedTypes={convertedTypes}
                />

                <EditPopup
                    isOpen={isEditOpen}
                    close={() => setIsEditOpen(false)}
                    editData={popupInfo}
                    convertedStatuses={convertedStatuses}
                    convertedTypes={convertedTypes}
                />
            </LoadWrapper>
        </PageWrapper>
    );
};

export default CommunicationMessages;
