import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useMemo, useCallback } from 'react';

import Table, {
    ExtendedColumn,
    Cell,
    TableEmpty,
    TableFooter,
    TableHeader,
    getSettingsColumn,
    TooltipContentProps,
    Data,
} from '@components/Table';
import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';
import Form, { NuberFieldValue } from '@components/controls/Form';
import MultiSelect from '@components/controls/MultiSelect';
import Autocomplete from '@components/controls/Autocomplete';
import Circle from '@components/Circle';
// import CalendarRange from '@components/controls/CalendarRange';

import { Layout, Button, scale } from '@scripts/gds';

import { getAdminUserEnumValues, useAdminUsers } from '@api/units';
import { useRefundsSearch, Refund, useOrderSources, useRefundStatuses } from '@api/orders';

import ResetIcon from '@icons/small/reset.svg';
import SettingIcon from '@icons/small/settings.svg';

import { useError } from '@context/modal';
import { getTotal, getTotalPages, toSelectItems, getOptionName } from '@scripts/helpers';
import { useActivePage, useFiltersHelper } from '@scripts/hooks';

import { getRefundStatusColor } from './helpers';

const columns: ExtendedColumn[] = [
    {
        accessor: 'id',
        Header: 'ID',
    },
    {
        accessor: 'source',
        Header: 'Канал',
    },
    {
        accessor: 'responsible',
        Header: 'Ответственный',
        Cell: ({ value }) => value || '-',
    },
    {
        accessor: 'reasons',
        Header: 'Причина возврата',
        Cell: ({ value }: { value: Refund['reasons'] }) => <Cell value={value?.map(r => r.name)} type="array" />,
    },
    {
        accessor: 'order_number',
        Header: 'Номер заказа',
    },
    {
        accessor: 'status',
        Header: 'Статус',
        Cell: ({ value }: { value: { id: number; name: string } }) => (
            <>
                <Circle css={{ marginRight: scale(1, true), background: getRefundStatusColor(value.id) }} />
                {value.name}
            </>
        ),
    },
    {
        accessor: 'created_at',
        Header: 'Дата и время создания',
        Cell: ({ value }) => <Cell value={value} type="datetime" />,
    },
    getSettingsColumn(),
];

type Values = {
    id: NuberFieldValue;
    source: number[];
    order_id: NuberFieldValue;
    responsible_id: { value: NuberFieldValue; label: string } | '';
    status: number[];
};

const emptyInitialValues: Values = {
    id: '',
    source: [],
    order_id: '',
    responsible_id: '',
    status: [],
    // client: '',
    // date_from: NaN,
    // date_to: NaN,
};

export const getServerSideProps = async () => ({ props: {} });

