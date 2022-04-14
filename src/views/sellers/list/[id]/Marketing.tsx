import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Button, scale } from '@scripts/gds';

import Form from '@components/controls/Form';
import Block from '@components/Block';
import Tabs from '@components/controls/Tabs';
import OldTable from '@components/OldTable';
import Pagination from '@components/controls/Pagination';
import Select from '@components/controls/Select';
import Popup from '@components/controls/Popup';
import LoadWrapper from '@components/controls/LoadWrapper';

import { toISOString, getPeriod, getTotalPages, toSelectItems } from '@scripts/helpers';
import { usePopupState } from '@scripts/hooks';
import {
    PromoCodeStatusValues,
    PromoCodeTypeValue,
    ActionType,
    PromoCodeStatus,
    PromoCodeType,
    CELL_TYPES,
} from '@scripts/enums';
import { FormikValues } from 'formik';

import { useError, useSuccess } from '@context/modal';
import { ModalMessages, LIMIT_PAGE } from '@scripts/constants';

import {
    useDiscounts,
    useDiscountsStatusChange,
    useDiscountStatuses,
    usePromocodes,
    useDeletePromocode,
} from '@api/marketing';
import { useGetSellers, useGetSellerUsers } from '@api/units';
import PromocodesFilter from './Filter';
import DiscountsFilter from '../../../marketing/discounts/Filter';

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

interface RowDiscounts {
    id: number | undefined;
    createDate: string;
    name: string;
    discount?: number;
    activePeriod: string;
    initiator: string | undefined;
    creator: string | undefined;
    status: number;
}

const PROMOCODES_URL = '/marketing/promocodes';
const DISCOUNTS_URL = '/marketing/discounts';

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

const COLUMNS_DISCOUNTS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: CELL_TYPES.LINKED_ID }),
    },
    {
        Header: 'Дата создания',
        accessor: 'createDate',
        getProps: () => ({ type: CELL_TYPES.DATE }),
    },
    {
        Header: 'Название',
        accessor: 'name',
    },
    {
        Header: 'Скидка',
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

const COLUMNS_PROMO = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: CELL_TYPES.LINKED_ID }),
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

