import { useState, useMemo } from 'react';

import { Button, scale, Layout } from '@scripts/gds';
import { makeSellerBilling } from '@scripts/mock';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Textarea from '@components/controls/Textarea';
import Pagination from '@components/controls/Pagination';

import CalendarRange from '@components/controls/CalendarRange';
import Block from '@components/Block';
import OldTable from '@components/OldTable';

const COLUMNS = [
    {
        Header: 'ID заказа/транзакции',
        accessor: 'id',
    },
    {
        Header: 'Дата',
        accessor: 'date',
        getProps: () => ({ type: 'date' }),
    },
    {
        Header: 'Комментарий',
        accessor: 'comment',
    },
    {
        Header: 'Сумма',
        accessor: 'sum',
    },
    {
        Header: 'Операция',
        accessor: 'operation',
    },
];

const Billing = () => {
    const [isCorrectingPopupOpen, setIsCorrectingPopupOpen] = useState(false);

    const data = useMemo(() => makeSellerBilling(10), []);

    const dataTable = [
        {
            id: 'Всего',
            date: '',
            comment: '',
            sum: data.reduce((acc, { sum }) => acc + sum, 0 as number),
            operation: <Button onClick={() => setIsCorrectingPopupOpen(true)}>Корректировка</Button>,
        },
        ...data,
    ];

    console.log(dataTable);

    return (
        <>
            <Block css={{ marginBottom: scale(3) }}>
                <Form
                    initialValues={{
                        period: '',
                        date: [null, null],
                    }}
                    onSubmit={values => {
                        console.log(values);
                    }}
                >
                    <Block.Header>
                        <h2>Настройка</h2>
                        <div css={{ button: { marginLeft: scale(2) } }}>
                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Сохранить
                            </Button>
                        </div>
                    </Block.Header>
                    <Block.Body>
                        <Form.Field
                            name="period"
                            label="Биллинговый период, кол-во дней"
                            type="number"
                            css={{ maxWidth: scale(40) }}
                        />
                    </Block.Body>
                </Form>
                <Form
                    initialValues={{
                        period: '',
                    }}
                    onSubmit={values => {
                        console.log(values);
                    }}
                >
                    <Block.Header>
                        <h2>Отчеты</h2>
                        <div css={{ button: { marginLeft: scale(2) } }}>
                            <Button theme="primary" type="submit">
                                Сделать внеочередной биллинг
                            </Button>
                        </div>
                    </Block.Header>
                    <Block.Body>
                        <Layout cols={2} gap={scale(1)} css={{ maxWidth: scale(60) }}>
                            <Layout.Item col={2}>
                                <CalendarRange label="Дата" nameFrom="date_from" nameTo="date_to" />
                            </Layout.Item>
                        </Layout>
                    </Block.Body>
                </Form>

                <Block.Body>
                    <OldTable columns={COLUMNS} data={dataTable} editRow={() => console.log('click')} />
                    <Pagination pages={7} />
                </Block.Body>
            </Block>
            <Popup
                isOpen={isCorrectingPopupOpen}
                onRequestClose={() => {
                    setIsCorrectingPopupOpen(false);
                }}
                title="Корректировка биллинга"
                popupCss={{ minWidth: scale(50) }}
            >
                <Form
                    onSubmit={values => {
                        console.log(values);
                    }}
                    initialValues={{
                        sum: '',
                        comment: '',
                    }}
                >
                    <Layout cols={1} gap={scale(2)}>
                        <Layout.Item col={1}>
                            <Form.Field type="number" name="sum" label="Сумма" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field name="message" label="Сообщение">
                                <Textarea rows={3} />
                            </Form.Field>
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Button type="submit" theme="primary">
                                Сохранить
                            </Button>
                        </Layout.Item>
                    </Layout>
                </Form>
            </Popup>
        </>
    );
};

export default Billing;
