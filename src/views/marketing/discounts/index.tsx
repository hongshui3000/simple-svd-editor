import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, scale } from '@scripts/gds';
import { FormikValues } from 'formik';

import OldTable from '@components/OldTable';
import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';
import Pagination from '@components/controls/Pagination';
import Select from '@components/controls/Select';

import { useError, useSuccess } from '@context/modal';

import { useSelectedRowsData } from '@hooks/useSelectedRowsData';

import { getTotalPages, formatDate } from '@scripts/helpers';
import { LIMIT_PAGE, ModalMessages } from '@scripts/constants';

import { useFiltersHelper } from '@hooks/useFiltersHelper';

import { useDiscounts, useDiscountsStatusChange, useDiscountStatuses, useDiscountTypes } from '@api/marketing';
import { useGetSellers, useGetSellerUsers } from '@api/units';
import { prepareValuesForSelect } from '../helpers';
import DiscountsFilter from './Filter';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: 'linkedID' }),
    },
    {
        Header: 'Дата создания',
        accessor: 'createDate',
        getProps: () => ({ type: 'date' }),
    },
    {
        Header: 'Название',
        accessor: 'name',
    },
    {
        Header: 'Скидка на',
        accessor: 'discount',
    },
    {
        Header: 'Период действия',
        accessor: 'activePeriod',
    },
    {
        Header: 'Инициатор',
        accessor: 'initiator',
    },
    {
        Header: 'Автор',
        accessor: 'creator',
    },
    {
        Header: 'Статус',
        accessor: 'status',
    },
];

const deleteDiscountsPopupColumns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Название',
        accessor: 'name',
    },
];

const prepareFilter = (values: FormikValues) =>
    Object.entries(values)
        .filter(item => item[1])
        .reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1].value ? curr[1].value : curr[1] }), {});