export default function Refunds() {
    const { push, pathname } = useRouter();

    const [sort, setSort] = useState<string | undefined>(undefined);
    const [itemsPerPageCount, setItemsPerPageCount] = useState(10);

    const page = useActivePage();
    const { initialValues: values, filtersActive, URLHelper } = useFiltersHelper<Values>(emptyInitialValues);

    const { data, error } = useRefundsSearch({
        filter: {
            id: values.id || undefined,
            order_id: values.order_id || undefined,
            responsible_id: values.responsible_id ? +values.responsible_id.value : undefined,
            status: values.status.length > 0 ? values.status : undefined,
            source: values.source.length > 0 ? values.source : undefined,
        },
        include: ['reasons', 'order'],
        sort: sort ? [sort] : undefined,
        pagination: {
            type: 'offset',
            limit: itemsPerPageCount,
            offset: (page - 1) * itemsPerPageCount,
        },
    });
    useError(error);

    const pages = getTotalPages(data, itemsPerPageCount);
    const total = getTotal(data);

    const { data: sourcesData, error: sourcesError } = useOrderSources();
    useError(sourcesError);

    const { data: statusData, error: statusesError } = useRefundStatuses();
    useError(statusesError);

    const responsible = useMemo(
        () => [...new Set(data?.data.map(d => d.responsible_id) || [])].filter(Boolean),
        [data?.data]
    );

    const { data: responsibleData } = useAdminUsers({ filter: { id: responsible as number[] } });

    const tableData = useMemo(
        () =>
            data?.data.map(({ source, status, order, responsible_id, ...rest }) => ({
                ...rest,
                source: getOptionName(sourcesData?.data, source),
                status: {
                    name: getOptionName(statusData?.data, status),
                    id: status,
                },
                order_number: order?.number,
                responsible: responsibleData?.data.find(r => r.id === responsible_id)?.full_name,
            })) || [],
        [data?.data, responsibleData?.data, sourcesData?.data, statusData?.data]
    );

    const onRowClick = useCallback(
        (row: Data | Data[] | undefined) => {
            if (!Array.isArray(row)) {
                push(`${pathname}/${row?.id}`);
            }
        },
        [pathname, push]
    );

    const tooltipContent: TooltipContentProps[] = useMemo(
        () => [
            {
                type: 'edit',
                text: 'Редактировать заявку',
                action: onRowClick,
            },
        ],
        [onRowClick]
    );

    return (
        <PageWrapper title="Возвраты" css={{ padding: 0 }}>
            <Block css={{ marginBottom: scale(2) }}>
                <Form<Values> initialValues={values} onSubmit={URLHelper} enableReinitialize>
                    <Block.Body css={{ borderRadius: 0 }}>
                        <Layout cols={{ xxxl: 4, md: 3, sm: 2, xs: 1 }}>
                            <Layout.Item col={1}>
                                <Form.FastField label="ID" name="id" type="number" />
                            </Layout.Item>
                            <Layout.Item col={1}>
                                <Form.Field label="Канал" name="source">
                                    <MultiSelect items={toSelectItems(sourcesData?.data)} />
                                </Form.Field>
                            </Layout.Item>
                            <Layout.Item col={1}>
                                <Form.FastField label="ID заказа" name="order_id" type="number" />
                            </Layout.Item>
                            <Layout.Item col={1}>
                                <Form.FastField label="Ответственный" name="responsible_id">
                                    <Autocomplete searchAsyncFunc={getAdminUserEnumValues} />
                                </Form.FastField>
                            </Layout.Item>
                            {/* <Layout.Item col={1}>
                                <Form.FastField label="Клиент" name="client" />
                            </Layout.Item> */}
                            <Layout.Item col={1}>
                                <Form.Field label="Статус возврата" name="status">
                                    <MultiSelect items={toSelectItems(statusData?.data)} />
                                </Form.Field>
                            </Layout.Item>

                            {/* <Layout.Item col={2}>
                                <Form.FastField label="Дата создания заявки" name="date">
                                    <CalendarRange nameFrom="date_from" nameTo="date_to" />
                                </Form.FastField>
                            </Layout.Item> */}
                        </Layout>
                    </Block.Body>

                    <Block.Footer css={{ justifyContent: 'flex-end' }}>
                        <div css={{ display: 'flex' }}>
                            {filtersActive && (
                                <Form.Reset
                                    theme="fill"
                                    Icon={ResetIcon}
                                    type="button"
                                    initialValues={emptyInitialValues}
                                    onClick={() => push(pathname)}
                                >
                                    Сбросить
                                </Form.Reset>
                            )}

                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Применить
                            </Button>
                        </div>
                    </Block.Footer>
                </Form>
            </Block>

            <Table
                columns={columns}
                data={tableData}
                onSortingChange={setSort}
                renderHeader={() => (
                    <TableHeader css={{ justifyContent: 'space-between' }}>
                        <span>Всего заявок: {total}</span>
                        <Link href="/orders/refunds/settings" passHref>
                            <Button as="a" theme="fill" Icon={SettingIcon}>
                                Настройка причин возврата
                            </Button>
                        </Link>
                    </TableHeader>
                )}
                tooltipContent={tooltipContent}
                onRowClick={onRowClick}
            />
            {tableData.length === 0 ? (
                <TableEmpty
                    filtersActive={filtersActive}
                    titleWithFilters="Заявки на возврат не найдены"
                    titleWithoutFilters="Заявок на возврат нет"
                />
            ) : (
                <TableFooter
                    pages={pages}
                    itemsPerPageCount={itemsPerPageCount}
                    setItemsPerPageCount={setItemsPerPageCount}
                />
            )}
        </PageWrapper>
    );
}
