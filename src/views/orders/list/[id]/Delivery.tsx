import { Fragment, useMemo } from 'react';
import { useDeliveryMethods } from '@api/logistic';
import Block from '@components/Block';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Textarea from '@components/controls/Textarea';
import { useError } from '@context/modal';
import { DeliveryMethods } from '@scripts/enums';
import { scale, Layout } from '@scripts/gds';
import { useFormikContext, FieldArray } from 'formik';
import Autocomplete from '@components/controls/Autocomplete';
import { loadAddresses } from '@api/dadata';

import { Order } from '@api/orders';
import CalendarInput from '@components/controls/CalendarInput';
import { apiClient } from '@api/index';
import { toSelectItems } from '@scripts/helpers';

export const Delivery = ({ order }: { order: Order | undefined }) => {
    const { data, error } = useDeliveryMethods();
    useError(error);
    const items = useMemo(() => toSelectItems(data?.data), [data?.data]);
    const { values } =
        useFormikContext<{ delivery_method: DeliveryMethods; delivery: { date: number; timeslot: string }[] }>();

    return (
        <Block css={{ padding: scale(3) }}>
            <Layout cols={4}>
                <Layout.Item col={4}>
                    <Form.Field label="Способ доставки" name="delivery_method">
                        <Select items={items} simple />
                    </Form.Field>
                </Layout.Item>
                {values.delivery_method === DeliveryMethods.DELIVERY && (
                    <>
                        <Layout.Item col={4}>
                            <Form.Field label="Адрес" name="delivery_address">
                                <Autocomplete searchAsyncFunc={loadAddresses} />
                            </Form.Field>
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField label="Подъезд" name="porch" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField label="Этаж" name="floor" type="number" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField label="Кв/Офис" name="flat" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField label="Домофон" name="intercom" />
                        </Layout.Item>
                        <FieldArray
                            name="delivery"
                            render={() =>
                                values.delivery.map((d, index) => (
                                    <Fragment key={index}>
                                        <Layout.Item col={4}>
                                            <p>
                                                Дата и время доставки для №
                                                {order?.deliveries && order.deliveries[index]?.number}
                                            </p>
                                        </Layout.Item>
                                        <Layout.Item col={2}>
                                            <Form.FastField label="Дата доставки" name={`delivery.${index}.date`}>
                                                <CalendarInput />
                                            </Form.FastField>
                                        </Layout.Item>
                                        <Layout.Item col={2}>
                                            <Form.FastField
                                                label="Время доставки"
                                                name={`delivery.${index}.timeslot`}
                                            />
                                        </Layout.Item>
                                    </Fragment>
                                ))
                            }
                        />
                    </>
                )}
                {values.delivery_method === DeliveryMethods.PICKUP && (
                    <>
                        <Layout.Item col={4}>
                            <Form.FastField name="delivery_point_id" label="Точка самовывоза">
                                <Autocomplete
                                    searchAsyncFunc={async query => {
                                        const result = await apiClient.post('/logistic/point-enum-values:search', {
                                            data: {
                                                filter: {
                                                    query,
                                                    id: [],
                                                },
                                            },
                                        });
                                        if (result && result.data) {
                                            return result.data.map((i: { id: string; title: string }) => ({
                                                value: i.id,
                                                label: i.title,
                                            }));
                                        }
                                        return undefined;
                                    }}
                                />
                            </Form.FastField>
                        </Layout.Item>
                    </>
                )}
                <Layout.Item col={4}>
                    <Form.FastField label="Комментарий к доставке" name="delivery_comment">
                        <Textarea minRows={5} />
                    </Form.FastField>
                </Layout.Item>
            </Layout>
        </Block>
    );
};
