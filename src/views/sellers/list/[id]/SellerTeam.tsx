import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { typography, Button, scale, Layout, useTheme } from '@scripts/gds';
import { PLACES_OF_COMMUNICATION, ACTIVE_STATUSES, USER_STATUSES } from '@scripts/data/different';

import Form from '@components/controls/Form';
import { FormikValues } from 'formik';
import Block from '@components/Block';
import OldTable from '@components/OldTable';
import Popup from '@components/controls/Popup';
import Pagination from '@components/controls/Pagination';
import Select, { SelectItemProps } from '@components/controls/Select';

import { useGetSellerUsers, useDeleteSellerUser, User, SellerUser } from '@api/units';
import LoadWrapper from '@components/controls/LoadWrapper';
import {
    useCommunicationsCreateChat,
    useCommunicationsPostNewMessage,
    useCommunicationsStatuses,
    useCommunicationsTypes,
    useCommunicationsChannels,
} from '@api/communications';

import { getTotalPages, toSelectItems } from '@scripts/helpers';
import { usePopupState } from '@scripts/hooks';
import { ActionType, CELL_TYPES } from '@scripts/enums';
import { useError, useSuccess } from '@context/modal';
import { ModalMessages } from '@scripts/constants';

import SendMessagePopup from '../SendMessagePopup';

const communications = PLACES_OF_COMMUNICATION.map(i => ({ label: i, value: i }));
const statuses = ACTIVE_STATUSES.map((item, i) => ({ label: item, value: i }));

