import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';

import { useFiltersHelper } from '@scripts/hooks';
import { useSelectedRowsData } from '@scripts/hooks/useSelectedRowsData';
import { Button, scale } from '@scripts/gds';
import { getTotalPages, getTotal, toISOString, toSelectItems } from '@scripts/helpers';
import { useError, useSuccess } from '@context/modal';
import { ModalMessages, LIMIT_PAGE } from '@scripts/constants';
import { CELL_TYPES } from '@scripts/enums';

import SettingsIcon from '@icons/small/settings.svg';
import PlusIcon from '@icons/small/plus.svg';

import PageWrapper from '@components/PageWrapper';
import OldTable from '@components/OldTable';
import Block from '@components/Block';
import Pagination from '@components/controls/Pagination';

import {
    useGetSellers,
    useGetSellerStatuses,
    usePatchSeller,
    //  useGetSellerUsers,
    Seller,
} from '@api/units';

import {
    useCommunicationsTypes,
    useCommunicationsStatuses,
    useCommunicationsChannels,
    useCommunicationsPostNewMessage,
    useCommunicationsCreateChat,
    NewMessage,
} from '@api/communications';

import { SelectItemProps } from '@components/controls/Select';
import ChangeStatusPopup from './ChangeStatusPopup';
import Filter from './Filter';
import SendMessagePopup from './SendMessagePopup';

export interface MessageData extends FormikValues {
    files: File[];
}

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: CELL_TYPES.LINKED_ID }),
    },
    {
        Header: 'Дата регистранции',
        accessor: 'registrationDate',
        getProps: () => ({ type: CELL_TYPES.DATE }),
    },
    {
        Header: 'Название организации',
        accessor: 'organizationName',
        getProps: () => ({ type: CELL_TYPES.LINK }),
    },
    {
        Header: 'ФИО контактного лица',
        accessor: 'contactName',
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
        Header: 'Статус',
        accessor: 'status',
        getProps: () => ({ type: CELL_TYPES.STATUS }),
    },
    {
        Header: 'Менеджер',
        accessor: 'manager',
    },
];