const MarketingDiscounts = () => {
    const { pathname, query, push } = useRouter();
    const activePage = +(query?.page || 1);
    const [deleteDiscountsOpen, setDeleteDiscountsOpen] = useState(false);
    const [changeStatusesOpen, setChangeStatusesOpen] = useState(false);

    const emptyInitialValues = {
        id: '',
        name: '',
        status: '',
        type: '',
        seller_id: '',
        user_id: '',
        is_unlimited: false,
        date: null,
        creation_date: null,
        exact_start: false,
        exact_end: false,
    };

    const { initialValues, URLHelper } = useFiltersHelper(emptyInitialValues);

    const {
        data: apiDiscounts,
        isLoading,
        error,
    } = useDiscounts({
        filter: {
            id: initialValues.id || undefined,
            name: initialValues.name || undefined,
            status: initialValues.status || undefined,
            type: initialValues.type || undefined,
            seller_id: initialValues.seller_id || undefined,
            user_id: initialValues.user_id || undefined,
            is_unlimited: initialValues.is_unlimited || undefined,
            start_date: (initialValues.exact_start && initialValues.date && initialValues.date[0]) || undefined,
            start_date_from: (!initialValues.exact_start && initialValues.date && initialValues.date[0]) || undefined,
            end_date: (initialValues.exact_end && initialValues.date && initialValues.date[1]) || undefined,
            end_date_to: (!initialValues.exact_end && initialValues.date && initialValues.date[1]) || undefined,
            created_at_from: (initialValues.creation_date && initialValues.creation_date[0]) || undefined,
            created_at_to: (initialValues.creation_date && initialValues.creation_date[1]) || undefined,
        },
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });

    const { data: apiUnitsSellers, error: errorSellers } = useGetSellers({});
    const sellers = useMemo(() => apiUnitsSellers?.data || [], [apiUnitsSellers]);

    const { data: apiUsers, error: errorUsers } = useGetSellerUsers({});
    const users = useMemo(() => apiUsers?.data || [], [apiUsers]);

    const { data: apiStatuses, error: errorStatuses } = useDiscountStatuses();
    const discountStatuses = useMemo(
        () => (apiStatuses?.data ? prepareValuesForSelect(apiStatuses.data) : []),
        [apiStatuses]
    );

    const { data: apiTypes, error: errorTypes } = useDiscountTypes();
    const discountTypes = useMemo(() => (apiTypes?.data ? prepareValuesForSelect(apiTypes.data) : []), [apiTypes]);

    const data = useMemo(
        () =>
            apiDiscounts?.data
                ? apiDiscounts.data.map(i => ({
                      id: i.id,
                      createDate: i.created_at,
                      name: i.name,
                      discount: apiTypes?.data?.find(item => item.id === i.type)?.name,
                      activePeriod: `с ${i.start_date ? formatDate(new Date(i.start_date), 'dd.MM.yyyy') : '-'} по ${
                          i.end_date ? formatDate(new Date(i.end_date), 'dd.MM.yyyy') : '-'
                      }`,
                      initiator: sellers.find(item => item.id === i.seller_id)?.legal_name,
                      creator: users.find(item => item.id === i.user_id)?.login,
                      status: apiStatuses?.data?.find(item => item.id === i.status)?.name,
                  }))
                : [],
        [apiDiscounts, sellers, users, apiStatuses, apiTypes]
    );

    const [ids, setIds, popupTableData] = useSelectedRowsData<typeof data[0]>(data);

    const totalPages = getTotalPages(apiDiscounts);

    const changeDiscountsStatus = useDiscountsStatusChange();

    useError(error || errorSellers || errorUsers || errorStatuses || errorTypes);
    useSuccess(changeDiscountsStatus.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');

    return (
        <PageWrapper h1="Скидки" isLoading={isLoading}>
            <>
                <DiscountsFilter
                    onSubmit={values => {
                        URLHelper(prepareFilter(values));
                    }}
                    onReset={() => {
                        push(pathname);
                    }}
                    initialValues={initialValues}
                    quantity={data.length}
                    sellers={sellers}
                    users={users}
                    statuses={discountStatuses}
                    types={discountTypes}
                />
                <Block>
                    <Block.Header>
                        <div css={{ display: 'flex' }}>
                            <Link href="discounts/create" passHref>
                                <Button theme="primary" css={{ marginRight: scale(2) }}>
                                    Создать скидку
                                </Button>
                            </Link>
                            {/* Пока не нужно массовое удаление скидок */}
                            {/* <Button
                                theme="primary"

                                css={{ marginRight: scale(2) }}
                                onClick={() => {
                                    setDeleteDiscountsOpen(true);
                                }}
                                disabled={!(ids.length > 0)}
                            >
                                Удалить скидки
                            </Button> */}
                            <Button
                                theme="primary"
                                css={{ marginRight: scale(2) }}
                                onClick={() => {
                                    setChangeStatusesOpen(true);
                                }}
                                disabled={!(ids.length > 0)}
                            >
                                Изменить статус скидок
                            </Button>
                        </div>
                    </Block.Header>
                    <Block.Body>
                        <OldTable columns={COLUMNS} data={data} needSettingsColumn={false} onRowSelect={setIds} />
                        <Pagination pages={totalPages} />
                    </Block.Body>
                </Block>
                <Popup
                    isOpen={deleteDiscountsOpen}
                    onRequestClose={() => {
                        setDeleteDiscountsOpen(false);
                    }}
                    title="Вы уверены, что хотите удалить следующие скидки?"
                    popupCss={{ minWidth: scale(100) }}
                >
                    {/* <Form
                    onSubmit={values => {
                        console.log(values);
                    }}
                    initialValues={{
                        changedStatus: null,
                    }}
                > */}
                    <OldTable
                        columns={deleteDiscountsPopupColumns}
                        data={popupTableData}
                        needCheckboxesCol={false}
                        needSettingsColumn={false}
                        css={{ marginBottom: scale(2) }}
                    />
                    <Button type="submit" theme="primary">
                        Удалить
                    </Button>
                    {/* </Form> */}
                </Popup>
                <Popup
                    isOpen={changeStatusesOpen}
                    onRequestClose={() => {
                        setChangeStatusesOpen(false);
                    }}
                    title="Обновление статуса"
                    popupCss={{ minWidth: scale(100) }}
                >
                    {/* TODO provide right type for values */}
                    <Form<any>
                        onSubmit={values => {
                            const idsToUpdate = popupTableData.map(i => i.id);
                            if (idsToUpdate.length > 0)
                                changeDiscountsStatus.mutate(
                                    {
                                        id: idsToUpdate,
                                        status: +values.changedStatus.value,
                                    },
                                    {
                                        onSuccess: () => {
                                            setChangeStatusesOpen(false);
                                        },
                                    }
                                );
                        }}
                        initialValues={{
                            changedStatus: null,
                        }}
                    >
                        <OldTable
                            columns={deleteDiscountsPopupColumns}
                            data={popupTableData}
                            needCheckboxesCol={false}
                            needSettingsColumn={false}
                            css={{ marginBottom: scale(2) }}
                        />
                        <Form.Field name="changedStatus" label="Статус" css={{ marginBottom: scale(2) }}>
                            <Select items={discountStatuses} />
                        </Form.Field>

                        <Button type="submit" theme="primary">
                            Изменить статус
                        </Button>
                    </Form>
                </Popup>
            </>
        </PageWrapper>
    );
};

export default MarketingDiscounts;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
