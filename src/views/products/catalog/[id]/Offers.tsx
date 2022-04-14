import { useMemo, useState } from 'react';
import { scale, Layout, Button } from '@scripts/gds';

import OldTable from '@components/OldTable';
import headerWithTooltip from '@components/OldTable/HeaderWithTooltip';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Select from '@components/controls/Select';

import { useFiltersHelper } from '@scripts/hooks';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: 'linkedID' }),
    },
    {
        Header: 'Дата создания',
        accessor: 'created',
        getProps: () => ({ type: 'date' }),
    },
    {
        Header: 'Продавец',
        accessor: 'seller',
        getProps: () => ({ type: 'link' }),
    },
    {
        Header: 'Цена, руб.',
        accessor: 'price',
        getProps: () => ({ type: 'price' }),
    },
    {
        Header: () =>
            headerWithTooltip({
                headerText: 'Суммарный остаток, шт',
                tooltipText:
                    'Остаток оффера по всем складам продавца. \n На витрине выводятся остатки только с одного склада, где их больше всего',
                tooltipPlacement: 'top',
            }),
        accessor: 'residue',
    },
    {
        Header: 'Статус',
        accessor: 'status',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'Ручная сортировка',
        accessor: 'sort',
    },
];

const tableItem = (num: number) => ({
    id: `100${num}`,
    created: new Date(),
    seller: ['Ашан', '/seller/detail/35'],
    price: 320.99,
    residue: 200,
    status: 'В продаже',
    sort: 1,
});

const makeOffers = (len: number) => [...Array(len).keys()].map(el => tableItem(el));

const Offers = () => {
    const emptyInitialValues = {
        offerID: '',
        seller: '',
        status: '',
        priceFrom: '',
        priceTo: '',
        residueFrom: '',
        residueTo: '',
    };

    const data = useMemo(() => makeOffers(3), []);
    const [isOpen, setIsOpen] = useState(false);
    const [activeRow, setActiveRow] = useState<any>(null);

    const { initialValues, URLHelper } = useFiltersHelper(emptyInitialValues);

    return (
        <>
            <Form initialValues={initialValues} onSubmit={values => URLHelper(values)} css={{ marginBottom: scale(4) }}>
                <Layout cols={8} css={{ marginBottom: scale(2) }}>
                    <Layout.Item col={1}>
                        <Form.Field name="offerID" label="ID оффера" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="seller" label="Продавец" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="status" label="Статус" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="priceFrom" label="Цена" type="number" placeholder="От" />
                    </Layout.Item>
                    <Layout.Item col={1} css={{ marginTop: scale(3) }} align="end">
                        <Form.Field name="priceTo" type="number" placeholder="До" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="residueFrom" label="Остаток" type="number" placeholder="От" />
                    </Layout.Item>
                    <Layout.Item col={1} css={{ marginTop: scale(3) }} align="end">
                        <Form.Field name="residueTo" type="number" placeholder="До" />
                    </Layout.Item>
                </Layout>
                <div>
                    <Form.Reset theme="secondary" type="button">
                        Сбросить
                    </Form.Reset>
                    <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                        Применить
                    </Button>
                </div>
            </Form>

            <OldTable
                columns={COLUMNS}
                data={data}
                editRow={row => {
                    setIsOpen(true);
                    setActiveRow(row);
                }}
                needCheckboxesCol={false}
            />
            <Popup
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                title={`Редактировать предложение ${activeRow?.id}`}
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                <Form
                    onSubmit={values => {
                        console.log(values);
                    }}
                    initialValues={{
                        sort: activeRow?.sort,
                        status: activeRow?.status,
                    }}
                    enableReinitialize
                >
                    <Layout cols={2} css={{ marginBottom: scale(2) }}>
                        <Layout.Item col={1}>
                            <Form.Field name="status">
                                <Select
                                    label="В архиве"
                                    defaultIndex={0}
                                    items={[
                                        { value: 'inStock', label: 'В продаже' },
                                        { value: 'inArchive', label: 'В архиве' },
                                        { value: 'notInArchive', label: 'Не в архиве' },
                                    ]}
                                />
                            </Form.Field>
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field name="sort" type="number" label="Сортировка" />
                        </Layout.Item>
                    </Layout>
                    <div css={{ display: 'flex' }}>
                        <Form.Reset theme="outline" onClick={() => setIsOpen(false)} css={{ marginRight: scale(2) }}>
                            Отменить
                        </Form.Reset>
                        <Button type="submit" theme="primary">
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </Popup>
        </>
    );
};

export default Offers;
