import { useRouter } from 'next/router';
import { CSSObject } from '@emotion/core';
import { useMemo } from 'react';
import * as Yup from 'yup';

import Form from '@components/controls/Form';

import PageWrapper from '@components/PageWrapper';

import { Button, scale, useTheme } from '@scripts/gds';
import { daysValues } from '@scripts/enums';

import {
    useCreateStoreWorkings,
    useStore,
    useUpdateStoreWorkings,
    useCreatePickupTimes,
    useUpdatePickupTimes,
    StoreContact,
    useCreateStoreContact,
    useUpdateStoreContact,
    useDeleteStoreContact,
} from '@api/units';

import { useError, useSuccess } from '@context/modal';

import { Address } from '@api/orders/types';
import { useDeliveryServices } from '@api/logistic';
import Tabs from '@components/controls/Tabs';
import { useTabs } from '@scripts/hooks';
import { ErrorMessages } from '@scripts/constants';
import { regPhone } from '@scripts/regex';

import EditStore from './EditStore';
import Workings from './Workings';
import Contacts from './Contacts';
import PickupTimes from './PickupTimes';
import { WorkingItem } from './types';

interface StoresFormValues {
    seller?: number;
    name?: string;
    code?: string;
    address?: Partial<Address>;
    porch?: number | null;
    floor?: number | null;
    intercome?: string | null;
    timezone?: { label?: string; value?: string };
    active?: boolean;
    comment?: string | null | undefined;
    workings?: WorkingItem[];
    pickupTimes?: {
        delivery_service_name: string;
        delivery_service: number | undefined;
        pickupTimes: {
            day: number;
            pickup_time_id?: number | null | string;
            pickup_time_code?: string;
            pickup_time_start?: string;
            pickup_time_end?: string;
            cargo_export_time?: string;
        }[];
    }[];
    contacts?: StoreContact[];
}

