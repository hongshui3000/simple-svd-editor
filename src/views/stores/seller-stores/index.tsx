import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FormikValues } from 'formik';

import OldTable from '@components/OldTable';
import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import MultiSelect from '@components/controls/MultiSelect';
import { sellers } from '@scripts/mock';
import Pagination from '@components/controls/Pagination';

import { Button, scale, Layout, typography } from '@scripts/gds';
import { useFiltersHelper } from '@scripts/hooks';

import PlusIcon from '@icons/small/plus.svg';

import { useStores } from '@api/units';
import { LIMIT_PAGE } from '@scripts/constants';
import { getTotalPages } from '@scripts/helpers';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Название',
        accessor: 'title',
        getProps: () => ({ type: 'link' }),
    },
    {
        Header: 'Продавец',
        accessor: 'seller',
    },
    {
        Header: 'Населенный пункт',
        accessor: 'city',
    },
];

const SELLERS = sellers.map(i => ({ label: i, value: i }));

const Filters = ({
    className,
    initialValues,
    emptyInitialValues,
    onSubmit,
    onReset,
}: {
    className?: string;
    onSubmit: (vals: FormikValues) => void;
    onReset?: (vals: FormikValues) => void;
    emptyInitialValues: FormikValues;
    initialValues: FormikValues;
}) => (
    <>
        <Block className={className}>
            <Form initialValues={initialValues} onSubmit={onSubmit} onReset={onReset}>
                <Block.Body>
                    <Layout cols={8}>
                        <Layout.Item col={2}>
                            <Form.Field name="sellerID" label="ID продавца" />
                        </Layout.Item>
                        <Layout.Item col={2}>
                            <Form.Field name="seller" label="Продавец">
                                <MultiSelect items={SELLERS} />
                            </Form.Field>
                        </Layout.Item>
                        <Layout.Item col={2}>
                            <Form.Field name="title" label="Название" />
                        </Layout.Item>
                        <Layout.Item col={2}>
                            <Form.Field name="sity" label="Населенный пункт" />
                        </Layout.Item>
                    </Layout>
                </Block.Body>
                <Block.Footer>
                    <div css={typography('bodySm')}>Найдено 135 предложений </div>
                    <div>
                        <Form.Reset theme="secondary" type="button" initialValues={emptyInitialValues}>
                            Сбросить
                        </Form.Reset>
                        <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                            Применить
                        </Button>
                    </div>
                </Block.Footer>
            </Form>
        </Block>
    </>
);

const SellerStores = () => {
    const { query } = useRouter();
    const activePage = Number(query.page || 1);
    // const data = useMemo(() => makeStores(10), []);

    // const [ids, setIds, selectedRows] = useSelectedRowsData<typeof data[0]>(data);

    const emptyInitialValues = {
        sellerID: [],
        title: '',
        sity: '',
        seller: [],
    };

    const { initialValues, URLHelper } = useFiltersHelper(emptyInitialValues);

    const { data } = useStores({
        // filter: {};
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) / LIMIT_PAGE },
    });
    const totalPages = getTotalPages(data);
    const tableData = useMemo(() => data?.data || [], []);

    return (
        <PageWrapper h1="Склады продавцов">
            <>
                <Filters
                    initialValues={initialValues}
                    emptyInitialValues={emptyInitialValues}
                    onSubmit={vals => {
                        URLHelper(vals);
                    }}
                    css={{ marginBottom: scale(3) }}
                />

                <Link href="/stores/seller-stores/create" passHref>
                    <Button Icon={PlusIcon} as="a" css={{ marginRight: scale(2), marginBottom: scale(2) }}>
                        Добавить склад
                    </Button>
                </Link>
                {/* {ids.length > 0 ? (
                    <Button

                        Icon={TrashIcon}
                        css={{ marginRight: scale(2) }}
                        onClick={() => setIsDeleteOpen(true)}
                    >
                        Удалить склад{ids.length > 1 && 'ы'}
                    </Button>
                ) : null} */}
                <Block>
                    <Block.Body>
                        {tableData.length > 0 ? (
                            <OldTable columns={COLUMNS} data={tableData} needSettingsColumn={false} />
                        ) : (
                            <p>Склады продавцов не найдены</p>
                        )}
                        <Pagination pages={totalPages} />
                    </Block.Body>
                </Block>
                {/* <Popup
                    isOpen={idDeleteOpen}
                    onRequestClose={() => setIsDeleteOpen(false)}
                    title="Вы уверены, что хотите удалить следующие склады?"
                    popupCss={{ minWidth: scale(50) }}
                >
                    <ul css={{ marginBottom: scale(2) }}>
                        {selectedRows.map(r => (
                            <li key={r.id} css={{ marginBottom: scale(1, true) }}>
                                #{r.id} – {r.title[0]}
                            </li>
                        ))}
                    </ul>
                    <Button >Удалить</Button>
                </Popup> */}
            </>
        </PageWrapper>
    );
};

export default SellerStores;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
