import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Button, scale, Layout } from '@scripts/gds';

import { FormikValues } from 'formik';
import Form from '@components/controls/Form';
import Block from '@components/Block';
import OldTable from '@components/OldTable';
import Pagination from '@components/controls/Pagination';
import Link from 'next/link';

import { useStores } from '@api/units';
import { getTotalPages } from '@scripts/helpers';

import PlusIcon from '@icons/small/plus.svg';
import { useError } from '@context/modal';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Название склада',
        accessor: 'name',
    },
    {
        Header: 'Адрес склада',
        accessor: 'address',
    },
    {
        Header: 'ФИО контактного лица',
        accessor: 'contactName',
    },
    {
        Header: 'Телефон',
        accessor: 'phone',
    },
];

const emptyInitValues = {
    id: '',
    name: '',
    address_string: '',
    contact_name: '',
    contact_phone: '',
};

const Stores = ({ id }: { id: number }) => {
    const { push } = useRouter();
    const [initialValues, setInitialValues] = useState<FormikValues>(emptyInitValues);

    const { data, error } = useStores({
        filter: {
            id: initialValues.id || undefined,
            name: initialValues.name || undefined,
            address_string: initialValues.address_string || undefined,
            contact_name: initialValues.contact_name || undefined,
            contact_phone: initialValues.contact_phone || undefined,
            seller_id: id,
        },
    });

    const totalPages = getTotalPages(data);

    const stores = useMemo(
        () =>
            data?.data?.map(store => ({
                id: store.id,
                name: store.name,
                address: store.address.address_string,
                contactName: store.contacts.map(contact => contact.name),
                phone: store.contacts.map(contact => contact.phone),
            })) || [],
        [data?.data]
    );

    useError(error);

    return (
        <>
            <Block css={{ marginBottom: scale(3) }}>
                <Form
                    initialValues={initialValues}
                    onSubmit={values => {
                        setInitialValues(values);
                    }}
                    enableReinitialize
                >
                    <Block.Header>
                        <Link href="/stores/seller-stores/create" passHref>
                            <Button size="sm" Icon={PlusIcon}>
                                Создать склад
                            </Button>
                        </Link>
                        <div css={{ button: { marginLeft: scale(2) } }}>
                            <Form.Reset theme="secondary" type="button">
                                Очистить
                            </Form.Reset>
                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Применить
                            </Button>
                        </div>
                    </Block.Header>
                    <Block.Body>
                        <Layout cols={5}>
                            <Layout.Item col={1}>
                                <Form.FastField name="id" label="ID" type="number" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="name" label="Название" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="address_string" label="Адрес склада" />
                            </Layout.Item>
                            <Layout.Item col={3}>
                                <Form.FastField name="contact_name" label="ФИО контактного лица" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="contact_phone" label="Телефон контактного лица" />
                            </Layout.Item>
                        </Layout>
                    </Block.Body>
                </Form>

                <Block.Body css={{ display: 'flex', button: { marginRight: scale(2) } }}>
                    <Link href="/stores/merchant-stores/create" passHref>
                        <Button>Создать склад</Button>
                    </Link>
                </Block.Body>

                <Block.Body>
                    <OldTable
                        columns={COLUMNS}
                        data={stores}
                        editRow={row => push(`/stores/merchant-stores/${row?.id}`)}
                        needCheckboxesCol={false}
                    />
                    <Pagination pages={totalPages} />
                </Block.Body>
            </Block>
        </>
    );
};

export default Stores;
