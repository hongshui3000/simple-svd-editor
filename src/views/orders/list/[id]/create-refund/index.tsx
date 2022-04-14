import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import * as Yup from 'yup';

import { Button, Layout, scale, useTheme } from '@scripts/gds';

import {
    OrderSources,
    BasketItem,
    useOrderDetail,
    useRefundReasons,
    useCreateRefund,
    useRefundAddFile,
    RefundStatuses,
} from '@api/orders';

import { useError, useSuccess, useModalsContext } from '@context/modal';
import CheckIcon from '@icons/small/check.svg';

import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';
import Table, { ExtendedColumn, Cell, getSelectColumn, Data } from '@components/Table';

import Form from '@components/controls/Form';
import MultiSelect from '@components/controls/MultiSelect';
import Legend from '@components/controls/Legend';
import Textarea from '@components/controls/Textarea';
import Dropzone from '@components/controls/Dropzone';

import { ErrorMessages, ModalMessages } from '@scripts/constants';
import { usePrevious } from '@scripts/hooks';
import { toSelectItems } from '@scripts/helpers';
import { useCurrentUser } from '@api/auth';
import { Aside } from '../Aside';

export const columns: ExtendedColumn[] = [
    { ...getSelectColumn() },
    {
        accessor: 'id',
        Header: 'ID',
    },
    {
        accessor: 'photo',
        Header: 'Фото',
        Cell: ({ value }) => <Cell value={value} type="photo" />,
    },
    {
        accessor: 'name',
        Header: 'Название и артикул',
        Cell: ({ value }) => {
            const { colors } = useTheme();
            return (
                <>
                    <p css={{ marginBottom: scale(1) }}>{value.name}</p>
                    <p css={{ color: colors?.grey700 }}>{value.barcode}</p>
                </>
            );
        },
    },
    {
        accessor: 'price',
        Header: 'Цена и цена без скидки,  ₽',
        Cell: ({ value }: { value: number[] }) => {
            const { colors } = useTheme();
            return value.map((v, index) => (
                <p css={index > 0 && { color: colors?.grey700 }} key={index + v}>
                    <Cell value={v} type="price" />
                </p>
            ));
        },
    },
    {
        accessor: 'qty',
        Header: 'Количество',
    },
    {
        accessor: 'cost',
        Header: 'Стоимость,  ₽',
        Cell: ({ value }) => <Cell value={value} type="price" />,
    },
    {
        accessor: 'refundQty',
        Header: 'К возврату',
        Cell: ({ value, row }) => (
            <Form.FastField type="number" min={1} max={value} name={`products.${row.index}.qty`} />
        ),
    },
];

interface Product {
    isReturn: boolean;
    id: number;
    qty: number;
}

const ProductsTableHeader = (selectedRows: Data[]) => {
    const { values, setFieldValue } = useFormikContext<{ products: Product[] }>();
    const selectedRowIds = useMemo(() => selectedRows.map(r => r.id), [selectedRows]);
    const { products } = values;
    const selectedQt = selectedRowIds.length;
    const prevSelectedQt = usePrevious(selectedQt);
    useEffect(() => {
        if (prevSelectedQt !== selectedQt) {
            const updatedProducts = [...products];
            updatedProducts.forEach(p => {
                p.isReturn = selectedRowIds.includes(p.id);
            });
            setFieldValue('products', updatedProducts);
        }
    }, [selectedRowIds, setFieldValue, products, prevSelectedQt, selectedQt]);

    return null;
};

