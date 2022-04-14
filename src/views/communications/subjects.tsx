import { useMemo, useState } from 'react';
import { scale, Button } from '@scripts/gds';
import { FormikValues } from 'formik';
import { useRouter } from 'next/router';

import {
    useCommunicationsThemes,
    useCommunicationsCreateTheme,
    useCommunicationsUpdateTheme,
    useCommunicationsDeleteTheme,
    useCommunicationsChannels,
} from '@api/communications';

import Block from '@components/Block';
import OldTable from '@components/OldTable';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Select from '@components/controls/Select';
import Switcher from '@components/controls/Switcher';
import Pagination from '@components/controls/Pagination';
import LoadWrapper from '@components/controls/LoadWrapper';

import { Flatten } from '@scripts/helpers';
import { ActionType } from '@scripts/enums';
import { ITEMS_PER_COMMUNICATIONS_THEMES_PAGE } from '@scripts/constants';

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

const CommunicationsSubjects = () => {
    const [popupState, popupDispatch] = usePopupState<State>(initialState);
    const [idDeleteOpen, setIsDeleteOpen] = useState(false);
    const { query } = useRouter();
    const activePage = +(query?.page || 1);

    const {
        data: themesData,
        refetch,
        error: themesError,
        isLoading: isThemesLoading,
    } = useCommunicationsThemes({
        sort: [],
        filter: {},
        include: [],
        pagination: {
            limit: ITEMS_PER_COMMUNICATIONS_THEMES_PAGE,
            type: 'offset',
            offset: (activePage - 1) * ITEMS_PER_COMMUNICATIONS_THEMES_PAGE,
        },
    });

    const totalThemes = themesData?.meta?.pagination?.total || 0;

    const pages = totalThemes ? Math.ceil(totalThemes / ITEMS_PER_COMMUNICATIONS_THEMES_PAGE) : null;

    const convertedThemes = useMemo(() => themesData?.data?.map(s => ({ ...s })) || [], [themesData?.data]);
    const [ids, setIds, selectedRows] = useSelectedRowsData<Flatten<typeof convertedThemes>>(convertedThemes);

    const { data: channelsData, isLoading: isChannelsLoading } = useCommunicationsChannels({});

    const convertedChannels = useMemo(
        () =>
            channelsData?.data?.map(c => ({
                value: c.id,
                label: c.name,
            })) || [],
        [channelsData?.data]
    );

    const { mutate: postNewTheme, isLoading: isNewThemeLoading } = useCommunicationsCreateTheme();

    const handlerPostNewTheme = (values: FormikValues) => {
        postNewTheme(
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

    const { mutate: patchTheme, isLoading: isEditThemeLoading } = useCommunicationsUpdateTheme();

    const handlerEditTheme = (values: FormikValues) => {
        patchTheme(
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

    const { mutate: handlerDeleteTheme, isLoading: isDeleteThemeLoading } = useCommunicationsDeleteTheme();

    return (
        <PageWrapper h1="Темы">
            <LoadWrapper
                isLoading={
                    isThemesLoading ||
                    isNewThemeLoading ||
                    isEditThemeLoading ||
                    isDeleteThemeLoading ||
                    isChannelsLoading
                }
                error={themesError ? JSON.stringify(themesError) : undefined}
            >
                <div css={{ marginBottom: scale(2) }}>
                    <Button Icon={PlusIcon} onClick={() => popupDispatch({ type: ActionType.Add })}>
                        Добавить тему
                    </Button>
                    {ids.length > 0 ? (
                        <Button Icon={TrashIcon} onClick={() => setIsDeleteOpen(true)} css={{ marginLeft: scale(2) }}>
                            Удалить тем{ids.length === 1 ? 'у' : 'ы'}
                        </Button>
                    ) : null}
                </div>
                <Block>
                    <Block.Body>
                        <OldTable
                            data={convertedThemes}
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
                    title={`${popupState.action === ActionType.Edit ? 'Редактирование' : 'Создание'} темы`}
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        initialValues={{
                            id: popupState.id,
                            name: popupState.name,
                            active: popupState.active,
                            channel: popupState.channel,
                        }}
                        onSubmit={async values => {
                            if (popupState.action === ActionType.Edit) handlerEditTheme(values);
                            else handlerPostNewTheme(values);
                            popupDispatch({ type: ActionType.Close });
                        }}
                    >
                        <Form.FastField name="name" label="Название" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="active" css={{ marginBottom: scale(2) }}>
                            <Switcher>Активность</Switcher>
                        </Form.FastField>
                        <Form.FastField
                            name="channel"
                            label="Канал, в котором может использоваться тема"
                            css={{ marginBottom: scale(2) }}
                        >
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
                    title="Вы уверены, что хотите удалить следующие темы?"
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        initialValues={{
                            ids: selectedRows.map(r => r.id),
                        }}
                        onSubmit={async values => {
                            values.ids.forEach(async (id: number) => {
                                await handlerDeleteTheme(id, {
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

export default CommunicationsSubjects;
