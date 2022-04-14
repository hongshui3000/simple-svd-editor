import { scale, Layout } from '@scripts/gds';
import { usePaymentMethods, useOrderSources, Order } from '@api/orders';

import Form from '@components/controls/Form';

import { useError } from '@context/modal';
import Block from '@components/Block';
import Label from '@components/Label';
import Autocomplete from '@components/controls/Autocomplete';

import { formatPrice, fromKopecksToRouble, getOptionName } from '@scripts/helpers';
import { getAdminUserEnumValues } from '@api/units';

const getFeature = (order: Order | undefined) => {
    const result: string[] = [];
    if (order) {
        const { is_expired, is_partial_return, is_problem, is_return } = order;
        if (is_expired) result.push('Просрочен');
        if (is_partial_return) result.push('Частичный возврат');
        if (is_problem) result.push('Проблемный');
        if (is_return) result.push('Возвратный');
        if (!is_expired && !is_partial_return && !is_problem && !is_return) result.push('Отсутствует');
    } else {
        result.push('Отсутствует');
    }
    return result;
};

export const Main = ({ order }: { order: Order | undefined }) => {
    const { data: orderSourses, error: orderSourcesError } = useOrderSources();
    const { data: paymentMethods, error: paymentMethodsError } = usePaymentMethods();

    useError(orderSourcesError);
    useError(paymentMethodsError);

    return (
        <Block css={{ borderTopLeftRadius: 0, padding: scale(3) }}>
            <Layout cols={2}>
                <Layout.Item col={2}>
                    <Form.Field label="Ответственный" name="responsible_id">
                        <Autocomplete searchAsyncFunc={getAdminUserEnumValues} />
                    </Form.Field>
                </Layout.Item>
                <Layout.Item col={1}>
                    <Label>Источник</Label>
                    {getOptionName(orderSourses?.data, order?.source)}
                </Layout.Item>
                <Layout.Item col={1}>
                    <Label>Сумма</Label>
                    {formatPrice(fromKopecksToRouble(order?.price || 0))}
                </Layout.Item>
                <Layout.Item col={1}>
                    <Label>Признак</Label>
                    {new Intl.ListFormat('ru').format(getFeature(order))}
                </Layout.Item>
                <Layout.Item col={1}>
                    <Label>Способ оплаты</Label>
                    {getOptionName(paymentMethods?.data, order?.payment_method)}
                </Layout.Item>
                <Layout.Item col={1}>
                    <Label>Промокод к заказу</Label>
                    {order?.promo_code || 'Отсутствует'}
                </Layout.Item>
            </Layout>
        </Block>
    );
};
