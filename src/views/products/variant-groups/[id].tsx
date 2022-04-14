import { useRouter } from 'next/router';
import { useState } from 'react';

import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';

import Form from '@components/controls/Form';
import Autocomplete from '@components/controls/Autocomplete';

import { Button, scale, Layout, typography, useTheme } from '@scripts/gds';
import { CREATE_PARAM } from '@scripts/constants';

import TrashIcon from '@icons/small/trash.svg';

import { apiClient } from '@api/index';
import { CommonResponse } from '@api/common/types';
import {
    Product,
    Property,
    useCreateVariant,
    useDeleteVariant,
    useUpdateVariant,
    useVariant,
    Variant,
} from '@api/catalog';
import { formatDate } from '@scripts/helpers';
import Popup from '@components/controls/Popup';

const VARIANTS_URL = '/products/variant-groups';

const VariantGroupInfoPanel = ({
    isCreationPage,
    variant,
    onDelete,
    onReset,
}: {
    isCreationPage: boolean;
    variant?: Variant;
    onDelete: () => void;
    onReset: () => void;
}) => (
    <Layout cols={3}>
        <Layout.Item col={2}>
            <Block css={{ marginBottom: scale(2) }}>
                <Block.Body>
                    <Layout cols={2}>
                        <Layout.Item col={1}>
                            <div css={{ ...typography('h3') }}>Инфопанель</div>
                        </Layout.Item>

                        <Layout.Item col={1}>
                            <div
                                css={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Button type="submit">{isCreationPage ? 'Создать' : 'Сохранить'}</Button>

                                <Form.Reset theme="secondary" css={{ marginLeft: scale(2) }} onClick={onReset}>
                                    Отменить
                                </Form.Reset>

                                {isCreationPage ? null : (
                                    <Button
                                        theme="fill"
                                        css={{ marginLeft: scale(2) }}
                                        Icon={TrashIcon}
                                        onClick={onDelete}
                                    >
                                        Удалить
                                    </Button>
                                )}
                            </div>
                        </Layout.Item>
                        <Layout.Item>
                            {(variant?.attribute_ids?.length || 0) > 0 ? (
                                <p>
                                    <b>Кол-во характеристик:</b> {variant?.attribute_ids.length}
                                </p>
                            ) : null}
                            {(variant?.products?.length || 0) > 0 ? (
                                <p>
                                    <b>Кол-во товаров:</b> {variant?.product_ids.length || 0}
                                </p>
                            ) : null}
                        </Layout.Item>
                    </Layout>

                    {isCreationPage ? null : (
                        <Layout cols={2}>
                            <Layout.Item col={1}>
                                <b>Дата создания:</b>{' '}
                                {variant?.created_at ? formatDate(new Date(variant.created_at)) : 'Не известно'}
                            </Layout.Item>
                            <Layout.Item col={1}>
                                <b>Дата изменения:</b>{' '}
                                {variant?.updated_at ? formatDate(new Date(variant.updated_at)) : 'Не известно'}
                            </Layout.Item>
                        </Layout>
                    )}
                </Block.Body>
            </Block>
        </Layout.Item>
    </Layout>
);

const VariantGroup = () => {
    const { colors } = useTheme();
    const { query, push, pathname } = useRouter();
    const groupId: string = query?.id?.toString() || '';
    const isCreationPage = groupId === CREATE_PARAM;
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState('');

    const { data } = useVariant(isCreationPage ? '' : groupId, 'products,attributes');
    const variant = data?.data;

    const createVariant = useCreateVariant();
    const deleteVariant = useDeleteVariant();
    const updateVariant = useUpdateVariant();

    const loadProducts = async (value?: string) => {
        const res: CommonResponse<Product[]> = await apiClient.post('catalog/products:search', {
            data: { filter: { name: value || '' } },
        });

        return res.data ? res.data.map(product => ({ label: product.name, value: product.id })) : [];
    };

    const loadProperties = async (value?: string) => {
        const res: CommonResponse<Property[]> = await apiClient.post('catalog/properties:search', {
            data: { filter: { name: value } },
        });

        return res.data ? res.data.map(property => ({ label: property.display_name, value: property.id })) : [];
    };

    /* TODO provide right type for values */

    return (
        <Form<any>
            initialValues={{
                products: variant ? variant.products.map(p => ({ label: p.name, value: p.id })) : [],
                attributes: variant ? variant.attributes.map(p => ({ label: p.display_name, value: p.id })) : [],
            }}
            enableReinitialize
            onSubmit={async vals => {
                if (isCreationPage) {
                    const createdVariant = await createVariant.mutateAsync({
                        product_ids: vals.products.map((p: { value: string }) => +p.value),
                        attribute_ids: vals.attributes.map((a: { value: string }) => +a.value),
                    });
                    if (createdVariant.data) {
                        push(`${VARIANTS_URL}/${createdVariant.data.id}`);
                    }
                } else if (variant?.id) {
                    updateVariant.mutate(
                        {
                            product_ids: vals.products.map((p: { value: string }) => +p.value),
                            attribute_ids: vals.attributes.map((a: { value: string }) => +a.value),
                            id: variant.id,
                        },
                        {
                            onSuccess: () => setStatus('Данные успешно обновлены'),
                            onError: () => setStatus('Произошла ошибка. Не удалось обновить данные'),
                        }
                    );
                }
            }}
        >
            <PageWrapper h1={isCreationPage ? 'Создание склейки товаров' : `Склейка товаров ${variant?.id}`}>
                <>
                    <VariantGroupInfoPanel
                        isCreationPage={isCreationPage}
                        variant={variant}
                        onDelete={() => setIsOpen(true)}
                        onReset={() => push({ pathname, query })}
                    />

                    <Layout cols={3}>
                        <Layout.Item col={2}>
                            <Block>
                                <Block.Body>
                                    <Layout cols={2}>
                                        <Layout.Item col={1}>
                                            <Form.Field
                                                css={{ maxWidth: scale(50) }}
                                                name="products"
                                                label="Товары"
                                                hint="Начните вводить название товара"
                                            >
                                                <Autocomplete searchAsyncFunc={loadProducts} />
                                            </Form.Field>
                                        </Layout.Item>
                                        <Layout.Item col={1}>
                                            <Form.Field
                                                css={{ maxWidth: scale(50) }}
                                                name="attributes"
                                                label="Аттрибуты"
                                                hint="Начните вводить название атрибута"
                                            >
                                                <Autocomplete searchAsyncFunc={loadProperties} />
                                            </Form.Field>
                                        </Layout.Item>
                                    </Layout>
                                    {createVariant.error?.message ? (
                                        <p css={{ color: colors?.danger, marginTop: scale(2) }}>
                                            {createVariant.error?.message}
                                        </p>
                                    ) : null}
                                </Block.Body>
                            </Block>
                        </Layout.Item>
                    </Layout>
                </>
            </PageWrapper>
            <Popup
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                title={`Вы уверены, что хотите удалить подборку #${variant?.id}`}
            >
                <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        theme="secondary"
                        onClick={() => {
                            setIsOpen(false);
                        }}
                    >
                        Отменить
                    </Button>
                    <Button
                        Icon={TrashIcon}
                        css={{ marginLeft: scale(2) }}
                        onClick={async () => {
                            if (variant) {
                                await deleteVariant.mutateAsync(variant.id);
                            }
                            push(VARIANTS_URL);
                        }}
                    >
                        Удалить
                    </Button>
                </div>
            </Popup>
            <Popup isOpen={Boolean(status)} onRequestClose={() => setStatus('')} title={status}>
                <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setStatus('')}>Хорошо</Button>
                </div>
            </Popup>
        </Form>
    );
};

export default VariantGroup;
