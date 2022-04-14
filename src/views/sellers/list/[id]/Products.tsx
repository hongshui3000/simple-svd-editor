import { useMemo, useState } from 'react';

import { typography, Button, scale, Layout, useTheme } from '@greensight/gds';
import { makeSellerProducts } from '@scripts/mock';
import { STATUSES } from '@scripts/data/different';

import Form from '@components/controls/Form';
import Block from '@components/Block';
import OldTable from '@components/OldTable';
import Select from '@components/controls/Select';
import CalendarRange from '@components/controls/CalendarRange';
import Pagination from '@components/controls/Pagination';

const statuses = STATUSES.map(i => ({ label: i, value: i }));

const COLUMNS = [
    {
        Header: 'ID оффера',
        accessor: 'id',
    },
    {
        Header: 'Название оффера',
        accessor: 'title',
    },
    {
        Header: 'Статус',
        accessor: 'status',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'Текущая цена, руб',
        accessor: 'price',
        getProps: () => ({ type: 'price' }),
    },
    {
        Header: 'Текущий остаток товаров оффера, шт',
        accessor: 'quantity',
    },
    {
        Header: 'Дата создания оффера',
        accessor: 'date',
        getProps: () => ({ type: 'date' }),
    },
];

const Products = () => {
    const { colors } = useTheme();

    const data = useMemo(() => makeSellerProducts(10), []);
    const [moreFilters, setMoreFilters] = useState(true);

    return (
        <>
            <Block css={{ marginBottom: scale(3) }}>
                <Form
                    initialValues={{
                        id: '',
                        name: '',
                        email: '',
                        login: '',
                        phone: '',
                        date: [null, null],
                    }}
                    onSubmit={values => {
                        console.log(values);
                    }}
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
                            <Form.Reset
                                theme="secondary"
                                type="button"
                                onClick={() => {
                                    console.log('reset');
                                }}
                            >
                                Очистить
                            </Form.Reset>
                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Применить
                            </Button>
                        </div>
                    </Block.Header>
                    <Block.Body>
                        <Layout cols={8}>
                            <Layout.Item col={4}>
                                <Form.Field name="id" label="ID оффера" />
                            </Layout.Item>
                            <Layout.Item col={4}>
                                <Form.Field name="name" label="Название оффера" />
                            </Layout.Item>
                            {moreFilters && (
                                <>
                                    <Layout.Item col={4}>
                                        <Form.Field name="status" label="Статус оффера">
                                            <Select items={statuses} />
                                        </Form.Field>
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <Form.Field
                                            name="priceFrom"
                                            label="Текщая цена оффера, руб"
                                            placeholder="от"
                                            type="number"
                                        />
                                    </Layout.Item>
                                    <Layout.Item col={2} align="end">
                                        <Form.Field name="priceTo" placeholder="до" type="number" />
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <Form.Field
                                            name="qtyFrom"
                                            label="Текщий остаток оффера, шт"
                                            placeholder="от"
                                            type="number"
                                        />
                                    </Layout.Item>
                                    <Layout.Item col={2} align="end">
                                        <Form.Field name="qtyTo" placeholder="до" type="number" />
                                    </Layout.Item>
                                    <Layout.Item col={4}>
                                        <Form.Field name="date">
                                            <CalendarRange
                                                label="Дата создания"
                                                nameFrom="date_from"
                                                nameTo="date_to"
                                            />
                                        </Form.Field>
                                    </Layout.Item>
                                </>
                            )}
                        </Layout>
                    </Block.Body>
                </Form>
                <Block.Body css={{ display: 'flex', button: { marginRight: scale(2) } }}>
                    <Button>Сменить статус офферов</Button>
                    <Button>Редактировать оффер</Button>
                    <Button theme="outline">Удалить офферы</Button>
                </Block.Body>

                <Block.Body>
                    <OldTable columns={COLUMNS} data={data} editRow={() => console.log('click')} />
                    <Pagination pages={7} />
                </Block.Body>
            </Block>
        </>
    );
};

export default Products;
