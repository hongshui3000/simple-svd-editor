import { useState, useMemo } from 'react';
import { Button, scale, useTheme, Layout, typography } from '@scripts/gds';

import OldTable from '@components/OldTable';
import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import MultiSelect from '@components/controls/MultiSelect';
import Select from '@components/controls/Select';
import Pagination from '@components/controls/Pagination';
import Popup from '@components/controls/Popup';
import Tooltip from '@components/controls/Tooltip';

import { sellers, makeOffers } from '@scripts/mock';
import { STATUSES } from '@scripts/data/different';
import { useSelectedRowsData } from '@scripts/hooks/useSelectedRowsData';

import TipIcon from '@icons/small/status/tip.svg';

const statuses = STATUSES.map(i => ({ label: i, value: i }));

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: 'linkedID' }),
    },
    {
        Header: 'Название',
        accessor: 'title',
    },
    {
        Header: 'Продавец',
        accessor: 'seller',
    },
    {
        Header: 'Статус продажи',
        accessor: 'status',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'Цена, руб.',
        accessor: 'price',
        getProps: () => ({ type: 'price' }),
    },
    {
        Header: 'Остаток, шт.',
        accessor: 'residue',
    },
    {
        Header: 'Создано',
        accessor: 'created',
        getProps: () => ({ type: 'date' }),
    },
];

const changeOfferStatusPopupColumns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Название',
        accessor: 'title',
    },
    {
        Header: 'Продавец',
        accessor: 'seller',
    },
];

const SELLERS = sellers.map(i => ({ label: i, value: i }));

