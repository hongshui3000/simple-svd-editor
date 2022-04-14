import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { typography, Button, scale, Layout, useTheme } from '@scripts/gds';

import Form from '@components/controls/Form';
import Block from '@components/Block';
import OldTable from '@components/OldTable';
import MultiSelect from '@components/controls/MultiSelect';
import Select from '@components/controls/Select';
import Pagination from '@components/controls/Pagination';
import CalendarRange from '@components/controls/CalendarRange';
import headerWithTooltip from '@components/OldTable/HeaderWithTooltip';
import { useError } from '@context/modal';

import {
    useOrdersSearch,
    useOrderStatuses,
    usePaymentMethods,
    usePaymentStatuses,
    Order,
    OrderStatus,
    OrderListFilterPaymentMethod,
} from '@api/orders';
import { useDeliveryServices } from '@api/logistic/delivery-services';
import { toSelectItems, toISOString } from '@scripts/helpers';
import { apiClient } from '@api/index';

import { CELL_TYPES } from '@scripts/enums';
import Autocomplete from '@components/controls/Autocomplete';

const booleanOptions = [
    { label: 'Нет', value: '0' },
    { label: 'Да', value: '1' },
];

const COLUMNS = [
    {
        Header: '№ заказа',
        accessor: 'linked_num',
        getProps: () => ({ type: CELL_TYPES.LINK }),
    },
    {
        Header: 'Дата заказа',
        accessor: 'created_at',
        getProps: () => ({ type: CELL_TYPES.DATE }),
    },
    {
        Header: 'Статус',
        accessor: 'status',
        getProps: () => ({ type: CELL_TYPES.STATUS }),
    },
    {
        Header: 'Клиент',
        accessor: 'client_info',
    },
    {
        Header: 'Стоимость товаров',
        accessor: 'cost',
        getProps: () => ({ type: CELL_TYPES.PRICE }),
    },
    {
        Header: 'Стоимость доставки',
        accessor: 'delivery_cost',
        getProps: () => ({ type: CELL_TYPES.PRICE }),
    },
    {
        Header: 'Стоимость заказа',
        accessor: 'order_cost',
        getProps: () => ({ type: CELL_TYPES.PRICE }),
    },
    {
        Header: 'Способ оплаты',
        accessor: 'payment_method',
        getProps: () => ({ type: CELL_TYPES.ARRAY }),
    },
    {
        Header: 'Статус оплаты',
        accessor: 'payment_status',
        getProps: () => ({ type: CELL_TYPES.STATUS }),
    },
    {
        Header: () =>
            headerWithTooltip({
                headerText: 'Логистический оператор',
                tooltipText: 'Логистический оператор на последней миле',
            }),
        accessor: 'logistic_operator',
        getProps: () => ({ type: CELL_TYPES.ARRAY }),
    },
    {
        Header: 'Город доставки',
        accessor: 'delivery_city',
        getProps: () => ({ type: CELL_TYPES.ARRAY }),
    },
    {
        Header: 'Кол-во отправлений',
        accessor: 'depart_amount',
        getProps: () => ({ type: CELL_TYPES.ARRAY }),
    },
];

