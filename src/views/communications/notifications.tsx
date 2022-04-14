import { useMemo, useState } from 'react';
import { scale, Button } from '@scripts/gds';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import * as Yup from 'yup';

import {
    useCommunicationsNotifications,
    useCommunicationsCreateNotification,
    useCommunicationsUpdateNotification,
    useCommunicationsDeleteNotification,
    useCommunicationsChannels,
    useCommunicationsTypes,
} from '@api/communications';

import OldTable from '@components/OldTable';
import Block from '@components/Block';
import LoadWrapper from '@components/controls/LoadWrapper';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Select from '@components/controls/Select';
import Pagination from '@components/controls/Pagination';

import { Flatten } from '@scripts/helpers';
import { ActionType } from '@scripts/enums';
import { getRandomItem } from '@scripts/mock';
import { CHANNELS } from '@scripts/data/different';
import { ErrorMessages, ITEMS_PER_COMMUNICATIONS_NOTIFICATIONS_PAGE } from '@scripts/constants';

import { usePopupState } from '@hooks/usePopupState';
import { useSelectedRowsData } from '@hooks/useSelectedRowsData';

import PlusIcon from '@icons/small/plus.svg';
import TrashIcon from '@icons/small/trash.svg';

const columns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Название',
        accessor: 'name',
        getProps: () => ({ type: 'link' }),
    },
    {
        Header: 'Тип',
        accessor: 'type',
    },
    {
        Header: 'Канал',
        accessor: 'channel',
    },
    {
        Header: 'Тема',
        accessor: 'theme',
    },
    {
        Header: 'Отправить от',
        accessor: 'sender',
    },
];

const rawTypes = ['Тип 1', 'Тип 2', 'Тип 3', 'Тип 4', 'Тип 5', 'Тип 6'];

const tableItem = (id: number) => ({
    id,
    name: getRandomItem(
        [
            'Сервисные Подана заявка на регистрацию',
            'Сервисные Обработана заявка на регистрацию. Статус Активный',
            'Сервисные Заявка на регистрацию обработана. Статус Отклонен',
            'Сервисные Приветствие "Добро пожаловать" - первая сессия (однократно)',
        ].map(i => [i, `/communications/notification/${id}`])
    ),
    type: getRandomItem(rawTypes),
    channel: getRandomItem(CHANNELS),
    theme: getRandomItem(['', '', 'Тема 1', 'Тема 2']),
    sender: getRandomItem(['', '', 'Администратор', 'test@mail.test']),
});

const makeData = (len: number) => [...Array(len).keys()].map(el => tableItem(el));

const initialState = {
    id: null,
    name: '',
    type: '',
    channel: '',
    theme: '',
    sender: '',
    action: ActionType.Close,
    active: false,
    open: false,
};

type State = {
    id?: number | null;
    name?: string;
    type?: string;
    channel?: string;
    theme?: string;
    sender?: string;
    action?: ActionType;
    active?: boolean;
    open?: boolean;
};