const Offers = () => {
    const { colors } = useTheme();
    const [moreFilters, setMoreFilters] = useState(true);
    const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
    const [isChangeOfferOpen, setIsChangeOfferOpen] = useState(false);
    const data = useMemo(() => makeOffers(10), []);
    const [ids, setIds, popupTableData] = useSelectedRowsData<typeof data[0]>(data);
    return (
        <PageWrapper h1="Предложения продавцов">
            <>
                <Block css={{ marginBottom: scale(3) }}>
                    <Form
                        initialValues={{
                            offerID: '',
                            productName: '',
                            priceFrom: '',
                            priceTo: '',
                            residueFrom: '',
                            residueTo: '',
                            status: [],
                            seller: [],
                        }}
                        onSubmit={values => {
                            console.log(values);
                        }}
                    >
                        <Block.Body>
                            <Layout cols={8}>
                                <Layout.Item col={1}>
                                    <Form.Field name="offerID" label="ID оффера" />
                                </Layout.Item>
                                <Layout.Item col={3}>
                                    <Form.Field name="productName" label="Наименование товара" />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.Field name="priceFrom" label="Цена" type="number" placeholder="От" />
                                </Layout.Item>
                                <Layout.Item col={1} css={{ marginTop: scale(3) }} align="end">
                                    <Form.Field name="priceTo" type="number" placeholder="До" />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.Field name="residueFrom" label="Остаток" type="number" placeholder="От" />
                                </Layout.Item>
                                <Layout.Item col={1} css={{ marginTop: scale(3) }} align="end">
                                    <Form.Field name="residueTo" type="number" placeholder="До" />
                                </Layout.Item>

                                {moreFilters ? (
                                    <>
                                        <Layout.Item col={4}>
                                            <Form.Field name="status" label="Статус">
                                                <MultiSelect items={statuses} />
                                            </Form.Field>
                                        </Layout.Item>
                                        <Layout.Item col={4}>
                                            <Form.Field name="seller" label="Продавец">
                                                <MultiSelect items={SELLERS} />
                                            </Form.Field>
                                        </Layout.Item>
                                    </>
                                ) : null}
                            </Layout>
                        </Block.Body>
                        <Block.Footer>
                            <div css={typography('bodySm')}>
                                Найдено 135 предложений{' '}
                                <button
                                    type="button"
                                    css={{ color: colors?.primary, marginLeft: scale(2) }}
                                    onClick={() => setMoreFilters(!moreFilters)}
                                >
                                    {moreFilters ? 'Меньше' : 'Больше'} фильтров
                                </button>{' '}
                            </div>
                            <div>
                                <Form.Reset theme="secondary" type="button">
                                    Сбросить
                                </Form.Reset>
                                <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                    Применить
                                </Button>
                            </div>
                        </Block.Footer>
                    </Form>
                </Block>

                <Block>
                    <Block.Header>
                        <div>
                            <Button
                                theme="primary"
                                css={{ marginRight: scale(2) }}
                                onClick={() => setIsAddOfferOpen(true)}
                            >
                                Добавить оффер
                            </Button>
                            {ids.length !== 0 ? (
                                <>
                                    <Button
                                        theme="primary"
                                        css={{ marginRight: scale(2) }}
                                        onClick={() => setIsChangeOfferOpen(true)}
                                    >
                                        Изменить статус {ids.length > 1 ? 'оферов' : 'офера'}
                                    </Button>
                                </>
                            ) : null}
                            {ids.length === 1 ? <Button theme="primary">изменить оффер</Button> : null}
                        </div>
                    </Block.Header>
                    <Block.Body>
                        <OldTable
                            columns={COLUMNS}
                            data={data}
                            editRow={row => console.log('rowdata', row)}
                            onRowSelect={setIds}
                        />
                        <Pagination pages={7} css={{ marginTop: scale(2) }} />
                    </Block.Body>
                </Block>
                <Popup
                    isOpen={isAddOfferOpen}
                    onRequestClose={() => {
                        setIsAddOfferOpen(false);
                    }}
                    title="Добавить новый оффер"
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        onSubmit={values => {
                            console.log(values);
                        }}
                        initialValues={{
                            addProductID: '',
                            addProductSellers: '',
                            addProductPrice: '',
                        }}
                    >
                        <Form.Field
                            label="ID товара"
                            name="addProductID"
                            type="number"
                            css={{ marginBottom: scale(2) }}
                        />
                        <Form.Field label="Продавцы" name="addProductSellers" css={{ marginBottom: scale(2) }}>
                            <Select items={SELLERS} />
                        </Form.Field>
                        <Form.Field
                            label="Цена, руб"
                            name="addProductPrice"
                            type="number"
                            css={{ marginBottom: scale(2) }}
                        />
                        <Form.Field
                            label={
                                <>
                                    Остаток{' '}
                                    <Tooltip
                                        content="Добавьте нужный склад и введите количество имеющегося на нём товара"
                                        arrow
                                        maxWidth={scale(15)}
                                    >
                                        <button type="button">
                                            <TipIcon />
                                        </button>
                                    </Tooltip>
                                </>
                            }
                            name="addProductResidue"
                            css={{ marginBottom: scale(2) }}
                        >
                            <Select
                                items={[
                                    { label: 'остаток 1', value: 'остаток 1' },
                                    { label: 'остаток 2', value: 'остаток 2' },
                                ]}
                            />
                        </Form.Field>
                        <Form.Field label="Статус" name="status" css={{ marginBottom: scale(4) }}>
                            <Select items={statuses} />
                        </Form.Field>

                        <Button type="submit" theme="primary">
                            Сохранить
                        </Button>
                    </Form>
                </Popup>
                <Popup
                    isOpen={isChangeOfferOpen}
                    onRequestClose={() => {
                        setIsChangeOfferOpen(false);
                    }}
                    title={`Редактировать статус оффер${ids.length === 1 ? 'a' : 'ов'}`}
                    popupCss={{ minWidth: scale(60) }}
                >
                    <Form
                        onSubmit={values => {
                            console.log(values);
                        }}
                        initialValues={{
                            changedStatus: null,
                        }}
                    >
                        <OldTable
                            columns={changeOfferStatusPopupColumns}
                            data={popupTableData}
                            needCheckboxesCol={false}
                            needSettingsColumn={false}
                            css={{ marginBottom: scale(2) }}
                        />
                        <Form.Field name="changedStatus" label="Статус" css={{ marginBottom: scale(2) }}>
                            <Select items={statuses} />
                        </Form.Field>

                        <Button type="submit" theme="primary">
                            Сохранить
                        </Button>
                    </Form>
                </Popup>
            </>
        </PageWrapper>
    );
};

export default Offers;