export default function OrderPage() {
    const { query } = useRouter();
    const orderId = (query && query.id && +query.id) || 0;

    const { data, isIdle, isLoading, error } = useOrderDetail(orderId, [
        'deliveries',
        'deliveries.shipments',
        'deliveries.shipments.orderItems',
        'customer',
        'customer.user',
        'responsible',
    ]);

    const createRefund = useCreateRefund();
    const addFile = useRefundAddFile();
    const { appendModal } = useModalsContext();

    const order = useMemo(() => data?.data, [data?.data]);

    const tableData = useMemo(() => {
        const products =
            order?.deliveries?.reduce((acc, val) => {
                const items = val.shipments.reduce((acc2, val2) => [...acc, ...val2.order_items], [] as BasketItem[]);
                return [...acc, ...items];
            }, [] as BasketItem[]) || [];

        return products.map(item => ({
            id: item.id,
            photo: item.product?.images[0]?.file,
            name: {
                name: item.name,
                code: item.product_data?.barcode,
            },
            price: [item.price_per_one, item.cost_per_one],
            qty: item.qty,
            cost: item.price,
            refundQty: item.qty,
        }));
    }, [order?.deliveries]);

    const { data: refundReasonsData, error: refundReasonsError } = useRefundReasons();
    useError(error);
    useError(addFile.error);
    useError(refundReasonsError);
    useError(createRefund.error);

    useSuccess(createRefund.status === 'success' ? ModalMessages.SUCCESS_SAVE : '');

    const initialProducts = useMemo(() => tableData.map(p => ({ isReturn: false, id: p.id, qty: p.qty })), [tableData]);

    const validateProductsQt = useCallback(
        (products: Product[]) =>
            products.some(p => {
                if (p.isReturn) {
                    const maxQt = initialProducts.find(i => i.id === p.id)?.qty || 0;
                    if (maxQt && (p.qty > maxQt || p.qty < 1)) {
                        return true;
                    }
                }
                return false;
            }),
        [initialProducts]
    );

    const { data: userData } = useCurrentUser();

    return (
        <PageWrapper
            h1={`Создание заявки на возврат для заказа №${order?.number || ''}`}
            isLoading={isIdle || isLoading}
        >
            <Form
                initialValues={{
                    products: JSON.parse(JSON.stringify(initialProducts)),
                    reasons: [],
                    comment: '',
                    files: [],
                }}
                validationSchema={Yup.object().shape({
                    reasons: Yup.array().min(1, ErrorMessages.MIN_ITEMS(1)),
                    comment: Yup.string().required(ErrorMessages.REQUIRED),
                })}
                enableReinitialize
                onSubmit={vals => {
                    if (validateProductsQt(vals.products as Product[])) {
                        appendModal({
                            message:
                                'Количество товара к возврату не может быть больше приобретенного количества или меньше 1',
                            theme: 'error',
                        });
                        return;
                    }
                    const productsToRefund = vals.products as Product[];
                    const order_items = productsToRefund.reduce((acc, product) => {
                        if (product.isReturn) {
                            acc.push({ id: product.id, qty: product.qty });
                        }
                        return acc;
                    }, [] as { id: number; qty: number }[]);

                    createRefund
                        .mutateAsync({
                            order_id: orderId,
                            source: OrderSources.ADMIN,
                            user_comment: vals.comment,
                            refund_reason_ids: vals.reasons,
                            order_items,
                            manager_id: userData?.data.id || null,
                            responsible_id: null,
                            rejection_comment: null,
                            status: RefundStatuses.NEW,
                        })
                        .then(refund => {
                            const { id } = refund.data;
                            vals.files.forEach((file: File) => {
                                addFile.mutate({ id, file });
                            });
                        });
                }}
                css={{ position: 'relative' }}
            >
                {({ dirty }: FormikProps<FormikValues>) => (
                    <>
                        <div css={{ display: 'flex', position: 'absolute', top: '-40px', right: 0 }}>
                            <Button type="submit" Icon={CheckIcon} iconAfter disabled={!dirty}>
                                Создать заявку
                            </Button>
                        </div>
                        <div css={{ display: 'flex', gap: scale(2) }}>
                            <div css={{ flexGrow: 1, flexShrink: 1 }}>
                                <Block css={{ padding: scale(3) }}>
                                    <Layout cols={2}>
                                        <Layout.Item col={2}>
                                            <Legend label="Товары к возврату" />
                                            <Table
                                                data={tableData}
                                                columns={columns}
                                                renderHeader={ProductsTableHeader}
                                            />
                                        </Layout.Item>
                                        <Layout.Item col={2}>
                                            <Form.Field name="reasons" label="Причина возврата">
                                                <MultiSelect items={toSelectItems(refundReasonsData?.data)} />
                                            </Form.Field>
                                        </Layout.Item>
                                        <Layout.Item col={2}>
                                            <Form.FastField name="comment" label="Комментарий">
                                                <Textarea minRows={3} />
                                            </Form.FastField>
                                        </Layout.Item>
                                        <Layout.Item col={2}>
                                            <Form.FastField name="files" label="Файл">
                                                <Dropzone />
                                            </Form.FastField>
                                        </Layout.Item>
                                    </Layout>
                                </Block>
                            </div>
                            <Aside order={order} />
                        </div>
                    </>
                )}
            </Form>
        </PageWrapper>
    );
}
