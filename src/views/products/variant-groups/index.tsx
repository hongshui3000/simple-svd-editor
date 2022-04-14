import { useMemo } from 'react';
import Link from 'next/link';
import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import OldTable from '@components/OldTable';

import Form from '@components/controls/Form';
import Pagination from '@components/controls/Pagination';
import Popup from '@components/controls/Popup';

import { ActionType, CELL_TYPES } from '@scripts/enums';
import { Button, scale, Layout, typography } from '@scripts/gds';
import { ErrorMessages, LIMIT_PAGE } from '@scripts/constants';
import { useFiltersHelper, usePopupState } from '@scripts/hooks';
import { getTotalPages, getTotal } from '@scripts/helpers';
import { regNumbersWithComma } from '@scripts/regex';

import PlusIcon from '@icons/small/plus.svg';

import { useVariants, useDeleteVariant } from '@api/catalog';

interface FilterProps {
    className?: string;
    onSubmit: (vals: FormikValues) => void;
    onReset?: (vals: FormikValues) => void;
    emptyInitialValues: FormikValues;
    initialValues: FormikValues;
    total?: number;
}

const Filter = ({ className, initialValues, emptyInitialValues, onSubmit, onReset, total }: FilterProps) => (
    <Block className={className}>
        <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
            onReset={onReset}
            validationSchema={Yup.object().shape({
                id: Yup.string().matches(regNumbersWithComma, ErrorMessages.WRONG_FORMAT),
            })}
        >
            <Block.Body>
                <Layout cols={4}>
                    <Layout.Item col={1}>
                        <Form.Field name="id" label="ID склеек товаров" hint="Введите значения через запятую" />
                    </Layout.Item>
                </Layout>
            </Block.Body>

            <Block.Footer>
                <div css={typography('bodySm')}>Всего склеек товаров: {total}</div>

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
);

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: CELL_TYPES.LINKED_ID }),
    },
    {
        Header: 'Товары',
        accessor: 'products',
    },
    {
        Header: 'Характеристики',
        accessor: 'attributes',
    },
    {
        Header: 'Дата создания',
        accessor: 'created',
        getProps: () => ({ type: CELL_TYPES.DATE_TIME }),
    },
    {
        Header: 'Дата изменения',
        accessor: 'edited',
        getProps: () => ({ type: CELL_TYPES.DATE_TIME }),
    },
];

const URL = '/products/variant-groups';
interface State {
    id?: number | string;
    open?: boolean;
    action?: ActionType;
}

const VariantGroups = () => {
    const [popupState, popupDispatch] = usePopupState<State>({ open: false, action: ActionType.Close });
    const close = () => popupDispatch({ type: ActionType.Close });

    const { query, push } = useRouter();

    const emptyInitialValues = {
        id: '',
    };

    const { initialValues, URLHelper } = useFiltersHelper(emptyInitialValues);

    const activePage = +(query.page || 1);

    const { data } = useVariants({
        filter: {
            id: initialValues?.id
                .split(',')
                .map((i: string) => Number(i.trim()))
                .filter(Boolean),
        },
        include: ['products', 'attributes'],
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });

    const totalPages = getTotalPages(data);
    const total = getTotal(data);
    const tableData = useMemo(
        () =>
            data?.data?.map(variant => ({
                id: variant.id,
                created: variant.created_at,
                edited: variant.updated_at,
                attributes: variant.attributes.map(a => a.display_name),
                products: variant.products.map(p => p.name),
            })) || [],
        [data]
    );

    const deleteVariant = useDeleteVariant();

    return (
        <PageWrapper h1="Склейки товаров">
            <>
                <Filter
                    total={total}
                    initialValues={initialValues}
                    emptyInitialValues={emptyInitialValues}
                    onSubmit={URLHelper}
                    onReset={() => push(URL)}
                    css={{ marginBottom: scale(2) }}
                />

                <Link href={`${URL}/create`} passHref>
                    <Button css={{ marginBottom: scale(2) }} Icon={PlusIcon} as="a">
                        Создать товарную склейку
                    </Button>
                </Link>

                <Block>
                    <Block.Body>
                        {tableData.length > 0 ? (
                            <OldTable
                                columns={COLUMNS}
                                data={tableData}
                                editRow={row => {
                                    if (row) push(`${URL}/${row.id}`);
                                }}
                                deleteRow={async row => {
                                    if (row?.id) {
                                        popupDispatch({
                                            type: ActionType.Delete,
                                            payload: { id: row.id },
                                        });
                                    }
                                }}
                                needCheckboxesCol={false}
                                needSettingsBtn={false}
                            />
                        ) : (
                            <p>Ничего не найдено</p>
                        )}
                        <Pagination pages={totalPages} />
                    </Block.Body>
                </Block>
                <Popup
                    isOpen={Boolean(popupState.open && popupState.action === ActionType.Delete)}
                    onRequestClose={close}
                    popupCss={{ maxWidth: 'initial', width: scale(55) }}
                    title="Вы уверены, что хотите удалить товарную подборку?"
                >
                    <p>Товарная подборка #{popupState.id}</p>

                    <div css={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={close} theme="secondary">
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            css={{ marginLeft: scale(2) }}
                            onClick={async () => {
                                if (popupState.id) {
                                    await deleteVariant.mutateAsync(popupState.id);
                                }
                                close();
                            }}
                        >
                            Удалить
                        </Button>
                    </div>
                </Popup>
            </>
        </PageWrapper>
    );
};

export default VariantGroups;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
