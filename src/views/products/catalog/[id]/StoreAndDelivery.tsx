import { useState, useMemo } from 'react';
import * as Yup from 'yup';
import { Layout, scale, Button, typography } from '@scripts/gds';

import { ProductDetail } from '@api/catalog/types';
import { useProductDetailUpdate } from '@api/catalog';

import Block from '@components/Block';

import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';
import { useError, useSuccess } from '@context/modal';

import { ModalMessages } from '@scripts/constants';

import EditIcon from '@icons/small/edit.svg';

interface StoreAndDeliveryProp {
    productData: ProductDetail;
    refetch: () => Promise<void>;
}

const StoreAndDelivery = ({ productData, refetch }: StoreAndDeliveryProp) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [specialPackChecked, setSpecialPackChecked] = useState(false);
    // const [specialStoreChecked, setSpecialStoreChecked] = useState(false);

    const updateProduct = useProductDetailUpdate();

    const getValueWithUnit = (value?: string | number | boolean, unit?: string) => {
        if (typeof value === 'boolean') {
            return value ? 'Да' : 'Нет';
        }
        if (!value) {
            return '-';
        }

        return `${value} ${unit}`;
    };
    const data = useMemo(
        () => [
            {
                name: 'Ширина',
                value: getValueWithUnit(productData.width, 'мм'),
            },
            {
                name: 'Высота',
                value: getValueWithUnit(productData.height, 'мм'),
            },
            {
                name: 'Длинна',
                value: getValueWithUnit(productData.length, 'мм'),
            },
            {
                name: 'Вес',
                value: getValueWithUnit(productData.weight, 'гр'),
            },
        ],
        [productData]
    );

    useError(updateProduct.error);

    useSuccess(updateProduct.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');

    return (
        <>
            <Layout cols={4} css={{ marginTop: scale(2) }}>
                <Layout.Item col={1}>
                    <Block>
                        <Block.Header>
                            <p css={typography('h3')}>Характеристики</p>
                            <Button Icon={EditIcon} type="button" theme="ghost" hidden onClick={() => setIsOpen(true)}>
                                редактировать
                            </Button>
                        </Block.Header>
                        <Block.Body>
                            <table width="100%">
                                <tbody>
                                    {data.map(i => (
                                        <tr key={i.name}>
                                            <th css={{ textAlign: 'right', paddingRight: scale(2), width: '60%' }}>
                                                {i.name}
                                            </th>
                                            <td css={{ textAlign: 'left', width: '40%' }}>{i.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Block.Body>
                    </Block>
                </Layout.Item>
            </Layout>
            <Popup
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                title="Хранение и доставка"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                {/* TODO provide right type for values */}
                <Form<any>
                    onSubmit={async values => {
                        await updateProduct.mutate({ ...productData, ...values }, { onSuccess: () => refetch() });
                        setIsOpen(false);
                    }}
                    initialValues={{
                        width: productData.width || '',
                        height: productData.height || '',
                        length: productData.length || '',
                        weight: productData.weight || '',
                    }}
                    validationSchema={Yup.object().shape({
                        width: Yup.number().required('Введите значение'),
                        height: Yup.number().required('Введите значение'),
                        length: Yup.number().required('Введите значение'),
                        weight: Yup.number().required('Введите значение'),
                    })}
                >
                    <Layout cols={2} css={{ marginBottom: scale(4) }}>
                        <Layout.Item col={1}>
                            <Form.Field name="width" label="Ширина, мм" type="number" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field name="height" label="Высота, мм" type="number" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field name="length" label="Длинна, мм" type="number" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field name="weight" label="Вес, гр" type="number" />
                        </Layout.Item>
                    </Layout>
                    <div css={{ display: 'flex' }}>
                        <Form.Reset theme="outline" onClick={() => setIsOpen(false)} css={{ marginRight: scale(2) }}>
                            Отменить
                        </Form.Reset>
                        <Button type="submit" theme="primary">
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </Popup>
        </>
    );
};

export default StoreAndDelivery;
