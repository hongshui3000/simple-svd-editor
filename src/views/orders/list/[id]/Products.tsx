import { useMemo } from 'react';
import Link from 'next/link';

import { Order, OrderShipment } from '@api/orders';
import { useGetSellerById, useStore } from '@api/units';

import { scale, typography, useTheme } from '@scripts/gds';
import { useLinkCSS } from '@scripts/hooks';
import { formatDate, formatPrice, fromKopecksToRouble } from '@scripts/helpers';

import Table, { ExtendedColumn, Cell } from '@components/Table';
import Block from '@components/Block';

export const columns: ExtendedColumn[] = [
    {
        accessor: 'photo',
        Header: 'Фото',
        Cell: ({ value }) => <Cell value={value} type="photo" />,
    },
    {
        accessor: 'name',
        Header: 'Название и артикул',
        Cell: ({ value }) => {
            const linkStyles = useLinkCSS();
            const { colors } = useTheme();
            return (
                <>
                    <p css={{ marginBottom: scale(1) }}>
                        <Link passHref href={value.link}>
                            <a css={linkStyles}>{value.name}</a>
                        </Link>
                    </p>
                    <p css={{ color: colors?.grey700 }}>{value.barcode}</p>
                </>
            );
        },
    },
    {
        accessor: 'seller',
        Header: 'Продавец и склад',
        Cell: ({ value }) => {
            const linkStyles = useLinkCSS();
            return (
                <>
                    <p css={{ marginBottom: scale(1) }}>
                        <Link passHref href={value.sellerLink}>
                            <a css={linkStyles}>{value.sellerName}</a>
                        </Link>
                    </p>
                    <p>
                        <Link passHref href={value.storeLink}>
                            <a css={linkStyles}>{value.storeName}</a>
                        </Link>
                    </p>
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
                <p css={index > 0 && { color: colors?.grey700 }}>
                    <Cell key={index} value={v} type="price" />
                </p>
            ));
        },
    },
    {
        accessor: 'quantity',
        Header: 'Количество',
    },
    {
        accessor: 'count',
        Header: 'Наличие',
    },
    {
        accessor: 'cost',
        Header: 'Стоимость,  ₽',
        Cell: ({ value }) => <Cell value={value} type="price" />,
    },
];

export const Shipment = ({ shipment }: { shipment: OrderShipment }) => {
    const { data: sellerData } = useGetSellerById(shipment.seller_id);
    const { data: storeData } = useStore(shipment.store_id);

    const data = useMemo(
        () =>
            shipment.order_items.map(item => ({
                id: item.id,
                photo: item.product?.images[0]?.file,
                name: {
                    name: item.name,
                    code: item.product_data?.barcode,
                    link: `/products/catalog/${item.product_data.external_id}`,
                },
                seller: {
                    sellerName: sellerData?.data.legal_name,
                    sellerLink: `/sellers/list/${sellerData?.data.id}`,
                    storeName: storeData?.data.name,
                    storeLink: `/stores/seller-stores/${storeData?.data.id}`,
                },
                price: [item.price_per_one, item.cost_per_one],
                quantity: item.qty,
                cost: item.price,
            })),
        [
            sellerData?.data.id,
            sellerData?.data.legal_name,
            shipment.order_items,
            storeData?.data.id,
            storeData?.data.name,
        ]
    );

    return (
        <div>
            <p css={{ ...typography('h3'), marginBottom: scale(2) }}>Отправление - {shipment.number}</p>
            <Table columns={columns} data={data} allowRowSelect={false} allowColumnOrder={false} disableSortBy />
        </div>
    );
};

export const Products = ({ order }: { order: Order | undefined }) => (
    <Block css={{ padding: scale(3) }}>
        <ul>
            {order?.deliveries?.map((delivery, i) => (
                <li key={delivery.number} css={i > 0 && { marginTop: scale(4) }}>
                    <p
                        css={{
                            ...typography('h2'),
                            marginBottom: scale(2),
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>Доставка - {delivery.number}</span>{' '}
                        <span>
                            {delivery.date ? formatDate(new Date(delivery.date), 'dd MMMM yyyy') : 'Дата не выбрана'}
                        </span>
                    </p>
                    <ul>
                        {delivery.shipments.map((shipment, j) => (
                            <li key={shipment.id} css={j > 0 && { marginTop: scale(3) }}>
                                <Shipment shipment={shipment} />
                                <p
                                    css={{
                                        marginTop: scale(2),
                                        marginBottom: scale(1),
                                    }}
                                >
                                    <span css={typography('bodySmBold')}>Количество товаров: </span>
                                    {shipment.order_items.reduce((acc, val) => acc + val.qty, 0)}
                                </p>
                                <p>
                                    <span css={typography('bodySmBold')}>Итого:</span>{' '}
                                    {formatPrice(fromKopecksToRouble(+shipment.cost))} ₽
                                </p>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    </Block>
);
