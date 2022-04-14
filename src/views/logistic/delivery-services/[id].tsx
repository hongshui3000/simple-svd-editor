import { useMemo } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Button, scale, Layout, typography } from '@scripts/gds';
import { useTabs } from '@scripts/hooks';
import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';
import Form from '@components/controls/Form';
import Tabs from '@components/controls/Tabs';
import CalendarInput from '@components/controls/CalendarInput';
import Select from '@components/controls/Select';
import MultiSelect from '@components/controls/MultiSelect';
import Switcher from '@components/controls/Switcher';
import { useError, useModalsContext } from '@context/modal';

import {
    useDeliveryService,
    useDeliveryStatuses,
    useDeliveryServiceChange,
    useDeliveryServiceAddPaymentMethods,
    useDeliveryServiceDeletePaymentMethod,
} from '@api/logistic';
import { usePaymentMethods } from '@api/orders';
import { ErrorMessages, ModalMessages } from '@scripts/constants';

const DoValues = {
    do_consolidation: 'Консолидация многоместных отправлений',
    do_deconsolidation: 'Расконсолидация',
    do_zero_mile: 'Нулевая миля',
    do_express_delivery: 'Экспресс-доставка',
    do_return: 'Принимает возвраты',
};

const ServicesValues = {
    add_partial_reject_service: 'Частичный отказ',
    add_return_service: 'Возможность возврата',
    add_fitting_service: 'Примерка',
    add_open_service: 'Вскрытие разрешено',
    add_insurance_service: 'Страхование',
};

const FormKeys = [...Object.keys(DoValues), ...Object.keys(ServicesValues)];

