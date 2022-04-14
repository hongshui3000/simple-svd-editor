import { useState, useMemo } from 'react';
import { Button, scale } from '@scripts/gds';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Image from 'next/image';

import { useProductDetail } from '@api/catalog/products';

import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';
// import Badge from '@components/Badge';

import Tabs from '@components/controls/Tabs';
import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';

import { useError } from '@context/modal';
import { useTabs } from '@scripts/hooks';
import { ImageTypes } from '@scripts/enums';

import MasterData from './MasterData';
import StoreAndDelivery from './StoreAndDelivery';
import Content from './Content';
// import Categories from './Categories';
// import History from './History';
// import Marketing from './Marketing';
// import Offers from './Offers';
// import Orders from './Orders';

// import { STATUSES } from '@scripts/enums';

import noImg from '../../../../../public/noimage.png';

const Product = () => {
    const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
    const { query } = useRouter();
    const { getTabsProps } = useTabs();

    const { id } = query;

    const {
        data: apiData,
        isIdle,
        error,
        refetch,
        isLoading,
    } = useProductDetail(
        {
            id: String(id),
            include: 'brand, category, images, attributes, type, manufacturer, country',
        },
        Boolean(id)
    );

    const productData = useMemo(() => (apiData ? apiData.data : null), [apiData]);

    const productCharachteristics = useMemo(
        () =>
            productData
                ? [
                      { name: 'ID', value: productData.id },
                      { name: 'Артикул:', value: productData.external_id },
                      //   { name: 'Текущая цена товара на витрине:', value: productData.price },
                      //   { name: 'Текущий остаток товара на витрине:', value:  },
                      {
                          name: 'Дата создания товара:',
                          value: productData.created_at
                              ? format(new Date(productData.created_at), 'dd.MM.yyyy HH:mm')
                              : '-',
                      },
                      //   { name: 'Дата последнего обновления товара:', value: '2021-03-04 10:48:20' },
                  ]
                : [],
        [productData]
    );

    useError(error);

    return (
        <>
            <PageWrapper h1={productData?.name} isLoading={isLoading || isIdle}>
                {productData ? (
                    <>
                        <div css={{ display: 'inline-block', marginBottom: scale(2) }}>
                            <Block>
                                <Block.Body css={{ display: 'flex' }}>
                                    <div css={{ maxWidth: scale(25), maxHeight: scale(25) }}>
                                        <Image
                                            src={`${
                                                productData?.images.find(({ type }) => type === ImageTypes.BASE)
                                                    ?.file || noImg.src
                                            }`}
                                            alt={productData?.name}
                                            width="100%"
                                            height="100%"
                                        />
                                    </div>
                                    <div css={{ marginLeft: scale(4) }}>
                                        {/* TODO: Доинтегрировать, когда появятся методы */}
                                        {/* <Badge
                                        text="Согласовано"
                                        type={STATUSES.SUCCESS}
                                        css={{ marginBottom: scale(2) }}
                                    /> */}
                                        <table css={{ margin: `${scale(2)}px 0` }}>
                                            <tbody>
                                                {productCharachteristics &&
                                                    productCharachteristics.map(({ name, value }) => (
                                                        <tr key={name}>
                                                            <th css={{ textAlign: 'left', paddingRight: scale(2) }}>
                                                                {name}
                                                            </th>
                                                            <td css={{ textAlign: 'right' }}>{value}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                        {/* TODO: Доинтегрировать, когда появятся методы */}
                                        {/* <Button theme="outline"  onClick={() => setIsChangeStatusOpen(true)}>
                                        Изменить статус
                                    </Button> */}
                                    </div>
                                </Block.Body>
                            </Block>
                        </div>
                        <Tabs {...getTabsProps()}>
                            <Tabs.List>
                                <Tabs.Tab>Мастер-данные</Tabs.Tab>
                                <Tabs.Tab>Хранение и доставка</Tabs.Tab>
                                <Tabs.Tab>Контент</Tabs.Tab>
                                {/* TODO: Доинтегрировать, когда появятся методы */}
                                {/* <Tabs.Tab>Категории</Tabs.Tab>
                                <Tabs.Tab>Предложения</Tabs.Tab>
                                <Tabs.Tab>В заказах</Tabs.Tab>
                                <Tabs.Tab>История</Tabs.Tab>
                                <Tabs.Tab>Маркетинг</Tabs.Tab> */}
                            </Tabs.List>
                            <Block>
                                <Block.Body>
                                    <Tabs.Panel>
                                        {productData && (
                                            <MasterData
                                                productData={productData}
                                                refetch={async () => {
                                                    await refetch();
                                                }}
                                            />
                                        )}
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        {productData && (
                                            <StoreAndDelivery
                                                productData={productData}
                                                refetch={async () => {
                                                    await refetch();
                                                }}
                                            />
                                        )}
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Content
                                            productData={productData}
                                            refetch={async () => {
                                                await refetch();
                                            }}
                                        />
                                    </Tabs.Panel>
                                    {/* TODO: Доинтегрировать, когда появятся методы */}
                                    {/* <Tabs.Panel>
                                        <Categories text="Резинки для волос" />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Offers />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Orders />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <History />
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Marketing />
                                    </Tabs.Panel> */}
                                </Block.Body>
                            </Block>
                        </Tabs>
                    </>
                ) : null}
            </PageWrapper>
            <Popup
                isOpen={isChangeStatusOpen}
                onRequestClose={() => setIsChangeStatusOpen(false)}
                title="Изменить статус"
                popupCss={{
                    maxWidth: 'initial',
                    width: scale(70),
                }}
            >
                <Form
                    onSubmit={values => console.log(values)}
                    initialValues={{
                        status: null,
                    }}
                >
                    <Form.Field name="status" label="Статус проверки" css={{ marginBottom: scale(2) }}>
                        <Select
                            items={[
                                { label: 'Согласовано', value: 'agreed' },
                                { label: 'Не согласовано', value: 'notAgreed' },
                                { label: 'Отправлено', value: 'sent' },
                                { label: 'На рассмотрении', value: 'inProcess' },
                                { label: 'Отклонено', value: 'rejected' },
                            ]}
                        />
                    </Form.Field>
                    <div css={{ display: 'flex' }}>
                        <Form.Reset
                            theme="outline"
                            onClick={() => setIsChangeStatusOpen(false)}
                            css={{ marginRight: scale(2) }}
                        >
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

export default Product;
