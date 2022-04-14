import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import * as Yup from 'yup';

import { useCustomer, useFavorites, useCreateFavorite, useDeleteFavorite } from '@api/customers';

import OldTable, { TableRowProps } from '@components/OldTable';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';

import Block from '@components/Block';

import { Button, scale, Layout } from '@scripts/gds';
import { ErrorMessages } from '@scripts/constants';
import { usePopupState } from '@scripts/hooks';
import { ActionType } from '@scripts/enums';

import PlusIcon from '@icons/small/plus.svg';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Product ID',
        accessor: 'productId',
    },
];

type State = {
    id?: string;
    productId?: string;
    action?: ActionType;
    open?: boolean;
};

const Favorites = () => {
    const { query } = useRouter();
    const id = query.id?.toString() || '';

    const { data: customerData } = useCustomer(id);
    const customerId = customerData?.data?.id;
    const { data: favorites } = useFavorites({ filter: { customer_id: customerId }, enabled: !!customerId });

    const tableData = useMemo(
        () =>
            favorites?.data?.map(favorite => ({
                id: favorite.id,
                productId: favorite.product_id,
            })) || [],
        [favorites]
    );

    const initialValues = {
        id: '',
        productId: '',
    };
    const initialState = {
        ...initialValues,
        action: ActionType.Close,
        open: false,
    };

    const createFavorite = useCreateFavorite();
    const deleteFavorite = useDeleteFavorite();

    const [popupState, popupDispatch] = usePopupState<State>(initialState);

    const close = () => popupDispatch({ type: ActionType.Close });

    const onRowDelete = (row?: TableRowProps) => {
        if (row) {
            popupDispatch({
                type: ActionType.Delete,
                payload: {
                    id: row.id,
                    productId: row.productId,
                },
            });
        }
    };

    const onSubmit = async (vals: FormikValues) => {
        if (customerId) {
            if (popupState.id) {
                await createFavorite.mutateAsync({ product_id: +vals.productId, customer_id: customerId });
            }
            close();
        }
    };

    return (
        <Block>
            <Block.Header>
                <div>
                    <Button onClick={() => popupDispatch({ type: ActionType.Add })} Icon={PlusIcon}>
                        Добавить избранный товар
                    </Button>
                </div>
            </Block.Header>
            <Block.Body>
                {tableData.length ? (
                    <OldTable
                        columns={COLUMNS}
                        data={tableData}
                        needSettingsBtn={false}
                        needCheckboxesCol={false}
                        deleteRow={onRowDelete}
                    />
                ) : (
                    <p>Товаров в избранном не найдено</p>
                )}
            </Block.Body>
            <Popup
                isOpen={Boolean(popupState?.open && popupState.action !== ActionType.Delete)}
                onRequestClose={close}
                title="Создание избранного"
                popupCss={{ minWidth: scale(60) }}
            >
                <Form
                    initialValues={popupState}
                    onSubmit={onSubmit}
                    validationSchema={Yup.object().shape({
                        productId: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                >
                    <Layout cols={4}>
                        <Layout.Item col={4}>
                            <Form.FastField name="productId" label="Product ID" />
                        </Layout.Item>
                        <Layout.Item col={4} justify="end">
                            <Button theme="secondary" css={{ marginRight: scale(2) }} onClick={close}>
                                Отменить
                            </Button>
                            <Button type="submit">Создать</Button>
                        </Layout.Item>
                    </Layout>
                </Form>
            </Popup>
            <Popup
                isOpen={Boolean(popupState?.open && popupState.action === ActionType.Delete)}
                onRequestClose={close}
                title="Вы уверены, что хотите удалить избранное?"
                popupCss={{ minWidth: scale(60) }}
            >
                <p css={{ marginBottom: scale(2) }}>
                    {popupState.id}# id товара:{popupState.productId}
                </p>
                <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button theme="secondary" onClick={close} css={{ marginRight: scale(2) }}>
                        Отменить
                    </Button>
                    <Button
                        onClick={async () => {
                            if (popupState.productId && customerId) {
                                await deleteFavorite.mutateAsync({
                                    customer_id: customerId,
                                    product_id: +popupState.productId,
                                });
                                close();
                            }
                        }}
                    >
                        Удалить
                    </Button>
                </div>
            </Popup>
        </Block>
    );
};

export default Favorites;