const DeliveryServiceDetail = () => {
    const { appendModal } = useModalsContext();
    const { query } = useRouter();
    const { getTabsProps } = useTabs();

    const { data: apiStatuses, error: deliveryStatusesError } = useDeliveryStatuses();
    const { data: apiPaymentMethods, error: paymentMethodsError } = usePaymentMethods();

    const serviceId = (query && query.id && +query.id) || 0;

    const { data: apiData, refetch, isLoading, error } = useDeliveryService(serviceId, 'payment_methods');
    const deliveryServiceData = useMemo(() => apiData?.data, [apiData?.data]);

    const editDeliverySevice = useDeliveryServiceChange();
    const addPaymentMethods = useDeliveryServiceAddPaymentMethods();
    const deletePaymentMethod = useDeliveryServiceDeletePaymentMethod();

    const statuses = useMemo(
        () =>
            apiStatuses && apiStatuses.data && apiStatuses.data.length > 0
                ? apiStatuses.data.map(i => ({ label: i.name, value: `${i.id}` }))
                : [],
        [apiStatuses]
    );

    const paymentMethods = useMemo(
        () =>
            apiPaymentMethods && apiPaymentMethods.data && apiPaymentMethods.data.length > 0
                ? apiPaymentMethods.data.map(i => ({ label: i.name, value: `${i.id}` }))
                : [],
        [apiPaymentMethods]
    );

    useError(error || deliveryStatusesError || paymentMethodsError);

    const onSuccess = async () => {
        await refetch();
        appendModal({ theme: 'success', title: ModalMessages.SUCCESS_UPDATE });
    };

    const onError = async () => {
        appendModal({ theme: 'error', title: ModalMessages.ERROR_UPDATE });
    };

    return (
        <PageWrapper
            h1={`Логистический оператор ${deliveryServiceData?.name || ''}`}
            isLoading={isLoading || editDeliverySevice.isLoading}
            error={error || editDeliverySevice.error ? JSON.stringify(error || editDeliverySevice.error) : undefined}
        >
            <Layout cols={2} css={{ marginBottom: scale(3) }}>
                <Layout.Item col={1}>
                    <Block>
                        <Block.Body>
                            {/* TODO provide right type for values */}
                            <Form<any>
                                initialValues={{
                                    name: deliveryServiceData?.name || '',
                                    created_at: deliveryServiceData?.created_at
                                        ? new Date(deliveryServiceData?.created_at)
                                        : null,
                                    status: deliveryServiceData?.status ? +deliveryServiceData.status : '',
                                    priority: deliveryServiceData?.priority ? +deliveryServiceData.priority : '',
                                }}
                                validationSchema={Yup.object().shape({
                                    name: Yup.string().required(ErrorMessages.REQUIRED),
                                    created_at: Yup.date().required(ErrorMessages.REQUIRED),
                                })}
                                onSubmit={values => {
                                    editDeliverySevice.mutate(
                                        {
                                            id: serviceId,
                                            name: values.name,
                                            created_at: values.created_at,
                                            status: values.status,
                                            priority: values.priority,
                                        },
                                        {
                                            onSuccess,
                                            onError,
                                        }
                                    );
                                }}
                                enableReinitialize
                            >
                                <div
                                    css={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: scale(3),
                                    }}
                                >
                                    <h3 css={{ ...typography('h3'), marginTop: 0 }}>Инфопанель</h3>
                                    <div>
                                        <Button theme="primary" type="submit">
                                            Сохранить
                                        </Button>
                                        <Form.Reset theme="secondary" type="button" css={{ marginLeft: scale(1) }}>
                                            Отмена
                                        </Form.Reset>
                                    </div>
                                </div>
                                <Layout cols={2}>
                                    <Layout.Item col={1}>
                                        <Form.FastField name="name" label="Название" />
                                    </Layout.Item>
                                    <Layout.Item col={1}>
                                        <Form.FastField name="created_at" label="Дата регистрации">
                                            <CalendarInput />
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={1}>
                                        <Form.FastField name="status">
                                            <Select name="status" label="Статус" items={statuses} />
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={1}>
                                        <Form.FastField name="priority" label="Приоритет" type="number" />
                                    </Layout.Item>
                                </Layout>
                            </Form>
                        </Block.Body>
                    </Block>
                </Layout.Item>
            </Layout>
            <Tabs {...getTabsProps()}>
                <Tabs.List>
                    <Tabs.Tab>Настройки</Tabs.Tab>
                    <Tabs.Tab>Ограничения</Tabs.Tab>
                </Tabs.List>
                <Block>
                    <Block.Body>
                        <Tabs.Panel>
                            <Form
                                initialValues={{
                                    max_cargo_export_time: deliveryServiceData?.max_cargo_export_time
                                        ?.split(':')
                                        .slice(0, 2)
                                        .join(':'),

                                    ...(deliveryServiceData
                                        ? (
                                              Object.keys(deliveryServiceData) as (keyof typeof deliveryServiceData)[]
                                          ).reduce<Record<string, any>>((acc, val) => {
                                              if (FormKeys.includes(val)) {
                                                  acc[val] = deliveryServiceData[val];
                                              }
                                              return acc;
                                          }, {})
                                        : {}),
                                }}
                                onSubmit={values => {
                                    editDeliverySevice.mutate(
                                        {
                                            id: serviceId,
                                            ...values,
                                        },
                                        {
                                            onSuccess,
                                            onError,
                                        }
                                    );
                                }}
                                enableReinitialize
                            >
                                <div css={{ marginBottom: scale(3), textAlign: 'right' }}>
                                    <Button theme="primary" type="submit">
                                        Сохранить
                                    </Button>
                                    <Form.Reset theme="secondary" type="button" css={{ marginLeft: scale(1) }}>
                                        Отмена
                                    </Form.Reset>
                                </div>
                                <Layout cols={2} css={{ marginBottom: scale(4) }}>
                                    <Layout.Item col={1}>
                                        {(Object.keys(DoValues) as Array<keyof typeof DoValues>).map(val => (
                                            <Form.FastField name={val} key={val} css={{ marginBottom: scale(2) }}>
                                                <Switcher>{DoValues[val]}</Switcher>
                                            </Form.FastField>
                                        ))}
                                    </Layout.Item>
                                    <Layout.Item col={1}>
                                        <Form.FastField
                                            name="max_cargo_export_time"
                                            label="Крайнее время для заданий на забор"
                                            type="time"
                                        />
                                    </Layout.Item>
                                </Layout>
                                <Layout cols={2}>
                                    <Layout.Item col={1}>
                                        <h4 css={{ ...typography('bodyMdBold'), marginBottom: scale(2) }}>
                                            Услуги логистического оператора
                                        </h4>

                                        {(Object.keys(ServicesValues) as Array<keyof typeof ServicesValues>).map(
                                            val => (
                                                <Form.FastField name={val} key={val} css={{ marginBottom: scale(2) }}>
                                                    <Switcher>{ServicesValues[val]}</Switcher>
                                                </Form.FastField>
                                            )
                                        )}
                                    </Layout.Item>
                                </Layout>
                            </Form>
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <Form
                                initialValues={{
                                    max_shipments_per_day: deliveryServiceData?.max_shipments_per_day,
                                    do_dangerous_products_delivery: deliveryServiceData?.do_dangerous_products_delivery,
                                    payment_methods: deliveryServiceData?.payment_methods?.map(i => `${i}`) || [],
                                }}
                                onSubmit={values => {
                                    const newMethods = values.payment_methods.filter(
                                        (m: string) => !deliveryServiceData?.payment_methods?.includes(+m)
                                    );

                                    if (newMethods && newMethods.length > 0)
                                        addPaymentMethods.mutateAsync(
                                            {
                                                id: serviceId,
                                                payment_methods: newMethods.map((i: string) => +i),
                                            },
                                            {
                                                onSuccess,
                                                onError,
                                            }
                                        );

                                    const methodsToDelete = deliveryServiceData?.payment_methods?.filter(
                                        (m: number) => !values.payment_methods?.includes(`${m}`)
                                    );

                                    if (methodsToDelete && methodsToDelete.length > 0) {
                                        methodsToDelete.forEach(m => {
                                            deletePaymentMethod.mutateAsync(
                                                {
                                                    id: serviceId,
                                                    payment_method: m,
                                                },
                                                {
                                                    onSuccess,
                                                    onError,
                                                }
                                            );
                                        });
                                    }

                                    editDeliverySevice.mutate(
                                        {
                                            id: serviceId,
                                            do_dangerous_products_delivery: values.do_dangerous_products_delivery,
                                            max_shipments_per_day: values.max_shipments_per_day,
                                        },
                                        {
                                            onSuccess,
                                            onError,
                                        }
                                    );
                                }}
                                enableReinitialize
                            >
                                <div css={{ marginBottom: scale(3), textAlign: 'right' }}>
                                    <Button theme="primary" type="submit">
                                        Сохранить
                                    </Button>
                                    <Form.Reset theme="secondary" type="button" css={{ marginLeft: scale(1) }}>
                                        Отмена
                                    </Form.Reset>
                                </div>
                                <Layout cols={2}>
                                    <Layout.Item col={1}>
                                        <Form.Field name="do_dangerous_products_delivery">
                                            <Switcher>Доставка опасных грузов</Switcher>
                                        </Form.Field>
                                    </Layout.Item>
                                    <Layout.Item col={1}>
                                        <Form.Field
                                            name="max_shipments_per_day"
                                            label="Максимальное кол-во отправленией в день"
                                            type="number"
                                        />
                                    </Layout.Item>
                                    <Layout.Item col={1}>
                                        <Form.Field name="payment_methods" label="Способы оплаты">
                                            <MultiSelect items={paymentMethods} />
                                        </Form.Field>
                                    </Layout.Item>
                                </Layout>
                            </Form>
                        </Tabs.Panel>
                    </Block.Body>
                </Block>
            </Tabs>
        </PageWrapper>
    );
};

export default DeliveryServiceDetail;
