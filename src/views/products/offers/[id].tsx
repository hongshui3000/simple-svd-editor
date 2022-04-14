import { useState, useMemo, Fragment } from 'react';
import { useRouter } from 'next/router';
import { FieldArray, useFormikContext } from 'formik';
import { CSSObject } from '@emotion/core';
import { format } from 'date-fns';
import { Button, scale, useTheme, Layout, typography } from '@scripts/gds';

import OldTable from '@components/OldTable';
import Block from '@components/Block';
import Badge from '@components/controls/Badge';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Tabs from '@components/controls/Tabs';
import Select, { SelectItemProps } from '@components/controls/Select';
import Tooltip from '@components/controls/Tooltip';

import TipIcon from '@icons/small/status/tip.svg';
import PlusIcon from '@icons/plus.svg';
import TrashIcon from '@icons/small/trash.svg';

import { makeOffers } from '@scripts/mock';
import { STATUSES } from '@scripts/data/different';

export interface Store {
    storeName: string;
    quantity: number;
}

const emptyValue = { label: '', value: '' };

const FormChildren = ({ stores }: { stores: string[] }) => {
    const [selectedItem, setSelectedItem] = useState<SelectItemProps>(emptyValue);
    const {
        values: { stores: activeStores },
        dirty,
    } = useFormikContext<{ stores: Store[] }>();

    const options = useMemo(
        () =>
            stores
                .filter(s => !activeStores.find(i => i.storeName.toLowerCase().trim() === s.toLowerCase().trim()))
                .map(i => ({ label: i, value: i })),
        [stores, activeStores]
    );

    return (
        <>
            <FieldArray
                name="stores"
                render={({ remove, push }) => (
                    <>
                        <div css={{ display: 'flex', alignItems: 'flex-end', marginBottom: scale(2) }}>
                            <div css={{ flexGrow: 1 }}>
                                <p css={{ marginBottom: scale(1) }}>
                                    Склад{' '}
                                    <Tooltip
                                        content="Добавьте нужный склад и введите количество имеющегося на нём товара"
                                        arrow
                                        maxWidth={scale(30)}
                                    >
                                        <button type="button" css={{ verticalAlign: 'middle' }}>
                                            <TipIcon />
                                        </button>
                                    </Tooltip>
                                </p>
                                <Select
                                    label=""
                                    name="store"
                                    selectedItem={selectedItem}
                                    onChange={val => {
                                        if (val.selectedItem) setSelectedItem(val.selectedItem);
                                    }}
                                    items={options}
                                    disabled={options.length === 0}
                                    css={{ flexGrow: 1, marginRight: scale(2) }}
                                />
                            </div>

                            <Button
                                theme="outline"
                                onClick={() => {
                                    setSelectedItem(emptyValue);
                                    push({ storeName: selectedItem?.value, quantity: 0 });
                                }}
                                title="Добавить cклад"
                                disabled={options.length === 0 || !selectedItem.value}
                                css={{ flexShrink: 0 }}
                            >
                                <PlusIcon width={scale(2)} height={scale(2)} />
                            </Button>
                        </div>
                        <ul>
                            {activeStores.map((s, index) => (
                                <li key={s.storeName} css={{ marginBottom: scale(2) }}>
                                    <Layout cols={5} gap={scale(2)} align="center">
                                        <Layout.Item col={2}>{s.storeName}</Layout.Item>
                                        <Layout.Item col={2} css={{ display: 'flex', alignItems: 'center' }}>
                                            <Form.Field
                                                type="number"
                                                name={`stores[${index}].quantity`}
                                                css={{ marginRight: scale(1) }}
                                            />
                                            шт.
                                        </Layout.Item>
                                        <Layout.Item col={1} justify="end">
                                            <Button theme="outline" title="Удалить склад" onClick={() => remove(index)}>
                                                <TrashIcon />
                                            </Button>
                                        </Layout.Item>
                                    </Layout>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            />

            <Button type="submit" theme="primary" disabled={!dirty}>
                Сохранить
            </Button>
        </>
    );
};

const statuses = STATUSES.map(i => ({ label: i, value: i }));

const KPI = [
    {
        name: 'На складах',
        value: 0,
    },
    {
        name: 'В заказах клиентов',
        value: 3,
    },
    {
        name: 'На комплектации',
        value: 0,
    },
    {
        name: 'Готовы к отгрузке',
        value: 3,
    },
    {
        name: 'Доставляются',
        value: 0,
    },
    {
        name: 'В пункте выдачи',
        value: 2,
    },
    {
        name: 'У курьера',
        value: 0,
    },
    {
        name: 'Доставлены',
        value: 5,
    },
    {
        name: 'Проблемные',
        value: 0,
    },
    {
        name: 'Ожидается возврат от курьера',
        value: 4,
    },
    {
        name: 'Возвращены клиентами',
        value: 3,
    },
    {
        name: 'Отменены',
        value: 2,
    },
];

const columns = [
    {
        Header: 'Название склада',
        accessor: 'storeName',
        getProps: () => ({ type: 'link' }),
    },
    {
        Header: 'Кол-во экземпляров',
        accessor: 'quantity',
    },
    {
        Header: 'Адрес склада',
        accessor: 'storeAddress',
    },
    {
        Header: 'Контактное лицо',
        accessor: 'contact',
        getProps: () => ({ type: 'double' }),
    },
];

const data = [
    {
        storeName: ['Андреевка', '/sellers/andreevka'],
        quantity: 15,
        storeAddress: '124365, г Москва, г Зеленоград, р-н Крюково, ул Андреевка, д 12',
        contact: ['Владимир', '+79255920302'],
    },
    {
        storeName: ['Силино', '/sellers/silino'],
        quantity: 22,
        storeAddress: '124460, г Москва, г Зеленоград, р-н Силино, к 1206А	',
        contact: ['Ростислав', '+79999993023'],
    },
];

const stores = ['Алтуфьево', 'Звенигород', 'Бакеево', 'Андреевка', 'Силино'];
const activeStores = [
    { storeName: 'Андреевка', quantity: 15 },
    { storeName: 'Силино', quantity: 22 },
];

const offer = makeOffers(1)[0];

const Offer = () => {
    const {
        query: { id },
    } = useRouter();
    const { title, price, residue, status, created } = offer;
    const { colors } = useTheme();
    const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
    const [isResiduePopupOpen, setIsResiduePopupOpen] = useState(false);
    const [hideFilters, setHideFilters] = useState(false);

    const dlStyles: CSSObject = { display: 'grid', gridTemplateColumns: "'1fr 1fr'" };
    const dtStyles: CSSObject = {
        padding: `${scale(1, true)}px ${scale(1)}px ${scale(1, true)}px 0`,
        borderBottom: `1px solid ${colors?.grey200}`,
        ...typography('bodySmBold'),
        ':last-of-type': { border: 'none' },
    };
    const ddStyles: CSSObject = {
        padding: `${scale(1, true)}px 0`,
        borderBottom: `1px solid ${colors?.grey200}`,
        ':last-of-type': { border: 'none' },
    };

    const tableData = useMemo(() => data, []);
    const tableColumns = useMemo(() => columns, []);
    return (
        <PageWrapper title={title}>
            <>
                <Layout cols={5} css={{ marginBottom: scale(3) }}>
                    <Layout.Item col={3}>
                        <Block css={{ marginBottom: scale(3) }}>
                            <Block.Header>
                                <h1 css={{ ...typography('h2'), margin: 0 }}>{title}</h1>
                                <Button
                                    theme="primary"
                                    onClick={() => setIsStatusPopupOpen(true)}
                                    css={{ flexShrink: 0 }}
                                >
                                    Изменить статус
                                </Button>
                            </Block.Header>
                            <Block.Body>
                                <dl css={{ ...dlStyles, gridTemplateColumns: '150px 1fr' }}>
                                    <dt css={dtStyles}>ID оффера</dt>
                                    <dd css={ddStyles}>{id}</dd>
                                    <dt css={dtStyles}>Название товара </dt>
                                    <dd css={ddStyles}>{title}</dd>
                                    <dt css={dtStyles}>Дата создания</dt>
                                    <dd css={ddStyles}>{format(new Date(created), 'dd.MM.yyyy')}</dd>
                                    <dt css={dtStyles}>Текущая цена</dt>
                                    <dd css={ddStyles}>{price} руб.</dd>
                                    <dt css={dtStyles}>Текущий остаток</dt>
                                    <dd css={ddStyles}>{residue} шт.</dd>
                                    <dt css={dtStyles}>Статус</dt>
                                    <dd css={ddStyles}>
                                        <Badge text={status} />
                                    </dd>
                                </dl>
                            </Block.Body>
                        </Block>
                    </Layout.Item>
                    <Layout.Item col={2}>
                        <Block>
                            <Block.Body>
                                <dl css={dlStyles}>
                                    <dt css={{ ...dtStyles, gridColumn: '1 /3' }}>KPI</dt>
                                    {KPI.map(i => (
                                        <Fragment key={i.name}>
                                            <dt css={dtStyles}>{i.name}</dt>
                                            <dd
                                                css={{
                                                    ...ddStyles,
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {i.value} шт.
                                            </dd>
                                        </Fragment>
                                    ))}
                                </dl>
                            </Block.Body>
                        </Block>
                    </Layout.Item>
                </Layout>
                <Tabs>
                    <Tabs.List>
                        <Tabs.Tab>Остатки</Tabs.Tab>
                        <Tabs.Tab>Цены</Tabs.Tab>
                        <Tabs.Tab>История</Tabs.Tab>
                    </Tabs.List>
                    <Block>
                        <Block.Body>
                            <Tabs.Panel>
                                {!hideFilters && (
                                    <Form
                                        initialValues={{
                                            storeName: '',
                                            storeAddress: '',
                                            contact: '',
                                            quantityFrom: '',
                                            quantityTo: '',
                                        }}
                                        onSubmit={values => {
                                            console.log(values);
                                        }}
                                        css={{ marginBottom: scale(2) }}
                                    >
                                        <Layout cols={8} css={{ marginBottom: scale(2) }}>
                                            <Layout.Item col={2}>
                                                <Form.Field name="storeName" label="Название склада" />
                                            </Layout.Item>
                                            <Layout.Item col={1}>
                                                <Form.Field
                                                    name="quantityFrom"
                                                    type="number"
                                                    placeholder="От"
                                                    label="Кол-во экземпляров, шт."
                                                />
                                            </Layout.Item>
                                            <Layout.Item col={1} align="end">
                                                <Form.Field name="quantityTo" type="number" placeholder="До" />
                                            </Layout.Item>
                                            <Layout.Item col={2}>
                                                <Form.Field name="storeAddress" label="Адрес склада" />
                                            </Layout.Item>
                                            <Layout.Item col={2}>
                                                <Form.Field name="contact" label="Контактное лицо" />
                                            </Layout.Item>
                                        </Layout>
                                        <Form.Reset theme="secondary" type="button">
                                            Сбросить
                                        </Form.Reset>
                                        <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                            Применить
                                        </Button>
                                    </Form>
                                )}

                                <div css={{ display: 'flex' }}>
                                    <Button css={{ marginRight: scale(2) }} onClick={() => setIsResiduePopupOpen(true)}>
                                        Редактировать остатки
                                    </Button>
                                    <Button theme="fill" onClick={() => setHideFilters(!hideFilters)}>
                                        {hideFilters ? 'Развернуть' : 'Свернуть'} фильтры
                                    </Button>
                                </div>

                                <OldTable
                                    columns={tableColumns}
                                    data={tableData}
                                    needCheckboxesCol={false}
                                    needSettingsColumn={false}
                                    css={{ marginTop: scale(2) }}
                                />
                            </Tabs.Panel>
                            <Tabs.Panel>Nothing to display for prices</Tabs.Panel>
                            <Tabs.Panel>Nothing to display for history</Tabs.Panel>
                        </Block.Body>
                    </Block>
                </Tabs>
                <Popup
                    isOpen={isStatusPopupOpen}
                    onRequestClose={() => {
                        setIsStatusPopupOpen(false);
                    }}
                    title="Изменить статус офера"
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        onSubmit={values => {
                            console.log(values);
                        }}
                        initialValues={{
                            status: '',
                        }}
                    >
                        <Form.Field label="Статус" name="status" css={{ marginBottom: scale(2) }}>
                            <Select items={statuses} />
                        </Form.Field>

                        <Button type="submit" theme="primary">
                            Сохранить
                        </Button>
                    </Form>
                </Popup>
                <Popup
                    title="Редактировать остатки"
                    popupCss={{ minWidth: scale(50) }}
                    isOpen={isResiduePopupOpen}
                    onRequestClose={() => setIsResiduePopupOpen(false)}
                >
                    <Form
                        onSubmit={values => {
                            console.log(values);
                        }}
                        initialValues={{ stores: activeStores }}
                    >
                        <FormChildren stores={stores} />
                    </Form>
                </Popup>
            </>
        </PageWrapper>
    );
};

export default Offer;