const Offers = () => {
    const { colors } = useTheme();
    const { push } = useRouter();
    const [moreFilters, setMoreFilters] = useState(true);

    interface TInitialValues {
        number_like: string;
        status: OrderStatus | null;
        created_at: Date[];
        payment_method: OrderListFilterPaymentMethod | null;
        created_at_to: number | '';
        created_at_from: number | '';
        price_from: number | null;
        price_to: number | null;
        seller_id: number[] | null;
        store_id: number[] | null;
        delivery_service: number[] | null;
        is_canceled: boolean | null;
        is_problem: boolean | null;
        manager_comment_like: string;
    }

    const [initialValues, setInitialValues] = useState<Partial<TInitialValues>>({
        number_like: '',
        created_at_to: '',
        created_at_from: '',
        status: null,
        payment_method: null,
        price_from: null,
        price_to: null,
        seller_id: null,
        store_id: null,
        delivery_service: null,
        is_canceled: null,
        is_problem: null,
        manager_comment_like: '',
    });

    const { data: orders, error } = useOrdersSearch({
        filter: {
            number_like: undefined,
            created_at_from: initialValues.created_at_from
                ? toISOString(new Date(+initialValues.created_at_from))
                : undefined,
            created_at_to: initialValues.created_at_to
                ? toISOString(new Date(+initialValues.created_at_to))
                : undefined,
            status: initialValues.status || undefined,
            payment_method: initialValues.payment_method || undefined,
            price_from: initialValues.price_from || undefined,
            price_to: initialValues.price_to || undefined,
            'deliveries.shipments.seller_id': initialValues.seller_id || undefined,
            'deliveries.shipments.store_id': initialValues.store_id || undefined,
            // delivery_service: initialValues.delivery_service || undefined,
            is_problem: initialValues.is_problem || undefined,
            manager_comment_like: initialValues.manager_comment_like || undefined,
        },
        include: ['customer', 'customer.user', 'deliveries', 'deliveries.shipments'],
    });

    const { data: apiPaymentMethods, error: errorMethods } = usePaymentMethods();
    const paymentMethods = useMemo(() => toSelectItems(apiPaymentMethods?.data), [apiPaymentMethods]);

    const { data: apiOrderStatuses, error: errorStatuses } = useOrderStatuses();
    const orderStatuses = useMemo(() => toSelectItems(apiOrderStatuses?.data), [apiOrderStatuses]);

    const { data: apiDeliveryServices, error: errorServices } = useDeliveryServices({});
    const deliveryServices = useMemo(() => toSelectItems(apiDeliveryServices?.data), [apiDeliveryServices]);

    const { data: apiPaymentStatuses, error: errorPaymentStatuses } = usePaymentStatuses();

    useError(error || errorMethods || errorStatuses || errorServices || errorPaymentStatuses);

    const loadSellers = async (inputValue?: string) => {
        try {
            const data = { filter: { owner_full_name: inputValue || '' } };
            const apiSellers = await apiClient.post('units/sellers:search', { data });
            return toSelectItems(apiSellers.data);
        } catch {
            return [];
        }
    };

    const loadStores = async (inputValue?: string) => {
        try {
            const data = { filter: { name: inputValue || '' } };
            const apiStores = await apiClient.post('units/stores:search', { data });
            return toSelectItems(apiStores.data);
        } catch {
            return [];
        }
    };

    const tableData = useMemo(
        () =>
            orders?.data?.map((order: Order) => ({
                linked_num: { name: order.number, to: `orders/list/${order.id}` },
                created_at: order.created_at,
                status: apiOrderStatuses?.data.find(s => s.id === order.status)?.name || '',
                // client_info: `${order.customer?.user?.full_name} ${order.customer?.user?.phone || ''}`,
                cost: order.cost,
                delivery_cost: order.delivery_cost,
                order_cost: order.cost + order.delivery_cost,
                payment_method:
                    (order.payment_method && apiPaymentMethods?.data.find(m => m.id === order.payment_method)?.name) ||
                    '',
                payment_status: apiPaymentStatuses?.data.find(s => s.id === order.payment_status)?.name || '',
                // logistic_operator: order.deliveries?.map(
                //     d => apiDeliveryServices?.data.find(s => s.id === d.delivery_service)?.name || ''
                // ),
                // delivery_city: order.deliveries?.map(d => d.delivery_address?.city || ''),
                depart_amount: order.deliveries?.reduce((sum, d) => d.shipments?.length + sum, 0),
            })) || [],
        [orders, apiOrderStatuses, apiPaymentMethods, apiPaymentStatuses]
    );

    return (
        <>
            <Block>
                <Form
                    initialValues={initialValues}
                    onSubmit={values => {
                        setInitialValues(values);
                    }}
                    css={{ marginBottom: scale(3) }}
                    enableReinitialize
                >
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
                            <Form.Reset theme="secondary" type="button">
                                Очистить
                            </Form.Reset>
                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Применить
                            </Button>
                        </div>
                    </Block.Header>
                    <Block.Body>
                        <Layout cols={4}>
                            <Layout.Item col={1}>
                                <Form.FastField name="number_like" label="№ заказа" />
                            </Layout.Item>

                            <Layout.Item col={2}>
                                <CalendarRange
                                    label="Период заказа"
                                    nameTo="created_at_to"
                                    nameFrom="created_at_from"
                                />
                            </Layout.Item>

                            <Layout.Item col={1}>
                                <Form.FastField name="status" label="Статус">
                                    <MultiSelect items={orderStatuses} />
                                </Form.FastField>
                            </Layout.Item>

                            {moreFilters && (
                                <>
                                    <Layout.Item col={4}>
                                        <Layout cols={4}>
                                            <Layout.Item col={1}>
                                                <Form.FastField
                                                    name="price_from"
                                                    label="Сумма заказа"
                                                    type="number"
                                                    placeholder="От"
                                                />
                                            </Layout.Item>

                                            <Layout.Item col={1} css={{ marginTop: scale(3) }} align="end">
                                                <Form.FastField name="price_to" type="number" placeholder="До" />
                                            </Layout.Item>

                                            <Layout.Item col={1}>
                                                <Form.FastField name="seller_id" label="Продавец">
                                                    <Autocomplete searchAsyncFunc={loadSellers} />
                                                </Form.FastField>
                                            </Layout.Item>

                                            <Layout.Item col={1}>
                                                <Form.FastField name="store_id" label="Склад отгрузки">
                                                    <Autocomplete searchAsyncFunc={loadStores} />
                                                </Form.FastField>
                                            </Layout.Item>

                                            <Layout.Item col={1}>
                                                <Form.FastField name="payment_method" label="Способ оплаты">
                                                    <MultiSelect items={paymentMethods} />
                                                </Form.FastField>
                                            </Layout.Item>

                                            <Layout.Item col={1}>
                                                <Form.FastField name="delivery_service" label="Логистический оператор">
                                                    <MultiSelect items={deliveryServices} />
                                                </Form.FastField>
                                            </Layout.Item>
                                        </Layout>
                                    </Layout.Item>

                                    <Layout.Item col={4}>
                                        <Layout cols={4}>
                                            <Layout.Item col={1}>
                                                <Form.FastField name="is_problem" label="Проблемный">
                                                    <Select items={booleanOptions} />
                                                </Form.FastField>
                                            </Layout.Item>

                                            <Layout.Item col={2}>
                                                <Form.FastField
                                                    name="manager_comment_like"
                                                    label="Комментарий менеджера"
                                                />
                                            </Layout.Item>
                                        </Layout>
                                    </Layout.Item>
                                </>
                            )}
                        </Layout>
                    </Block.Body>
                </Form>

                <Block.Body>
                    <div>
                        <OldTable
                            columns={COLUMNS}
                            data={tableData}
                            editRow={row => {
                                if (row) push(`/orders/list/${row.id}`);
                            }}
                            headerCellCSS={{ whiteSpace: 'normal' }}
                        />
                    </div>
                    <Pagination pages={7} />
                </Block.Body>
            </Block>
        </>
    );
};

export default Offers;