const Marketing = ({ id }: { id: number }) => {
    const { pathname, push, query } = useRouter();
    const activePage = +(query?.page || 1);
    const [changeStatusesOpen, setChangeStatusesOpen] = useState(false);

    const [initialValuesDiscounts, setInitialValuesDiscounts] = useState<FormikValues>({
        id: null,
        name: null,
        status: null,
        type: null,
        seller_id: null,
        user_id: null,
    });

    const { data: discountsStatuses, error: errorStatuses } = useDiscountStatuses();
    const statuses = useMemo(() => toSelectItems(discountsStatuses?.data), [discountsStatuses]);

    const { data: apiUnitsSellers, error: errorSellers } = useGetSellers();
    const sellers = useMemo(() => apiUnitsSellers?.data || [], [apiUnitsSellers]);

    const { data: apiUsers, error: errorUsers } = useGetSellerUsers({});
    const users = useMemo(() => apiUsers?.data || [], [apiUsers]);

    const { data: apiDiscounts, error: errorDiscounts } = useDiscounts({
        filter: {
            id: initialValuesDiscounts.id || undefined,
            name: initialValuesDiscounts.name || undefined,
            status: initialValuesDiscounts.status || undefined,
            type: initialValuesDiscounts.type || undefined,
            user_id: initialValuesDiscounts.user_id || undefined,
            seller_id: id,
        },
    });

    const dataDiscounts = useMemo(
        () =>
            apiDiscounts?.data
                ? apiDiscounts.data.map(i => ({
                      id: i.id,
                      createDate: '',
                      name: i.name,
                      discount: i.type,
                      activePeriod: `с ${i.start_date} по ${i.end_date}`,
                      initiator: sellers.find(item => item.id === i.seller_id)?.legal_name,
                      creator: users.find(item => item.id === i.user_id)?.login,
                      status: i.status,
                  }))
                : [],
        [apiDiscounts, sellers, users]
    );
    const changeDiscountsStatus = useDiscountsStatusChange();

    const [rowSelect, setRowSelect] = useState<RowDiscounts[]>(dataDiscounts);

    const onRowSelect = (ids: number[]) => {
        setRowSelect(dataDiscounts.filter(data => ids.includes(Number(data.id))));
    };

    const emptyInitialValuesPromo = {
        id: null,
        code: null,
        sellerId: null,
        discountId: null,
        activePeriodDate: [],
        status: null,
    };

    const [initialValuesPromo, setInitialValuesPromo] = useState<FormikValues>(emptyInitialValuesPromo);

    const {
        data: dataPromo,
        isLoading,
        error: errorPromo,
    } = usePromocodes({
        filter: {
            id: initialValuesPromo.id || undefined,
            status: initialValuesPromo.status || undefined,
            code: initialValuesPromo.code || undefined,
            seller_id: id,
            discount_id: initialValuesPromo.discountId || undefined,
            start_date: initialValuesPromo.activePeriodDate[0]
                ? toISOString(initialValuesPromo.activePeriodDate[0])
                : undefined,
            end_date: initialValuesPromo.activePeriodDate[1]
                ? toISOString(initialValuesPromo.activePeriodDate[1])
                : undefined,
        },
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });

    const deletePromocode = useDeletePromocode();

    const [popupState, popupDispatch] = usePopupState<State>({ action: ActionType.Close, open: false });

    const close = () => popupDispatch({ type: ActionType.Close });

    const tableData = useMemo(
        () =>
            dataPromo?.data.map(promocode => ({
                ...promocode,
                typeValue: PromoCodeTypeValue[promocode.type],
                statusValue: PromoCodeStatusValues[promocode.status],
                activePeriod: getPeriod(promocode.start_date, promocode.end_date),
            })) || [],
        [dataPromo?.data]
    );

    useError(
        errorDiscounts ||
            errorPromo ||
            deletePromocode.error ||
            changeDiscountsStatus.error ||
            errorUsers ||
            errorSellers ||
            errorStatuses
    );

    useSuccess(
        deletePromocode.status === 'success' || changeDiscountsStatus.status === 'success'
            ? ModalMessages.SUCCESS_UPDATE
            : ''
    );
    const total = getTotalPages(dataPromo);

    return (
        <>
            <Block css={{ marginBottom: scale(3) }}>
                <Tabs>
                    <div css={{ padding: scale(2) }}>
                        <Tabs.List>
                            <Tabs.Tab>Скидки продавца</Tabs.Tab>
                            <Tabs.Tab>Промокоды продавца</Tabs.Tab>
                        </Tabs.List>
                    </div>

                    <Tabs.Panel>
                        <DiscountsFilter
                            onSubmit={values => {
                                setInitialValuesDiscounts(values);
                            }}
                            onReset={() => push(pathname)}
                            initialValues={initialValuesDiscounts}
                            quantity={dataDiscounts.length}
                            sellers={sellers}
                            users={users}
                            statuses={statuses}
                        />
                        <Block.Body
                            css={{ display: 'flex', marginBottom: scale(3), button: { marginRight: scale(2) } }}
                        >
                            <Button>Создать скидку</Button>
                            <Button
                                onClick={() => {
                                    setChangeStatusesOpen(true);
                                }}
                                disabled={!(rowSelect.length > 0)}
                            >
                                Изменить статус скидки
                            </Button>
                        </Block.Body>
                        <Block.Body>
                            <OldTable
                                columns={COLUMNS_DISCOUNTS}
                                data={dataDiscounts}
                                editRow={row => {
                                    if (row) push(`${DISCOUNTS_URL}/${row.id}`);
                                }}
                                onRowSelect={onRowSelect}
                            />
                        </Block.Body>
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <PromocodesFilter
                            css={{ marginBottom: scale(2) }}
                            initialValues={initialValuesPromo}
                            emptyInitialValues={emptyInitialValuesPromo}
                            onSubmit={setInitialValuesPromo}
                            statuses={statuses}
                            onReset={() => push({ pathname, query: { page: activePage } })}
                        />

                        <Block.Body>
                            <LoadWrapper isLoading={isLoading}>
                                {tableData.length > 0 ? (
                                    <>
                                        <OldTable
                                            columns={COLUMNS_PROMO}
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
                            </LoadWrapper>
                        </Block.Body>
                    </Tabs.Panel>
                </Tabs>
            </Block>
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
                        const idsToUpdate = rowSelect.map(i => i.id);
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
                        data={rowSelect}
                        needCheckboxesCol={false}
                        needSettingsColumn={false}
                        css={{ marginBottom: scale(2) }}
                    />
                    <Form.Field name="changedStatus" label="Статус" css={{ marginBottom: scale(2) }}>
                        <Select items={statuses} />
                    </Form.Field>

                    <Button type="submit" theme="primary">
                        Изменить статус
                    </Button>
                </Form>
            </Popup>
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
        </>
    );
};

export default Marketing;
