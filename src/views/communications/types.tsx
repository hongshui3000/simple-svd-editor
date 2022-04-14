import { useMemo, useState } from 'react';
import { scale, Button } from '@scripts/gds';
import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import {
    useCommunicationsTypes,
    useCommunicationsCreateType,
    useCommunicationsUpdateType,
    useCommunicationsDeleteType,
    useCommunicationsChannels,
} from '@api/communications';

import OldTable from '@components/OldTable';
import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Select from '@components/controls/Select';
import Switcher from '@components/controls/Switcher';
import Pagination from '@components/controls/Pagination';
import LoadWrapper from '@components/controls/LoadWrapper';

import { Flatten } from '@scripts/helpers';
import { ActionType } from '@scripts/enums';
import { ErrorMessages, ITEMS_PER_COMMUNICATIONS_TYPES_PAGE } from '@scripts/constants';

import { usePopupState } from '@hooks/usePopupState';
import { useSelectedRowsData } from '@hooks/useSelectedRowsData';

import PlusIcon from '@icons/small/plus.svg';
import TrashIcon from '@icons/small/trash.svg';

const columns = [
    {
        Header: 'Название',
        accessor: 'name',
    },
    {
        Header: 'Активность',
        accessor: 'active',
    },
    {
        Header: 'Канал',
        accessor: 'channel',
    },
];

const initialState = { id: null, name: '', active: false, channel: '', action: ActionType.Close, open: false };

type State = {
    id?: number | null;
    name?: string;
    active?: boolean;
    channel?: string;
    action?: ActionType;
    open?: boolean;
};

const CommunicationTypes = () => {
    const [popupState, popupDispatch] = usePopupState<State>(initialState);
    const [idDeleteOpen, setIsDeleteOpen] = useState(false);
    const { query } = useRouter();
    const activePage = +(query?.page || 1);

    const {
        data: typesData,
        refetch,
        isLoading: isTypesLoading,
    } = useCommunicationsTypes({
        sort: [],
        filter: {},
        include: [],
        pagination: {
            type: 'offset',
            limit: ITEMS_PER_COMMUNICATIONS_TYPES_PAGE,
            offset: (activePage - 1) * ITEMS_PER_COMMUNICATIONS_TYPES_PAGE,
        },
    });

    const totalTypes = typesData?.meta?.pagination?.total || 0;

    const pages = totalTypes ? Math.ceil(totalTypes / ITEMS_PER_COMMUNICATIONS_TYPES_PAGE) : null;

    const convertedTypes = useMemo(() => typesData?.data?.map(s => ({ ...s })) || [], [typesData?.data]);
    const [ids, setIds, selectedRows] = useSelectedRowsData<Flatten<typeof convertedTypes>>(convertedTypes);

    const { data: channelsData, isLoading: isChannelsLoading } = useCommunicationsChannels({});

    const convertedChannels = useMemo(
        () =>
            channelsData?.data?.map(c => ({
                value: c.id,
                label: c.name,
            })) || [],
        [channelsData?.data]
    );

    const { mutate: postNewType, isLoading: isNewTypeLoading } = useCommunicationsCreateType();

    const handlerPostNewType = (values: FormikValues) => {
        postNewType(
            {
                name: values.name,
                active: values.active,
                channel: [0, 1, 2],
            },
            {
                onSuccess: () => {
                    refetch();
                },
            }
        );
    };

    const { mutate: patchType, isLoading: isEditTypeLoading } = useCommunicationsUpdateType();

    const handlerEditType = (values: FormikValues) => {
        patchType(
            {
                id: values.id,
                name: values.name,
                active: values.active,
                channel: [0, 1, 2],
            },
            {
                onSuccess: () => {
                    refetch();
                },
            }
        );
    };

    const { mutate: handlerDeleteType, isLoading: isDeleteTypeLoading } = useCommunicationsDeleteType();

    return (
        <PageWrapper h1="Типы">
            <LoadWrapper
                isLoading={
                    isTypesLoading || isNewTypeLoading || isEditTypeLoading || isDeleteTypeLoading || isChannelsLoading
                }
            >
                <div css={{ marginBottom: scale(2) }}>
                    <Button Icon={PlusIcon} onClick={() => popupDispatch({ type: ActionType.Add })}>
                        Добавить тип
                    </Button>
                    {ids.length > 0 ? (
                        <Button Icon={TrashIcon} onClick={() => setIsDeleteOpen(true)} css={{ marginLeft: scale(2) }}>
                            Удалить тип{ids.length === 1 ? '' : 'ы'}
                        </Button>
                    ) : null}
                </div>
                <Block>
                    <Block.Body>
                        <OldTable
                            data={convertedTypes}
                            columns={columns}
                            onRowSelect={setIds}
                            editRow={row => {
                                popupDispatch({
                                    type: ActionType.Edit,
                                    payload: {
                                        id: row?.id,
                                        name: row?.name,
                                        active: row?.active.toLowerCase() === 'да',
                                        channel: row?.channel,
                                    },
                                });
                            }}
                        />
                        {pages ? <Pagination pages={pages} css={{ marginTop: scale(2) }} /> : null}
                    </Block.Body>
                </Block>
                <Popup
                    isOpen={Boolean(popupState.open)}
                    onRequestClose={() => popupDispatch({ type: ActionType.Close })}
                    title={`${popupState.action === ActionType.Edit ? 'Редактирование' : 'Создание'} типа`}
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        initialValues={{
                            id: popupState.id,
                            name: popupState.name,
                            active: popupState.active,
                            channel: popupState.channel,
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required(ErrorMessages.REQUIRED),
                            channel: Yup.string().nullable().required(ErrorMessages.REQUIRED),
                        })}
                        onSubmit={async values => {
                            if (popupState.action === ActionType.Edit) handlerEditType(values);
                            else handlerPostNewType(values);
                            popupDispatch({ type: ActionType.Close });
                        }}
                    >
                        <Form.FastField name="name" label="Название" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="active" css={{ marginBottom: scale(2) }}>
                            <Switcher>Активность</Switcher>
                        </Form.FastField>
                        <Form.FastField name="channel" label="Канал" css={{ marginBottom: scale(2) }}>
                            <Select items={convertedChannels} defaultValue={popupState.channel} />
                        </Form.FastField>
                        <Form.Reset theme="fill" css={{ marginRight: scale(2) }}>
                            {popupState.action === ActionType.Edit ? 'Сбросить' : 'Очистить'}
                        </Form.Reset>
                        <Button type="submit">Сохранить</Button>
                    </Form>
                </Popup>
                <Popup
                    isOpen={idDeleteOpen}
                    onRequestClose={() => setIsDeleteOpen(false)}
                    title="Вы уверены, что хотите удалить следующие типы?"
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        initialValues={{
                            ids: selectedRows.map(r => r.id),
                        }}
                        onSubmit={async values => {
                            values.ids.forEach(async (id: number) => {
                                await handlerDeleteType(id, {
                                    onSuccess: () => {
                                        refetch();
                                    },
                                });
                            });
                            setIsDeleteOpen(false);
                        }}
                    >
                        <ul css={{ marginBottom: scale(2) }}>
                            {selectedRows.map(r => (
                                <li key={r.id} css={{ marginBottom: scale(1, true) }}>
                                    #{r.id} – {r.name}
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

export default CommunicationTypes;
