import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import { useTabs } from '@scripts/hooks';
import { Button, scale, useTheme } from '@scripts/gds';
import { cleanPhoneValue, isNotEmptyObject } from '@scripts/helpers';

import {
    useOrderDetail,
    useOrderChange,
    OrderStatus,
    useOrderDeliveryChange,
    useOrdersDeleteFiles,
    useOrdersAddFile,
} from '@api/orders';

import PageWrapper from '@components/PageWrapper';
import Form from '@components/controls/Form';
import Tabs from '@components/controls/Tabs';

import { useError, useSuccess } from '@context/modal';
import { ErrorMessages, ModalMessages } from '@scripts/constants';

import CheckIcon from '@icons/small/check.svg';
import KebabIcon from '@icons/small/kebab.svg';

import { FormikProps, FormikValues } from 'formik';
import Tooltip, { ContentBtn } from '@components/controls/Tooltip';
import Popup from '@components/controls/Popup';
import { FileType } from '@components/controls/Dropzone/DropzoneFile';
import { Aside } from './Aside';
import { Main } from './Main';
import { Customer } from './Customer';
import { Products } from './Products';
import { Delivery } from './Delivery';
import { Comments } from './Comments';
import { Files } from './Files';

const OrderPage = () => {
    const { colors } = useTheme();
    const { query, push, pathname } = useRouter();
    const { getTabsProps } = useTabs();
    const orderId = (query && query.id && +query.id) || 0;

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const closeStatusPopup = useCallback(() => setIsStatusOpen(false), []);

    const changeOrder = useOrderChange();
    const changeOrderDelivery = useOrderDeliveryChange();

    const { data, isIdle, isLoading, error } = useOrderDetail(orderId, [
        'deliveries',
        'deliveries.shipments',
        'deliveries.shipments.orderItems',
        'customer',
        'customer.user',
        'responsible',
        'files',
    ]);

    const order = useMemo(() => data?.data, [data?.data]);

    const addFile = useOrdersAddFile();
    const deleteFiles = useOrdersDeleteFiles();
    useError(addFile.error);
    useError(deleteFiles.error);
    useSuccess(addFile.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(deleteFiles.status === 'success' ? ModalMessages.SUCCESS_DELETE : '');

    useError(error);

    useError(changeOrder.error);
    useError(changeOrderDelivery.error);
    useSuccess(changeOrder.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(changeOrderDelivery.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');

    const initialValues = useMemo(
        () => ({
            responsible_id: { label: order?.responsible?.full_name || '', value: order?.responsible?.id || null },

            receiver_name: order?.receiver_name || '',
            receiver_phone: order?.receiver_phone || '',
            receiver_email: order?.receiver_email || '',

            delivery_method: order?.delivery_method || '',
            delivery_address: {
                label: order?.delivery_address?.address_string || '',
                value: { data: order?.delivery_address || null },
            },
            porch: order?.delivery_address?.porch || '',
            floor: order?.delivery_address?.floor || '',
            flat: order?.delivery_address?.flat || '',
            intercom: order?.delivery_address?.intercom || '',
            delivery_comment: order?.delivery_comment || '',
            delivery:
                order?.deliveries?.map(d => ({
                    date: d.date ? new Date(d.date).getTime() : NaN,
                    timeslot: `${d.timeslot.from} - ${d.timeslot.to}`,
                })) || [],
            delivery_point_id: { label: order?.delivery_point_id, value: order?.delivery_point_id },

            client_comment: order?.client_comment || '',
            is_problem: order?.is_problem || false,
            problem_comment: order?.problem_comment || '',

            files: (order?.files?.map(f => ({ name: f.original_name, id: f.id, file: f.file })) || []) as FileType[],
            files_to_delete: [],
        }),
        [
            order?.client_comment,
            order?.deliveries,
            order?.delivery_address,
            order?.delivery_comment,
            order?.delivery_method,
            order?.delivery_point_id,
            order?.is_problem,
            order?.problem_comment,
            order?.receiver_email,
            order?.receiver_name,
            order?.receiver_phone,
            order?.responsible?.full_name,
            order?.responsible?.id,
            order?.files,
        ]
    );

    return (
        <PageWrapper h1={`Заказ №${order?.number || ''}`} isLoading={isIdle || isLoading}>
            <Form
                initialValues={initialValues}
                enableReinitialize
                onSubmit={vals => {
                    if (order) {
                        const changeOrderData = {
                            receiver_name:
                                initialValues.receiver_name !== vals.receiver_name ? vals.receiver_name : undefined,
                            receiver_email:
                                initialValues.receiver_email !== vals.receiver_email ? vals.receiver_email : undefined,
                            receiver_phone:
                                initialValues.receiver_phone !== cleanPhoneValue(vals.receiver_phone)
                                    ? cleanPhoneValue(vals.receiver_phone)
                                    : undefined,
                            responsible_id:
                                initialValues?.responsible_id.value !== vals.responsible_id.value &&
                                vals.responsible_id.value
                                    ? +vals.responsible_id.value
                                    : undefined,
                            client_comment:
                                initialValues.client_comment !== vals.client_comment ? vals.client_comment : undefined,
                            is_problem: initialValues.is_problem !== vals.is_problem ? vals.is_problem : undefined,
                            problem_comment:
                                vals.is_problem && initialValues.problem_comment !== vals.problem_comment
                                    ? vals.problem_comment
                                    : undefined,
                        };

                        if (isNotEmptyObject(changeOrderData)) {
                            changeOrder.mutate({
                                id: orderId,
                                ...changeOrderData,
                            });
                        }

                        const unchangedData = {
                            id: orderId,
                            delivery_service: order?.delivery_service,
                            delivery_cost: order?.delivery_cost,
                            delivery_price: order?.delivery_price,
                            delivery_tariff_id: order?.delivery_tariff_id,
                        };
                        const changeOrderDeliveryData = {
                            delivery_method: +vals.delivery_method,
                            delivery_point_id: vals.delivery_point_id.value || null,
                            delivery_address: {
                                ...vals.delivery_address.value.data,
                                address_string: vals.delivery_address.label,
                                porch: vals.porch,
                                floor: vals.floor,
                                flat: vals.flat,
                                intercom: vals.intercom,
                            },
                            delivery_comment: vals.delivery_comment,
                        };

                        // если данные поменялись
                        if (
                            initialValues.delivery_method !== changeOrderDeliveryData.delivery_method ||
                            order.delivery_point_id !== changeOrderDeliveryData.delivery_point_id ||
                            order.delivery_comment !== changeOrderDeliveryData.delivery_comment ||
                            initialValues.porch !== vals.porch ||
                            initialValues.floor !== vals.floor ||
                            initialValues.flat !== vals.flat ||
                            initialValues.intercom !== vals.intercom ||
                            initialValues.delivery_address.label !== vals.delivery_address.label
                        )
                            // @ts-ignore
                            changeOrderDelivery.mutate({
                                ...unchangedData,
                                ...changeOrderDeliveryData,
                            });

                        if (vals.files_to_delete.length > 0) {
                            deleteFiles.mutate({ id: orderId, file_ids: vals.files_to_delete });
                        }

                        if (vals.files.length > 0) {
                            vals.files.forEach(file => {
                                // Если файл еще не был загружен
                                if (!file.id) {
                                    addFile.mutate({ id: orderId, file });
                                }
                            });
                        }
                    }
                }}
                validationSchema={Yup.object().shape({
                    receiver_name: Yup.string().min(3).required(),
                    receiver_email: Yup.string().email(ErrorMessages.EMAIL),
                    problem_comment: Yup.string().when('is_problem', {
                        is: true,
                        then: Yup.string().required(ErrorMessages.REQUIRED),
                        otherwise: Yup.string(),
                    }),
                })}
                css={{ position: 'relative' }}
            >
                {({ dirty }: FormikProps<FormikValues>) => (
                    <>
                        <div
                            css={{
                                display: 'flex',
                                position: 'absolute',
                                top: '-40px',
                                right: 0,
                                background: colors?.white,
                                padding: scale(1),
                            }}
                        >
                            <Tooltip
                                trigger="click"
                                theme="light"
                                arrow
                                placement="bottom-end"
                                minWidth={scale(36)}
                                content={
                                    <ul>
                                        <li>
                                            <ContentBtn type="edit" onClick={() => setIsStatusOpen(true)}>
                                                Изменить статус заказа
                                            </ContentBtn>
                                        </li>
                                        <li>
                                            <ContentBtn
                                                type="edit"
                                                onClick={() => {
                                                    push({
                                                        pathname: `${pathname}/create-refund`,
                                                        query: { id: orderId },
                                                    });
                                                }}
                                            >
                                                Создать заявку на возврат
                                            </ContentBtn>
                                        </li>
                                    </ul>
                                }
                            >
                                <Button theme="secondary" Icon={KebabIcon} iconAfter css={{ marginRight: scale(1) }}>
                                    Действия
                                </Button>
                            </Tooltip>
                            {dirty && (
                                <Form.Reset theme="dangerous" css={{ marginRight: scale(1) }}>
                                    Отменить
                                </Form.Reset>
                            )}
                            <Button type="submit" Icon={CheckIcon} iconAfter disabled={!dirty}>
                                Сохранить
                            </Button>
                        </div>
                        <div css={{ display: 'flex', gap: scale(2) }}>
                            <div css={{ flexGrow: 1, flexShrink: 1 }}>
                                <Tabs {...getTabsProps()}>
                                    <Tabs.List>
                                        <Tabs.Tab>Главное</Tabs.Tab>
                                        <Tabs.Tab>Клиент</Tabs.Tab>
                                        <Tabs.Tab>Товары</Tabs.Tab>
                                        <Tabs.Tab>Доставка</Tabs.Tab>
                                        <Tabs.Tab>Комментарии</Tabs.Tab>
                                        <Tabs.Tab>Вложения</Tabs.Tab>
                                    </Tabs.List>
                                    <Tabs.Panel>
                                        <Main order={order} />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Customer order={order} />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Products order={order} />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Delivery order={order} />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Comments />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Files />
                                    </Tabs.Panel>
                                </Tabs>
                            </div>
                            <Aside order={order} css={{ marginTop: scale(6) }} />
                        </div>
                    </>
                )}
            </Form>
            <Popup isOpen={isStatusOpen} onRequestClose={closeStatusPopup} title="Изменить статус заказа">
                <Popup.Body>Подтвердить или отменить заказ?</Popup.Body>
                <Popup.Footer>
                    <Button theme="secondary" onClick={closeStatusPopup}>
                        Закрыть
                    </Button>
                    <Button
                        theme="dangerous"
                        onClick={() => {
                            changeOrder.mutate({
                                id: orderId,
                                status: OrderStatus.CANCELED,
                            });
                            closeStatusPopup();
                        }}
                    >
                        Отменить заказ
                    </Button>
                    <Button
                        onClick={() => {
                            changeOrder.mutate({
                                id: orderId,
                                status: OrderStatus.CONFIRMED,
                            });
                            closeStatusPopup();
                        }}
                    >
                        Подтвердить заказ
                    </Button>
                </Popup.Footer>
            </Popup>
        </PageWrapper>
    );
};

export default OrderPage;