const CommunicationsNotifications = () => {
    const [popupState, popupDispatch] = usePopupState<State>(initialState);
    const [idDeleteOpen, setIsDeleteOpen] = useState(false);
    const data = useMemo(() => makeData(5), []);
    const { query } = useRouter();
    const activePage = +(query?.page || 1);

    const [ids, setIds, selectedRows] = useSelectedRowsData<Flatten<typeof data>>(data);

    const {
        data: notificationsData,
        refetch,
        error: notificationsError,
        isLoading: isNotificationsLoading,
    } = useCommunicationsNotifications({
        sort: [],
        filter: {},
        include: [],
        pagination: {
            type: 'offset',
            limit: ITEMS_PER_COMMUNICATIONS_NOTIFICATIONS_PAGE,
            offset: (activePage - 1) * ITEMS_PER_COMMUNICATIONS_NOTIFICATIONS_PAGE,
        },
    });

    const totalNotifications = notificationsData?.meta?.pagination?.total || 0;

    const pages = totalNotifications
        ? Math.ceil(totalNotifications / ITEMS_PER_COMMUNICATIONS_NOTIFICATIONS_PAGE)
        : null;

    const convertedNotifications = useMemo(
        () => notificationsData?.data?.map(n => ({ ...n })) || [],
        [notificationsData?.data]
    );

    const { data: channelsData, isLoading: isChannelsLoading } = useCommunicationsChannels({});

    const convertedChannels = useMemo(
        () =>
            channelsData?.data?.map(c => ({
                value: c.id,
                label: c.name,
            })) || [],
        [channelsData?.data]
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

    const { mutate: postNewNotification, isLoading: isNewNotificationLoading } = useCommunicationsCreateNotification();

    const handlerPostNewNotification = (values: FormikValues) => {
        postNewNotification(
            {
                name: values.name,
                type: values.type,
                theme: values.theme,
                sender: values.sender,
                channel: values.channel,
            },
            {
                onSuccess: () => {
                    refetch();
                },
            }
        );
    };

    const { mutate: editNotification, isLoading: isEditNotificationLoading } = useCommunicationsUpdateNotification();

    const handlerEditNotification = (values: FormikValues) => {
        editNotification(
            {
                id: values.id,
                name: values.name,
                type: values.type,
                theme: values.theme,
                sender: values.sender,
                channel: values.channel,
            },
            {
                onSuccess: () => {
                    refetch();
                },
            }
        );
    };

    const { mutate: handlerDeleteNotification, isLoading: isDeleteNotificationLoading } =
        useCommunicationsDeleteNotification();

    return (
        <PageWrapper h1="Сервисные уведомления">
            <LoadWrapper
                isLoading={
                    isTypesLoading ||
                    isChannelsLoading ||
                    isNotificationsLoading ||
                    isNewNotificationLoading ||
                    isEditNotificationLoading ||
                    isDeleteNotificationLoading
                }
                error={notificationsError ? JSON.stringify(notificationsError) : undefined}
            >
                <div css={{ marginBottom: scale(2) }}>
                    <Button Icon={PlusIcon} onClick={() => popupDispatch({ type: ActionType.Add })}>
                        Создать сервисное уведомление
                    </Button>
                    {ids.length > 0 ? (
                        <Button Icon={TrashIcon} onClick={() => setIsDeleteOpen(true)} css={{ marginLeft: scale(2) }}>
                            Удалить сообщени{ids.length === 1 ? 'е' : 'я'}
                        </Button>
                    ) : null}
                </div>
                <Block>
                    <Block.Body>
                        <OldTable
                            data={convertedNotifications.length > 0 ? convertedNotifications : data}
                            columns={columns}
                            onRowSelect={setIds}
                            editRow={row => {
                                popupDispatch({
                                    type: ActionType.Edit,
                                    payload: {
                                        id: row?.id,
                                        name: row?.name[0],
                                        theme: row?.theme,
                                        channel: row?.channel,
                                        sender: row?.sender,
                                        type: row?.type,
                                    },
                                });
                            }}
                            css={{ marginBottom: scale(2) }}
                        />
                        {pages ? <Pagination pages={pages} css={{ marginTop: scale(2) }} /> : null}
                    </Block.Body>
                </Block>
                <Popup
                    isOpen={Boolean(popupState.open)}
                    onRequestClose={() => popupDispatch({ type: ActionType.Close })}
                    title={`${
                        popupState.action === ActionType.Edit ? 'Редактировать' : 'Создать'
                    } сервисное уведомление`}
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        initialValues={{
                            id: popupState.id,
                            name: popupState.name,
                            type: popupState.type,
                            theme: popupState.theme,
                            channel: popupState.channel,
                            sender: popupState.sender,
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required(ErrorMessages.REQUIRED),
                            type: Yup.string().required(ErrorMessages.REQUIRED),
                            theme: Yup.string().required(ErrorMessages.REQUIRED),
                            channel: Yup.string().required(ErrorMessages.REQUIRED),
                            sender: Yup.string().required(ErrorMessages.REQUIRED),
                        })}
                        onSubmit={async values => {
                            if (popupState.action === ActionType.Edit) handlerEditNotification(values);
                            else handlerPostNewNotification(values);
                            popupDispatch({ type: ActionType.Close });
                        }}
                    >
                        <Form.FastField name="name" label="Название" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="theme" label="Тема" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="type" label="Тип" css={{ marginBottom: scale(2) }}>
                            <Select items={convertedTypes} defaultValue={popupState.type} />
                        </Form.FastField>
                        <Form.FastField name="channel" label="Канал" css={{ marginBottom: scale(2) }}>
                            <Select items={convertedChannels} defaultValue={popupState.channel} />
                        </Form.FastField>
                        <Form.FastField
                            name="sender"
                            label="Отправить от лица пользователя"
                            css={{ marginBottom: scale(4) }}
                        />
                        <Form.Reset theme="fill" css={{ marginRight: scale(2) }}>
                            {popupState.action === ActionType.Edit ? 'Сбросить' : 'Очистить'}
                        </Form.Reset>
                        <Button type="submit">Сохранить</Button>
                        {/* При желании можно добавить кнопку "удалить" в этот попап. Тогда для подтверждения удаления рекомендую использовать тултип */}
                    </Form>
                </Popup>
                <Popup
                    isOpen={idDeleteOpen}
                    onRequestClose={() => setIsDeleteOpen(false)}
                    title="Вы уверены, что хотите удалить следующие уведомления?"
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        initialValues={{
                            ids: selectedRows.map(r => r.id),
                        }}
                        onSubmit={async values => {
                            values.ids.forEach(async (id: number) => {
                                await handlerDeleteNotification(id);
                            });
                            setIsDeleteOpen(false);
                        }}
                    >
                        <ul css={{ marginBottom: scale(2) }}>
                            {selectedRows.map(r => (
                                <li key={r.id} css={{ marginBottom: scale(1, true) }}>
                                    #{r.id} – {r.name[0]}
                                </li>
                            ))}
                        </ul>
                        <Button type="submit">Удалить</Button>
                    </Form>
                </Popup>
            </LoadWrapper>
        </PageWrapper>
    );
};

export default CommunicationsNotifications;
