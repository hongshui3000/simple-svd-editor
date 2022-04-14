import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FormikValues } from 'formik';

import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';
import OldTable, { TableRowProps } from '@components/OldTable';

import Select from '@components/controls/Select';
import Pagination from '@components/controls/Pagination';
import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';

import { scale, Layout, Button } from '@scripts/gds';
import PlusIcon from '@icons/small/plus.svg';
import { useDeleteProductGroup, useProductGroups, useProductGroupTypes } from '@api/catalog';
import { useFiltersHelper } from '@scripts/hooks';
import { useProductTypesSelectable } from '@scripts/hooks/useProductTypesSelectable';

type FilterForm = {
    id: string;
    type_id: string;
};

export async function getServerSideProps() {
    return {
        props: {},
    };
}

const columns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Видимость',
        accessor: 'visibility',
    },
    {
        Header: 'Изображение',
        accessor: 'photo',
        getProps: () => ({ type: 'photo' }),
    },
    {
        Header: 'Название',
        accessor: 'title',
    },
    {
        Header: 'Тип',
        accessor: 'type',
    },
];

const Filter = ({
    onSubmit,
    onReset,
    initialValues,
    emptyValues,
}: {
    onSubmit: (vals: FormikValues) => void;
    onReset: (vals: FormikValues) => void;
    initialValues: FormikValues;
    emptyValues: FormikValues;
}) => {
    const preparedTypes = useProductTypesSelectable();

    return (
        <Form onSubmit={onSubmit} initialValues={initialValues} onReset={onReset}>
            <Layout cols={4} css={{ marginBottom: scale(2) }}>
                <Layout.Item col={1}>
                    <Form.FastField name="id" label="ID" autoComplete="off" />
                </Layout.Item>
                <Layout.Item col={1}>
                    <Form.Field name="type_id" label="Тип">
                        <Select items={preparedTypes} />
                    </Form.Field>
                </Layout.Item>
            </Layout>
            <Form.Reset theme="fill" css={{ marginRight: scale(2) }} initialValues={emptyValues}>
                Очистить
            </Form.Reset>
            <Button type="submit">Применить</Button>
        </Form>
    );
};

const ContentProductGroups = () => {
    const initFilter: FilterForm = {
        id: '',
        type_id: '',
    };

    const { initialValues, URLHelper } = useFiltersHelper(initFilter);

    const [filter, setFilter] = useState({});

    useEffect(() => {
        setFilter({
            id: initialValues.id.length ? initialValues.id : undefined,
            type_id: initialValues.type_id.length ? initialValues.type_id : undefined,
        });
    }, [initialValues.id, initialValues.type_id]);

    const { data: apiProductGroups } = useProductGroups({
        sort: ['id'],
        include: [],
        pagination: {
            limit: 10,
            offset: 0,
            type: 'offset',
        },
        filter,
    });

    const { data: apiGroupTypes } = useProductGroupTypes({
        include: [],
        pagination: {
            limit: 10,
            type: 'offset',
            offset: 0,
        },
        sort: ['id'],
    });

    const data = useMemo(
        () =>
            apiProductGroups?.data?.map(e => ({
                id: `${e.id}`,
                visibility: e.is_shown ? 'Видим' : 'Не видим',
                photo: e.preview_photo || '',
                title: e.name,
                type: apiGroupTypes?.data?.find(t => t.id === e.type_id)?.name || '',
            })) || [],
        [apiProductGroups?.data, apiGroupTypes?.data]
    );

    const pages = useMemo(
        () =>
            apiProductGroups?.meta.pagination
                ? Math.floor(apiProductGroups.meta.pagination.total / apiProductGroups.meta.pagination.limit) + 1
                : 0,
        [apiProductGroups?.meta.pagination]
    );

    const deleteProductGroup = useDeleteProductGroup();

    const { push } = useRouter();
    const [rowToDelete, setRowToDelete] = useState<TableRowProps | null>(null);

    return (
        <PageWrapper h1="Подборки">
            <Block css={{ marginBottom: scale(2) }}>
                <Block.Body>
                    <Filter
                        initialValues={initialValues}
                        emptyValues={initFilter}
                        onReset={val => URLHelper(val)}
                        onSubmit={val => URLHelper(val)}
                    />
                </Block.Body>
            </Block>

            <Link href="/content/product-groups/create" passHref>
                <Button css={{ marginBottom: scale(2) }} Icon={PlusIcon}>
                    Создать
                </Button>
            </Link>
            <Block>
                <Block.Body>
                    <OldTable
                        needCheckboxesCol={false}
                        editRow={val => (val ? push(`/content/product-groups/${val.id}`) : '')}
                        deleteRow={val => setRowToDelete(val || null)}
                        columns={columns}
                        data={data}
                        css={{ marginBottom: scale(2) }}
                    />
                    <Pagination pages={pages} />
                </Block.Body>
            </Block>
            <Popup
                isOpen={!!rowToDelete}
                onRequestClose={() => setRowToDelete(null)}
                title="Вы уверены, что хотите удалить подборку?"
                popupCss={{ minWidth: scale(50) }}
            >
                {rowToDelete ? (
                    <p css={{ marginBottom: scale(2) }}>
                        #{rowToDelete.id} – {rowToDelete.title}
                    </p>
                ) : (
                    ''
                )}
                <Button
                    type="submit"
                    onClick={() => {
                        // TODO: проверить что удаление работает (баг бэка)
                        if (rowToDelete) {
                            deleteProductGroup.mutate({
                                id: rowToDelete.id,
                            });
                            setRowToDelete(null);
                        }
                    }}
                >
                    Удалить
                </Button>
            </Popup>
        </PageWrapper>
    );
};

export default ContentProductGroups;
