import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormikValues } from 'formik';

import { Button, Layout, scale, typography } from '@scripts/gds';
import { useFiltersHelper } from '@scripts/hooks';
import { LIMIT_PAGE } from '@scripts/constants';
import { getTotalPages, getTotal } from '@scripts/helpers';

import Form from '@components/controls/Form';
import Pagination from '@components/controls/Pagination';

import PageWrapper from '@components/PageWrapper';
import OldTable from '@components/OldTable';
import Block from '@components/Block';

import { MenuFilter } from '@api/content/types/menus';
import { useMenus } from '@api/content/menu';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Код',
        accessor: 'code',
    },
    {
        Header: 'Название',
        accessor: 'title',
        getProps: () => ({ type: 'link' }),
    },
];

export async function getServerSideProps() {
    return {
        props: {},
    };
}

type FilterForm = {
    [key in keyof MenuFilter]?: string;
};

const Filter = ({
    onSubmit,
    onReset,
    initialValues,
    emptyValues,
}: {
    onSubmit: (vals: FormikValues) => void;
    onReset: (vals: FormikValues) => any;
    initialValues: FormikValues;
    emptyValues: FormikValues;
}) => (
    <Form onSubmit={onSubmit} initialValues={initialValues} onReset={onReset} css={{ marginBottom: scale(2) }}>
        <Layout cols={4} css={{ marginBottom: scale(2) }}>
            <Layout.Item col={1}>
                <Form.FastField name="id" label="ID" autoComplete="off" />
            </Layout.Item>
            <Layout.Item col={1}>
                <Form.FastField name="code" label="Код" autoComplete="off" />
            </Layout.Item>
        </Layout>
        <Form.Reset theme="fill" css={{ marginRight: scale(2) }} initialValues={emptyValues}>
            Очистить
        </Form.Reset>
        <Button type="submit">Применить</Button>
    </Form>
);

const Menu = () => {
    const initFilter: FilterForm = {
        id: '',
        code: '',
    };

    const { push, pathname, query } = useRouter();
    const { initialValues, URLHelper } = useFiltersHelper(initFilter);

    const activePage = +(query?.page || 1);

    const {
        data: apiMenus,
        isIdle,
        isLoading,
    } = useMenus({
        sort: ['id'],
        include: ['items'],
        filter: {
            id: initialValues.id.length ? +initialValues.id : undefined,
            code: initialValues.code.length ? initialValues.code : undefined,
        },
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });

    const totalPages = getTotalPages(apiMenus);
    const total = getTotal(apiMenus);

    const data = useMemo(
        () =>
            apiMenus?.data?.map(e => ({
                id: e.id,
                code: e.code,
                title: [e.name, `/content/menu/${e.id}`],
            })) || [],
        [apiMenus?.data]
    );

    return (
        <PageWrapper h1="Меню" isLoading={isLoading || isIdle}>
            <Block css={{ marginTop: scale(2) }}>
                <Block.Body>
                    <Filter
                        initialValues={initialValues}
                        emptyValues={initFilter}
                        onReset={() => push(pathname)}
                        onSubmit={val => URLHelper(val)}
                    />
                    <div css={{ ...typography('bodySm'), marginBottom: scale(2) }}>Всего найдено меню: {total}.</div>
                    {data.length < 1 ? (
                        <p css={typography('bodyMd')}>Ни одного меню не найдено.</p>
                    ) : (
                        <OldTable
                            columns={COLUMNS}
                            data={data}
                            // editRow={row => console.log('rowdata', row)}
                            needCheckboxesCol={false}
                            needSettingsColumn={false}
                        />
                    )}
                    <Pagination pages={totalPages} css={{ marginTop: scale(2) }} />
                </Block.Body>
            </Block>
        </PageWrapper>
    );
};

export default Menu;
