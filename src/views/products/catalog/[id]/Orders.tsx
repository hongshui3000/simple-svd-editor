import { useState, useMemo } from 'react';
import { scale, Layout, Button } from '@scripts/gds';

import OldTable from '@components/OldTable';

// TODO добавить поддержку calendarInput
// import CalendarInput from '@components/controls/CalendarInput';
import Form from '@components/controls/Form';
import Legend from '@components/controls/Legend';
import Pagination from '@components/controls/Pagination';
import Popup from '@components/controls/Popup';
import Select from '@components/controls/Select';

const COLUMNS = [
    {
        Header: '№ заказа/№ отправления',
        accessor: 'id',
    },
    {
        Header: 'Дата заказа',
        accessor: 'orderDate',
        getProps: () => ({ type: 'date' }),
    },
    {
        Header: 'Дата доставки',
        accessor: 'deliveryDate',
        getProps: () => ({ type: 'date' }),
    },
    {
        Header: 'Сумма, руб.',
        accessor: 'sum',
        getProps: () => ({ type: 'price' }),
    },
    {
        Header: 'Покупатель',
        accessor: 'buyer',
    },
    {
        Header: 'Адрес доставки',
        accessor: 'address',
    },
    {
        Header: 'Дата отгрузки',
        accessor: 'shipmentDate',
        getProps: () => ({ type: 'date' }),
    },
    {
        Header: 'Статус заказа',
        accessor: 'status',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'Статус отправления',
        accessor: 'shipmentStatus',
        getProps: () => ({ type: 'status' }),
    },
];

const tableItem = (num: number) => ({
    id: `1000${num} / 1000${num}-1`,
    orderDate: new Date(),
    deliveryDate: new Date(),
    sum: 233.43,
    buyer: 'Ларионов Александр Петрович',
    address: 'Регион: Московская обл, Город: г Солнечногорск, улица: ул Красная, дом: д 120, этаж: 5, квартира: кв 23',
    shipmentDate: new Date(),
    status: 'В обработке',
    shipmentStatus: 'Ожидание отгрузки в ТК',
});

const makeOrders = (len: number) => [...Array(len).keys()].map(el => tableItem(el));

const Orders = () => {
    const data = useMemo(() => makeOrders(3), []);
    const [isOpen, setIsOpen] = useState(false);
    const [activeRow, setActiveRow] = useState<any>(null);
    // const [startDateOrder, setStartDateOrder] = useState<Date | null>(null);
    // const [endDateOrder, setEndDateOrder] = useState<Date | null>(null);
    // const [startDateDelivery, setStartDateDelivery] = useState<Date | null>(null);
    // const [endDateDelivery, setEndDateDelivery] = useState<Date | null>(null);

    return (
        <>
            <Form
                initialValues={{
                    orderNumber: '',
                    buyer: '',
                    address: '',
                    orderDateFrom: '',
                    orderDateTo: '',
                    deliveryDateFrom: '',
                    deliveryDateTo: '',
                }}
                onSubmit={values => {
                    console.log(values);
                }}
                css={{ marginBottom: scale(4) }}
            >
                <Layout cols={4} css={{ marginBottom: scale(2) }}>
                    <Layout.Item col={1}>
                        <Form.Field name="orderNumber" label="Номер заказа" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="buyer" label="Покупатель" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="address" label="Адрес" />
                    </Layout.Item>
                </Layout>
                <Layout cols={4} css={{ marginBottom: scale(2) }}>
                    <Layout.Item col={2}>
                        <Form.Field name="orderDateFrom">
                            <Legend label="Введите дату от" />
                            {/* <Datepicker
                                selectsStart
                                selected={startDateOrder}
                                startDate={startDateOrder}
                                endDate={endDateOrder}
                                maxDate={endDateOrder}
                                onChange={setStartDateOrder}
                            /> */}
                        </Form.Field>
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="orderDateTo">
                            <Legend label="Введите дату до" />
                            {/* <Datepicker
                                selectsEnd
                                selected={endDateOrder}
                                startDate={startDateOrder}
                                endDate={endDateOrder}
                                minDate={startDateOrder}
                                onChange={setEndDateOrder}
                            /> */}
                        </Form.Field>
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="deliveryDateFrom">
                            <Legend label="Введите дату от" />
                            {/* <Datepicker
                                selectsStart
                                selected={startDateDelivery}
                                startDate={startDateDelivery}
                                endDate={endDateDelivery}
                                maxDate={endDateDelivery}
                                onChange={setStartDateDelivery}
                            /> */}
                        </Form.Field>
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="deliveryDateTo">
                            <Legend label="Введите дату до" />
                            {/* <Datepicker
                                selectsEnd
                                selected={endDateDelivery}
                                startDate={startDateDelivery}
                                endDate={endDateDelivery}
                                minDate={startDateDelivery}
                                onChange={setEndDateDelivery}
                            /> */}
                        </Form.Field>
                    </Layout.Item>
                </Layout>
                <div>
                    <Form.Reset
                        theme="secondary"
                        type="button"
                        // onClick={() => {
                        //     setStartDateDelivery(null);
                        //     setStartDateOrder(null);
                        //     setEndDateDelivery(null);
                        //     setEndDateOrder(null);
                        // }}
                    >
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
                css={{ marginBottom: scale(2) }}
            />
            <Pagination pages={7} />

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

export default Orders;