const SellerList = () => {
    const { push, query, pathname } = useRouter();
    const activePage = +(query?.page || 1);

    const [open, setOpen] = useState('none');
    const close = () => setOpen('none');

    const emptyInitValues = {
        registrationDate: [null],
        status: [],
        id: '',
        organizationName: '',
        contactName: '',
        email: '',
        phone: '',
        manager: [],
    };

    const { initialValues, URLHelper } = useFiltersHelper(emptyInitValues);

    const { data: statuses } = useGetSellerStatuses();

    // const { data: users } = useGetSellerUsers();

    const {
        data: sellers,
        error,
        isLoading,
        isIdle,
    } = useGetSellers({
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
        filter: {
            created_at_from: initialValues.created_at_from ? toISOString(initialValues.created_at_from) : undefined,
            created_at_to: initialValues.created_at_to ? toISOString(initialValues.created_at_to) : undefined,
            status: initialValues.status || undefined,
            id: initialValues.id || undefined,
            legal_name: initialValues.organizationName || undefined,
            owner_full_name: initialValues.contactName || undefined,
            owner_email: initialValues.email || undefined,
            owner_phone: initialValues.phone || undefined,
            manager_user_id: initialValues.manager || undefined,
        },
    });

    const { data: communicationStatuses } = useCommunicationsStatuses({});

    const { data: communicationTypes } = useCommunicationsTypes({});

    const { data: communicationChannels } = useCommunicationsChannels({});

    const patchSeller = usePatchSeller();
    const postChat = useCommunicationsCreateChat();
    const postMessage = useCommunicationsPostNewMessage();

    useError(error || patchSeller.error || postChat.error || postMessage.error);

    useSuccess(
        patchSeller.status === 'success' || postChat.status === 'success' || postMessage.status === 'success'
            ? ModalMessages.SUCCESS_UPDATE
            : ''
    );

    const data = useMemo(
        () =>
            sellers
                ? sellers.data.map((seller: Seller) => ({
                      id: seller.id,
                      registrationDate: [seller.created_at],
                      organizationName: { name: seller.legal_name ?? '', to: `/sellers/list/${seller.id}` },
                      contact: seller.manager.full_name,
                      email: seller.manager.email,
                      phone: seller.manager.phone,
                      status: seller.status,
                      manager: seller.manager_id,
                  }))
                : [],
        [sellers]
    );

    const [ids, setIds, selectedRows] = useSelectedRowsData<typeof data[0]>(data);

    const totalPages = getTotalPages(sellers);
    const total = getTotal(sellers);

    const statuseList = useMemo(() => toSelectItems(statuses?.data), [statuses]);

    // const managerList = useMemo(() => toSelectItems(users?.data), [users]);

    const statusesList = useMemo(() => toSelectItems(communicationStatuses?.data), [communicationStatuses]);

    const typesList = useMemo(() => toSelectItems(communicationTypes?.data), [communicationTypes]);

    const channelsList = useMemo(() => toSelectItems(communicationChannels?.data), [communicationChannels]);

    const changeStatusHandler = (values: FormikValues) => {
        selectedRows.forEach((row: typeof data[0]) => {
            patchSeller.mutate({
                id: row?.id,
                body: {
                    status: values.status.value,
                },
            });
        });
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
                    const messageData: NewMessage = {
                        user_id: seller.value,
                        chat_id: res.data.id,
                        text: values.message,
                        files: values.files,
                    };
                    postMessage.mutate(messageData);
                    close();
                },
            });
        });
    };

    return (
        <PageWrapper h1="Список продавцов" isLoading={isLoading || isIdle}>
            <>
                <Filter
                    onSubmit={URLHelper}
                    onReset={() => push({ pathname, query: { page: activePage } })}
                    initialValues={initialValues}
                    emptyInitialValues={emptyInitValues}
                    css={{ marginBottom: scale(3) }}
                    statusForSelect={statuseList}
                    managersForSelect={[]}
                    total={total}
                />

                <Block>
                    <Block.Header>
                        <div css={{ display: 'flex' }}>
                            <Link href="/sellers/list/create" passHref>
                                <Button theme="primary" css={{ marginRight: scale(2) }} Icon={PlusIcon}>
                                    Создать продавца
                                </Button>
                            </Link>
                            {ids.length !== 0 ? (
                                <>
                                    <Button
                                        theme="primary"
                                        css={{ marginRight: scale(2) }}
                                        onClick={() => setOpen('status')}
                                    >
                                        Изменить статус
                                    </Button>
                                    <Button
                                        theme="outline"
                                        css={{ marginRight: scale(2) }}
                                        Icon={SettingsIcon}
                                        onClick={() => setOpen('message')}
                                    >
                                        Отправить сообщение
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </Block.Header>
                    {data.length ? (
                        <Block.Body>
                            <OldTable columns={COLUMNS} data={data} onRowSelect={setIds} needSettingsColumn={false} />
                            <Pagination pages={totalPages} css={{ marginTop: scale(2) }} />
                        </Block.Body>
                    ) : (
                        <p css={{ padding: scale(2) }}>Продавцы не найдены</p>
                    )}
                </Block>

                <ChangeStatusPopup
                    isOpen={open === 'status'}
                    close={close}
                    onSubmit={values => changeStatusHandler(values)}
                    selectedRows={selectedRows}
                    statuses={statuseList}
                />

                <SendMessagePopup
                    isOpen={open === 'message'}
                    close={close}
                    onSubmit={SendMessageHandler}
                    statuses={statusesList}
                    types={typesList}
                    channels={channelsList}
                    sellers={
                        selectedRows ? selectedRows.map(r => ({ value: r.id, label: r.organizationName.name })) : []
                    }
                />
            </>
        </PageWrapper>
    );
};

export default SellerList;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
