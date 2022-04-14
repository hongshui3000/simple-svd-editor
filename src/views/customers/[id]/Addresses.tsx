import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import * as Yup from 'yup';

import { useCustomer, useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@api/customers';
import { AddressMutate } from '@api/customers/types';
import { DadataSuggestion } from '@api/dadata/types';

import OldTable, { TableRowProps } from '@components/OldTable';

import Form from '@components/controls/Form';
import Textarea from '@components/controls/Textarea';
import Popup from '@components/controls/Popup';
import Switcher from '@components/controls/Switcher';

import Autocomplete from '@components/controls/Autocomplete';
import Block from '@components/Block';

import { loadAddresses } from '@api/dadata';

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
        Header: 'Адрес',
        accessor: 'address',
    },
    {
        Header: 'По умолчанию',
        accessor: 'default',
    },
    {
        Header: 'Подъезд',
        accessor: 'porch',
    },
    {
        Header: 'Домофон',
        accessor: 'intercom',
    },
    {
        Header: 'Этаж',
        accessor: 'floor',
    },
    {
        Header: 'Квартира',
        accessor: 'flat',
    },
    {
        Header: 'Комментарий',
        accessor: 'comment',
    },
];

type State = {
    id?: string;
    address?: string;
    default?: boolean;
    porch?: string;
    intercom?: string;
    floor?: string;
    flat?: string;
    comment?: string;
    action?: ActionType;
    open?: boolean;
};

const Addresses = () => {
    const { query } = useRouter();
    const id = query.id?.toString() || '';

    const { data: customerData } = useCustomer(id);
    const customerId = customerData?.data?.id;
    const { data: addresses, refetch } = useAddresses({ filter: { customer_id: customerId }, enabled: !!customerId });

    const tableData = useMemo(
        () =>
            addresses?.data?.map(address => ({
                id: address.id,
                address: address.address_string,
                default: address.default ? 'Да' : 'Нет',
                porch: address.porch,
                intercom: address.intercom,
                floor: address.floor,
                flat: address.flat,
                comment: address.comment,
            })) || [],
        [addresses]
    );

    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();
    // const setDefaultAddress = useSetDefaultAddress();
    const deleteAddress = useDeleteAddress();

    const initialValues = {
        id: '',
        address: '',
        default: false,
        porch: '',
        intercom: '',
        floor: '',
        flat: '',
        comment: '',
    };
    const initialState = {
        ...initialValues,
        action: ActionType.Close,
        open: false,
    };

    const [popupState, popupDispatch] = usePopupState<State>(initialState);

    const close = () => popupDispatch({ type: ActionType.Close });

    const onRowEdit = (row?: TableRowProps) => {
        if (row) {
            popupDispatch({
                type: ActionType.Edit,
                payload: {
                    id: row.id,
                    address: row.address,
                    default: row.default,
                    porch: row.porch,
                    intercom: row.intercom,
                    floor: row.floor,
                    flat: row.flat,
                    comment: row.comment,
                },
            });
        }
    };
    const onRowDelete = (row?: TableRowProps) => {
        if (row) {
            popupDispatch({
                type: ActionType.Delete,
                payload: {
                    id: row.id,
                    address: row.address,
                },
            });
        }
    };

    const onSubmit = async (vals: FormikValues) => {
        if (customerId) {
            const suggestion: DadataSuggestion = vals.address;
            const params: AddressMutate = {
                customer_id: customerId,
                address_string: suggestion.value,
                default: vals.default,
                post_index: suggestion.data.postal_code,
                country_code: suggestion.data.country_iso_code,
                region: suggestion.data.region,
                region_guid: suggestion.data.region_fias_id,
                area: suggestion.data.area,
                area_guid: suggestion.data.area_fias_id,
                city: suggestion.data.city,
                city_guid: suggestion.data.city_fias_id,
                street: suggestion.data.street,
                house: suggestion.data.house,
                block: suggestion.data.block,
                porch: vals.porsh,
                intercom: vals.intercom,
                floor: vals.floor,
                flat: vals.flat,
                comment: vals.comment,
                geo_lat: vals.geo_lat,
                geo_lon: vals.geo_lon,
            };
            if (popupState.id) {
                await updateAddress.mutateAsync({ id: +popupState.id, ...params });
                refetch();
                close();
            } else {
                await createAddress.mutateAsync(params);
                close();
            }
        }
    };

    return (
        <Block>
            <Block.Header>
                <div>
                    <Button onClick={() => popupDispatch({ type: ActionType.Add })} Icon={PlusIcon}>
                        Добавить адрес
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
                        editRow={onRowEdit}
                        deleteRow={onRowDelete}
                    />
                ) : (
                    <p>Адресов не найдено</p>
                )}
            </Block.Body>
            <Popup
                isOpen={Boolean(popupState?.open && popupState.action !== ActionType.Delete)}
                onRequestClose={close}
                title={`${popupState.action === ActionType.Add ? 'Создание' : 'Редактирование'} адреса`}
                popupCss={{ minWidth: scale(60) }}
            >
                <Form
                    initialValues={popupState}
                    onSubmit={onSubmit}
                    validationSchema={Yup.object().shape({
                        address: Yup.object().required(ErrorMessages.REQUIRED),
                    })}
                >
                    <Layout cols={4}>
                        <Layout.Item col={4}>
                            <Form.Field name="address" label="Адрес">
                                <Autocomplete searchAsyncFunc={loadAddresses} defaultInputValue={popupState.address} />
                            </Form.Field>
                        </Layout.Item>
                        <Layout.Item col={4}>
                            <Form.FastField name="default">
                                <Switcher>Адрес по-умолчанию</Switcher>
                            </Form.FastField>
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField name="porch" label="Подъезд" type="number" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField name="intercom" label="Домофон" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField name="floor" label="Этаж" type="number" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField name="flat" label="Квартира" type="number" />
                        </Layout.Item>
                        <Layout.Item col={4}>
                            <Form.FastField name="comment" label="Комментарий">
                                <Textarea rows={3} />
                            </Form.FastField>
                        </Layout.Item>
                        <Layout.Item col={4} justify="end">
                            <Button theme="secondary" css={{ marginRight: scale(2) }} onClick={close}>
                                Отменить
                            </Button>
                            <Button type="submit">
                                {popupState.action === ActionType.Add ? 'Создать' : 'Сохранить'}
                            </Button>
                        </Layout.Item>
                    </Layout>
                </Form>
            </Popup>
            <Popup
                isOpen={Boolean(popupState?.open && popupState.action === ActionType.Delete)}
                onRequestClose={close}
                title="Вы уверены, что хотите удалить адрес?"
                popupCss={{ minWidth: scale(60) }}
            >
                <p css={{ marginBottom: scale(2) }}>
                    {popupState.id}# {popupState.address}
                </p>
                <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button theme="secondary" onClick={close} css={{ marginRight: scale(2) }}>
                        Отменить
                    </Button>
                    <Button
                        onClick={async () => {
                            if (popupState.id) {
                                await deleteAddress.mutateAsync(+popupState.id);
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

export default Addresses;