const SellerStoresEdit = () => {
    const { colors } = useTheme();
    const { query } = useRouter();
    const storeID = Array.isArray(query.id) ? query.id[0] : query.id || '';

    const { data, error } = useStore(storeID, 'contacts');
    const store = data?.data;

    const createStoreWorkings = useCreateStoreWorkings();
    const updateStoreWorkings = useUpdateStoreWorkings();
    const createPickupTime = useCreatePickupTimes();
    const updatePickupTime = useUpdatePickupTimes();
    const createContact = useCreateStoreContact();
    const updateContact = useUpdateStoreContact();
    const deleteContact = useDeleteStoreContact();

    const { data: deliveryServiceData, error: deliveryServiceError } = useDeliveryServices({
        pagination: { type: 'offset', limit: -1, offset: 0 },
    });
    const deliveryServices = useMemo(() => deliveryServiceData?.data || [], [deliveryServiceData?.data]);

    const { getTabsProps } = useTabs();
    useError(
        error ||
            deliveryServiceError ||
            createStoreWorkings.error ||
            updateStoreWorkings.error ||
            createPickupTime.error ||
            updatePickupTime.error ||
            createContact.error ||
            updateContact.error ||
            deleteContact.error
    );

    useSuccess(
        createStoreWorkings.status === 'success' || updateStoreWorkings.status === 'success'
            ? 'Данные о графике работы обновлены успешно'
            : ''
    );
    useSuccess(
        createPickupTime.status === 'success' || updatePickupTime.status === 'success'
            ? 'Данные о графике отгрузки обновлены успешно'
            : ''
    );
    useSuccess(
        createContact.status === 'success' || updateContact.status === 'success' || deleteContact.status === 'success'
            ? 'Данные о контактных лицах обновлены успешно'
            : ''
    );

    const lineCSS: CSSObject = {
        padding: `${scale(2)}px`,
        borderBottom: `1px solid ${colors?.grey400}`,
        verticalAlign: 'top',
    };

    const workings = useMemo(
        () =>
            Object.keys(daysValues).map(d => {
                const workingForDay = store?.workings.find(w => w.day === +d);
                return {
                    id: workingForDay?.id || '',
                    working_start_time: workingForDay?.working_start_time || '',
                    working_end_time: workingForDay?.working_end_time || '',
                    day: +d,
                    active: workingForDay?.active || false,
                };
            }),
        [store?.workings]
    );

    const pickupTimes = useMemo(
        () => [
            {
                delivery_service_name: 'Все логистические операторы',
                delivery_service: undefined,
                pickupTimes: Object.keys(daysValues).map(dayCode => {
                    const findedPT = store?.pickup_times.find(p => p.day === +dayCode && p.delivery_service === null);
                    return {
                        day: +dayCode,
                        pickup_time_id: findedPT ? findedPT.id : undefined,
                        pickup_time_code: findedPT ? findedPT.pickup_time_code : '',
                        pickup_time_start: findedPT ? findedPT.pickup_time_start : '',
                        pickup_time_end: findedPT ? findedPT.pickup_time_end : '',
                        cargo_export_time: findedPT ? findedPT.cargo_export_time : '',
                    };
                }),
            },
            ...deliveryServices.map(ds => ({
                delivery_service_name: ds.name || '-',
                delivery_service: ds.id,
                pickupTimes: Object.keys(daysValues).map(dayCode => {
                    const findedPT = store?.pickup_times.find(p => p.day === +dayCode && p.delivery_service === ds.id);
                    const commonData = {
                        day: +dayCode,
                        delivery_service: ds.id,
                    };
                    return {
                        ...commonData,
                        pickup_time_id: findedPT ? findedPT.id : null,
                        pickup_time_code: findedPT ? findedPT.pickup_time_code : '',
                        pickup_time_start: findedPT ? findedPT.pickup_time_start : '',
                        pickup_time_end: findedPT ? findedPT.pickup_time_end : '',
                        cargo_export_time: findedPT ? findedPT.cargo_export_time : '',
                    };
                }),
            })),
        ],
        [deliveryServices, store?.pickup_times]
    );

    const initialValues: StoresFormValues = useMemo(
        () => ({
            seller_id: store?.seller_id,
            name: store?.name,
            code: store?.xml_id,
            address: store?.address,
            porch: store?.address?.porch,
            floor: store?.address.floor,
            intercome: store?.address?.intercom,
            timezone: { label: store?.timezone, value: store?.timezone },
            active: store?.active,
            comment: store?.address?.comment,
            workings,
            pickupTimes,
            contacts: store?.contacts,
        }),
        [
            pickupTimes,
            store?.active,
            store?.address,
            store?.contacts,
            store?.name,
            store?.seller_id,
            store?.timezone,
            store?.xml_id,
            workings,
        ]
    );

    return (
        <PageWrapper h1={`Редактирование склада #${storeID}`}>
            <>
                <Form
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        seller_id: Yup.object().required(ErrorMessages.REQUIRED),
                        name: Yup.string().required(ErrorMessages.REQUIRED),
                        address: Yup.object().required(ErrorMessages.REQUIRED),
                        timezone: Yup.object().required(ErrorMessages.REQUIRED),
                        contacts: Yup.array()
                            .nullable()
                            .of(
                                Yup.object().shape({
                                    email: Yup.string().email(ErrorMessages.EMAIL).required(ErrorMessages.REQUIRED),
                                    phone: Yup.string()
                                        .matches(regPhone, ErrorMessages.PHONE)
                                        .required(ErrorMessages.REQUIRED),
                                    name: Yup.string().required(ErrorMessages.REQUIRED),
                                })
                            ),
                    })}
                    onSubmit={(values: StoresFormValues) => {
                        /** обновим workings */
                        values?.workings?.forEach(w => {
                            const workingsData = { ...w, store_id: +storeID };
                            if (workingsData.id) {
                                updateStoreWorkings.mutate({ ...workingsData, id: workingsData.id });
                            } else if (workingsData.active) {
                                delete workingsData.id;
                                createStoreWorkings.mutate(workingsData);
                            }
                        });

                        /** обновим pickuptimes */
                        values?.pickupTimes?.forEach((p, index) => {
                            p.pickupTimes.forEach((item, ptIndex) => {
                                const oldPickupTime = initialValues.pickupTimes
                                    ? initialValues.pickupTimes[index].pickupTimes[ptIndex]
                                    : null;

                                if (oldPickupTime) {
                                    const updatedPickupTime = {
                                        store_id: +storeID,
                                        day: item.day,
                                        pickup_time_code: item.pickup_time_code,
                                        pickup_time_start: item.pickup_time_start,
                                        pickup_time_end: item.pickup_time_end,
                                        cargo_export_time: item.cargo_export_time,
                                        delivery_service: p.delivery_service,
                                    };
                                    if (
                                        oldPickupTime.cargo_export_time !== updatedPickupTime.cargo_export_time ||
                                        oldPickupTime.pickup_time_code !== updatedPickupTime.pickup_time_code ||
                                        oldPickupTime.pickup_time_start !== updatedPickupTime.pickup_time_start ||
                                        oldPickupTime.pickup_time_end !== updatedPickupTime.pickup_time_end
                                    ) {
                                        if (item.pickup_time_id) {
                                            updatePickupTime.mutate({ id: item.pickup_time_id, ...updatedPickupTime });
                                        } else {
                                            createPickupTime.mutate(updatedPickupTime);
                                        }
                                    }
                                }
                            });
                        });

                        /** Обновим контакты */
                        values?.contacts?.forEach(contact => {
                            const updatedContact = {
                                store_id: +storeID,
                                name: contact.name,
                                email: contact.email,
                                phone: contact.phone,
                            };
                            const oldContact = initialValues.contacts?.find(c => c.id === contact.id);
                            if (
                                oldContact?.email !== updatedContact.email ||
                                oldContact?.phone !== updatedContact.phone ||
                                oldContact?.name !== updatedContact.name
                            ) {
                                if (contact.id) {
                                    updateContact.mutate({ ...updatedContact, id: contact.id });
                                } else {
                                    createContact.mutate(updatedContact);
                                }
                            }
                        });

                        /** удалим лишние контакты */
                        const contactsToDelete = initialValues?.contacts?.filter(
                            c => !values.contacts?.find(v => v.id === c.id)
                        );

                        if (contactsToDelete && contactsToDelete.length > 0) {
                            contactsToDelete.forEach(c => {
                                deleteContact.mutate(c.id);
                            });
                        }

                        console.log(values);
                    }}
                    enableReinitialize
                >
                    <div css={{ display: 'flex' }}>
                        <EditStore
                            initialValues={initialValues}
                            needBtns={false}
                            css={{ maxWidth: scale(128), marginBottom: scale(4) }}
                        />
                        <div
                            css={{
                                position: 'relative',
                                marginLeft: scale(2),
                                flexShrink: 0,
                                flexGrow: 1,
                                textAlign: 'center',
                            }}
                        >
                            <div css={{ position: 'sticky', top: scale(3) }}>
                                <Form.Reset theme="secondary">Отменить</Form.Reset>
                                <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                    Сохранить
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Tabs {...getTabsProps()}>
                        <Tabs.List>
                            <Tabs.Tab>График работы</Tabs.Tab>
                            <Tabs.Tab>График отгрузки</Tabs.Tab>
                            <Tabs.Tab>Контактные лица</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel>
                            <Workings lineCSS={lineCSS} />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <PickupTimes lineCSS={lineCSS} />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <Contacts lineCSS={lineCSS} />
                        </Tabs.Panel>
                    </Tabs>
                </Form>
            </>
        </PageWrapper>
    );
};

export default SellerStoresEdit;
