import { useMemo } from 'react';
import { Button, scale, Layout } from '@scripts/gds';
import Link from 'next/link';
import { FormikValues } from 'formik';

import { usePromocodes, useDeletePromocode } from '@api/marketing';

import OldTable from '@components/OldTable';
import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';

import Select, { SelectItemProps } from '@components/controls/Select';
import Form from '@components/controls/Form';
import Pagination from '@components/controls/Pagination';
import Popup from '@components/controls/Popup';
import CalendarRange from '@components/controls/CalendarRange';

import { useFiltersHelper, usePopupState } from '@scripts/hooks';
import { prepareForSelectFromObject, getPeriod, getTotalPages, toISOString } from '@scripts/helpers';
import { PromoCodeStatusValues, PromoCodeTypeValue, ActionType, PromoCodeStatus, PromoCodeType } from '@scripts/enums';

import PlusIcon from '@icons/small/plus.svg';
import { useRouter } from 'next/router';
import { LIMIT_PAGE } from '@scripts/constants';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: 'linkedID' }),
    },
    {
        Header: 'Название',
        accessor: 'name',
    },
    {
        Header: 'Код',
        accessor: 'code',
    },
    {
        Header: 'Тип',
        accessor: 'typeValue',
    },
    {
        Header: 'Статус',
        accessor: 'statusValue',
    },
    {
        Header: 'Период действия',
        accessor: 'activePeriod',
    },
    {
        Header: 'Количество применений',
        accessor: 'counter',
    },
];

type State = {
    id?: string | number;
    name?: string;
    code?: string;
    typeValue?: string;
    statusValue?: string;
    type?: PromoCodeType;
    status?: PromoCodeStatus;
    activePeriod?: string;
    start_date?: string;
    end_date?: string;
    action?: ActionType;
    open?: boolean;
};

interface FilterProps {
    className?: string;
    onSubmit: (vals: FormikValues) => void;
    onReset?: (vals: FormikValues) => void;
    emptyInitialValues: FormikValues;
    initialValues: FormikValues;
    statuses: SelectItemProps[];
}

const PROMOCODES_URL = '/marketing/promocodes';

const Filters = ({ className, onSubmit, onReset, emptyInitialValues, initialValues, statuses }: FilterProps) => (
    <Block className={className}>
        <Form initialValues={initialValues} onSubmit={onSubmit} onReset={onReset}>
            <Block.Body>
                <Layout cols={4}>
                    <Layout.Item col={1}>
                        <Form.Field name="id" label="ID" type="number" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="code" label="Код" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="sellerId" label="Идентификатор продавца" type="number" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="discountId" label="Идентификатор скидки" type="number" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="status" label="Статус">
                            <Select items={statuses} />
                        </Form.Field>
                    </Layout.Item>
                    <Layout.Item col={2}>
                        <CalendarRange label="Введите период действия" nameFrom="start_date" nameTo="end_date" />
                    </Layout.Item>

                    <Layout.Item col={4} justify="end">
                        <Form.Reset
                            theme="secondary"
                            css={{ marginRight: scale(2) }}
                            type="button"
                            initialValues={emptyInitialValues}
                        >
                            Очистить
                        </Form.Reset>
                        <Button theme="primary" type="submit">
                            Применить
                        </Button>
                    </Layout.Item>
                </Layout>
            </Block.Body>
        </Form>
    </Block>
);

const Promocodes = () => {
    const { push, query, pathname } = useRouter();
    const statuses = useMemo(() => prepareForSelectFromObject(PromoCodeStatusValues), []);
    const activePage = +(query?.page || 1);

    const emptyInitialValues = {
        id: '',
        code: '',
        sellerId: '',
        discountId: '',
        start_date: '',
        end_date: '',
        status: '',
    };

    const { initialValues, URLHelper } = useFiltersHelper(emptyInitialValues);

    const { data, isLoading } = usePromocodes({
        filter: {
            id: initialValues.id || undefined,
            status: initialValues.status || undefined,
            code: initialValues.code || undefined,
            seller_id: initialValues.sellerId || undefined,
            discount_id: initialValues.discountId || undefined,
            end_date: initialValues.end_date ? toISOString(initialValues.end_date) : undefined,
            start_date: initialValues.start_date ? toISOString(initialValues.start_date) : undefined,
        },
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });
    const deletePromocode = useDeletePromocode();

    const [popupState, popupDispatch] = usePopupState<State>({ action: ActionType.Close, open: false });

    const close = () => popupDispatch({ type: ActionType.Close });

    const tableData = useMemo(
        () =>
            data?.data.map(promocode => ({
                ...promocode,
                typeValue: PromoCodeTypeValue[promocode.type],
                statusValue: PromoCodeStatusValues[promocode.status],
                activePeriod: getPeriod(promocode.start_date, promocode.end_date),
            })) || [],
        [data?.data]
    );
    const total = getTotalPages(data);

    return (
        <PageWrapper h1="Промокоды" isLoading={isLoading}>
            <Filters
                css={{ marginBottom: scale(2) }}
                initialValues={initialValues}
                emptyInitialValues={emptyInitialValues}
                onSubmit={URLHelper}
                statuses={statuses}
                onReset={() => push({ pathname, query: { page: activePage } })}
            />
            <Block>
                <Block.Header>
                    <Layout cols={6} gap={scale(2)}>
                        <Layout.Item col={1}>
                            <Link href={`${PROMOCODES_URL}/create`} passHref>
                                <Button theme="primary" css={{ width: '100%' }} Icon={PlusIcon}>
                                    Создать промокод
                                </Button>
                            </Link>
                        </Layout.Item>
                    </Layout>
                </Block.Header>
                <Block.Body>
                    {tableData.length > 0 ? (
                        <>
                            <OldTable
                                columns={COLUMNS}
                                data={tableData}
                                needSettingsBtn={false}
                                needCheckboxesCol={false}
                                editRow={row => {
                                    if (row) push(`${PROMOCODES_URL}/${row.id}`);
                                }}
                                deleteRow={row => {
                                    if (row) {
                                        popupDispatch({
                                            type: ActionType.Delete,
                                            payload: {
                                                id: row?.id,
                                                name: row?.name,
                                            },
                                        });
                                    }
                                }}
                            />
                            <Pagination pages={total} />
                        </>
                    ) : (
                        <p>Ни одного промокода не найдено</p>
                    )}
                </Block.Body>
            </Block>
            <Popup
                isOpen={Boolean(popupState.open && popupState.action === ActionType.Delete)}
                onRequestClose={close}
                title="Вы уверены, что хотите удалить промокод?"
                popupCss={{ maxWidth: 'initial', width: scale(55) }}
            >
                <p css={{ marginBottom: scale(2) }}>
                    #{popupState.id} {popupState?.name}
                </p>
                <div css={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={close} theme="secondary">
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        css={{ marginLeft: scale(2) }}
                        onClick={async () => {
                            if (popupState.id) await deletePromocode.mutateAsync(+popupState.id);
                            close();
                        }}
                    >
                        Удалить
                    </Button>
                </div>
            </Popup>
        </PageWrapper>
    );
};

export default Promocodes;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