const COLUMNS = [
    {
        Header: '#',
        accessor: 'id',
    },
    {
        Header: 'ФИО',
        accessor: 'name',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
    {
        Header: 'Телефон',
        accessor: 'phone',
    },
    {
        Header: 'Способ связи',
        accessor: 'communication',
    },
    {
        Header: 'Роли',
        accessor: 'role',
    },
    {
        Header: 'Статус',
        accessor: 'status',
        getProps: () => ({ type: CELL_TYPES.STATUS }),
    },
    {
        Header: 'Логин',
        accessor: 'login',
    },
];
const OPERATOR_URL = '/seller/operator';

interface State {
    id?: number;
    open?: boolean;
    action?: ActionType;
    name?: string;
}

const SellerTeam = ({ id }: { id: number }) => {
    const [popupState, popupDispatch] = usePopupState<State>({ open: false, action: ActionType.Close });
    const close = () => popupDispatch({ type: ActionType.Close });

    const { push } = useRouter();
    const emptyInitValues = {
        id: null,
        full_name: null,
        email: null,
        login: null,
        phone: null,
        communication_way: null,
        status: null,
    };
    const { colors } = useTheme();
    const [moreFilters, setMoreFilters] = useState(true);
    const [initialValues, setInitialValues] = useState<FormikValues>(emptyInitValues);

    const [isCreationChatPopup, setIsCreationChatPopup] = useState(false);

    const {
        data: sellerUsers,
        error,
        isLoading: isLoadingUsers,
    } = useGetSellerUsers({
        filter: {
            full_name: initialValues.full_name || undefined,
            email: initialValues.email || undefined,
            phone: initialValues.phone || undefined,
            id: initialValues.id || undefined,
            login: initialValues.login || undefined,
            status: initialValues.status || undefined,
            communication_way: initialValues.communication_way || undefined,
            seller_id: id,
        },
    });

    const data = useMemo(
        () =>
            sellerUsers
                ? sellerUsers.data.map((store: User) => ({
                      id: store.id,
                      name: store.full_name,
                      email: store.email,
                      phone: store.phone,
                      communication: store.communication_way,
                      role: store.roles?.map(role => role.title),
                      status: store.active ? USER_STATUSES.ACTIVE : USER_STATUSES.NO_ACTIVE,
                      login: store.login,
                  }))
                : [],
        [sellerUsers]
    );

    const total = getTotalPages(sellerUsers);

    const { data: communicationStatuses } = useCommunicationsStatuses({});
    const { data: communicationTypes } = useCommunicationsTypes({});
    const { data: communicationChannels } = useCommunicationsChannels({});

    const postChat = useCommunicationsCreateChat();
    const postMessage = useCommunicationsPostNewMessage();
    const deleteSellerUser = useDeleteSellerUser();

    useError(error || postChat.error || postMessage.error || deleteSellerUser.error);

    useSuccess(
        postChat.status === 'success' || postMessage.status === 'success' || deleteSellerUser.status === 'success'
            ? ModalMessages.SUCCESS_UPDATE
            : ''
    );

    const statusesList = useMemo(() => toSelectItems(communicationStatuses?.data), [communicationStatuses]);

    const typesList = useMemo(() => toSelectItems(communicationTypes?.data), [communicationTypes]);

    const channelsList = useMemo(() => toSelectItems(communicationChannels?.data), [communicationChannels]);

    const setFilters = (value: FormikValues) => {
        setInitialValues({ ...value, status: !!value.status.value });
    };

    const SendMessageHandler = (values: FormikValues) => {
        values.seller.forEach((seller: SelectItemProps) => {
            const chatData = {
                user_id: seller.value,
                theme: values.subject,
                channel_id: values.channel,
                status_id: values.status,
                type_id: values.type,
            };

            postChat.mutate(chatData, {
                onSuccess: async res => {
                    const messageData = {
                        user_id: seller.value,
                        chat_id: res.data.id,
                        text: values.message,
                        files: values.files,
                    };
                    postMessage.mutate(messageData);
                    setIsCreationChatPopup(false);
                },
            });
        });
    };

    return (
        <>
            <Block css={{ marginBottom: scale(3) }}>
                <LoadWrapper isLoading={isLoadingUsers}>
                    <Form initialValues={initialValues} onSubmit={setFilters} enableReinitialize>
                        <Block.Header>
                            <h2>Фильтр</h2>
                            <div css={{ button: { marginLeft: scale(2) } }}>
                                <button
                                    type="button"
                                    css={{ color: colors?.primary, ...typography('bodySm') }}
                                    onClick={() => setMoreFilters(!moreFilters)}
                                >
                                    {moreFilters ? 'Меньше' : 'Больше'} фильтров
                                </button>
                                <Form.Reset theme="secondary" type="button" initialValues={emptyInitValues}>
                                    Очистить
                                </Form.Reset>
                                <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                    Применить
                                </Button>
                            </div>
                        </Block.Header>
                        <Block.Body>
                            <Layout cols={6}>
                                <Layout.Item col={1}>
                                    <Form.FastField name="id" label="ID пользователя" type="number" />
                                </Layout.Item>
                                <Layout.Item col={3}>
                                    <Form.FastField name="full_name" label="ФИО" />
                                </Layout.Item>
                                <Layout.Item col={2}>
                                    <Form.FastField name="email" label="Email" />
                                </Layout.Item>
                                <Layout.Item col={3}>
                                    <Form.FastField name="phone" label="Телефон" />
                                </Layout.Item>
                                <Layout.Item col={3}>
                                    <Form.FastField name="login" label="Логин" />
                                </Layout.Item>
                                {moreFilters && (
                                    <>
                                        <Layout.Item col={2}>
                                            <Form.FastField name="communication_way" label="Способ связи">
                                                <Select items={communications} />
                                            </Form.FastField>
                                        </Layout.Item>
                                        <Layout.Item col={2}>
                                            <Form.FastField name="status" label="Статус">
                                                <Select items={statuses} />
                                            </Form.FastField>
                                        </Layout.Item>
                                    </>
                                )}
                            </Layout>
                        </Block.Body>
                    </Form>
                    <Block.Body css={{ display: 'flex', button: { marginRight: scale(2) } }}>
                        <Link href={`${OPERATOR_URL}/create?merchant_id=${id}`} passHref>
                            <Button>Создать пользователя продавца</Button>
                        </Link>
                        <Button onClick={() => setIsCreationChatPopup(true)}>Написать пользователю продавца</Button>
                    </Block.Body>
                    <Block.Body>
                        <OldTable
                            columns={COLUMNS}
                            data={data}
                            editRow={row => push(`/merchant/detail/${row?.id}`)}
                            needCheckboxesCol={false}
                            deleteRow={async row => {
                                if (row?.id) {
                                    popupDispatch({
                                        type: ActionType.Delete,
                                        payload: { id: row.id, name: row.name },
                                    });
                                }
                            }}
                        />
                        <Pagination pages={total} />
                    </Block.Body>
                </LoadWrapper>
            </Block>
            <SendMessagePopup
                isOpen={isCreationChatPopup}
                close={() => setIsCreationChatPopup(false)}
                onSubmit={SendMessageHandler}
                statuses={statusesList}
                types={typesList}
                channels={channelsList}
                sellers={
                    sellerUsers?.data
                        ? sellerUsers.data.map((r: SellerUser) => ({ value: r.id, label: r.full_name }))
                        : []
                }
            />
            <Popup
                isOpen={Boolean(popupState.open && popupState.action === ActionType.Delete)}
                onRequestClose={close}
                title="Вы уверены, что хотите удалить пользователя продавца?"
            >
                <p css={{ marginBottom: scale(2) }}>{`#${popupState.id} ${popupState.name}`}</p>
                <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        theme="outline"
                        onClick={() =>
                            popupDispatch({
                                type: ActionType.Close,
                            })
                        }
                        css={{ marginRight: scale(2) }}
                    >
                        Отменить
                    </Button>
                    <Button
                        theme="primary"
                        onClick={async () => {
                            if (popupState.id) {
                                await deleteSellerUser.mutateAsync(popupState.id);
                            }
                            close();
                        }}
                    >
                        Удалить
                    </Button>
                </div>
            </Popup>
        </>
    );
};

export default SellerTeam;
