import { useState } from 'react';
import { FormikValues } from 'formik';
import { Button, scale, Layout, useTheme, typography } from '@scripts/gds';

import Block from '@components/Block';
import Form from '@components/controls/Form';
import MultiSelect from '@components/controls/MultiSelect';
import Select from '@components/controls/Select';
import Checkbox from '@components/controls/Checkbox';
import Tooltip from '@components/controls/Tooltip';

import CalendarRange from '@components/controls/CalendarRange';

import { Seller, SellerUser } from '@api/units';

import TipIcon from '@icons/small/status/tip.svg';

const DiscountsFilter = ({
    initialValues,
    onSubmit,
    onReset,
    quantity,
    sellers,
    users,
    statuses,
    types,
}: {
    initialValues: FormikValues;
    onSubmit: (filters: FormikValues) => void;
    onReset: () => void;
    quantity: number;
    sellers: Seller[];
    users: SellerUser[];
    statuses: { value: string | number; label: string }[];
    types?: { value: string; label: string }[];
}) => {
    const { colors } = useTheme();
    const [moreFilters, setMoreFilters] = useState(false);

    const preparedSellers = sellers.map(item => ({ label: `${item.legal_name}`, value: `${item.id}` }));
    const preparedUsers = users.map(item => ({ label: `${item.login}`, value: `${item.id}` }));

    return (
        <>
            <Block css={{ marginBottom: scale(3) }}>
                <Form initialValues={initialValues} onSubmit={onSubmit} onReset={onReset}>
                    <Block.Body>
                        <Layout cols={4}>
                            <Layout.Item col={1}>
                                <Form.Field name="id" label="ID" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.Field name="name" label="Название" />
                            </Layout.Item>
                            <Layout.Item col={1}>
                                <Form.Field name="status" label="Статус">
                                    <Select items={statuses} />
                                </Form.Field>
                            </Layout.Item>

                            {moreFilters ? (
                                <>
                                    <Layout.Item col={4}>
                                        <hr />
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <Form.Field name="type" label="Скидка на">
                                            <Select items={types || []} />
                                        </Form.Field>
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <Form.Field name="seller_id" label="Инициатор">
                                            <MultiSelect items={preparedSellers} />
                                        </Form.Field>
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <Form.Field name="user_id" label="Автор">
                                            <MultiSelect items={preparedUsers} />
                                        </Form.Field>
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <CalendarRange
                                            label="Дата создания"
                                            nameFrom="creation_date_from"
                                            nameTo="creation_date_to"
                                        />
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <Layout cols={3}>
                                            <Layout.Item col={2}>
                                                <CalendarRange
                                                    label="Период действия скидки"
                                                    nameFrom="date_from"
                                                    nameTo="date_to"
                                                />
                                            </Layout.Item>
                                            <Layout.Item col={1} align="end">
                                                <Form.Field name="is_unlimited">
                                                    <Checkbox value="true">Бессрочная</Checkbox>
                                                </Form.Field>
                                            </Layout.Item>
                                            <Layout.Item col={1} align="end">
                                                <Form.Field name="exact_start">
                                                    <Checkbox value="true">
                                                        Точная дата
                                                        <Tooltip
                                                            content="Искать точное совпадание с датой начала и/или окончания скидки"
                                                            arrow
                                                            maxWidth={scale(30)}
                                                        >
                                                            <button
                                                                type="button"
                                                                css={{
                                                                    marginLeft: scale(1, true),
                                                                    verticalAlign: 'middle',
                                                                }}
                                                            >
                                                                <TipIcon />
                                                            </button>
                                                        </Tooltip>
                                                    </Checkbox>
                                                </Form.Field>
                                            </Layout.Item>
                                            <Layout.Item col={1} align="end">
                                                <Form.Field name="exact_end">
                                                    <Checkbox value="true">
                                                        Точная дата
                                                        <Tooltip
                                                            content="Искать точное совпадание с датой начала и/или окончания скидки"
                                                            arrow
                                                            maxWidth={scale(30)}
                                                        >
                                                            <button
                                                                type="button"
                                                                css={{
                                                                    marginLeft: scale(1, true),
                                                                    verticalAlign: 'middle',
                                                                }}
                                                            >
                                                                <TipIcon />
                                                            </button>
                                                        </Tooltip>
                                                    </Checkbox>
                                                </Form.Field>
                                            </Layout.Item>
                                        </Layout>
                                    </Layout.Item>
                                </>
                            ) : null}
                        </Layout>
                    </Block.Body>
                    <Block.Footer>
                        <div css={typography('bodySm')}>
                            Найдено {quantity} товаров{' '}
                            <button
                                type="button"
                                css={{ color: colors?.primary, marginLeft: scale(2) }}
                                onClick={() => setMoreFilters(!moreFilters)}
                            >
                                {moreFilters ? 'Меньше' : 'Больше'} фильтров
                            </button>{' '}
                        </div>
                        <div>
                            <Form.Reset theme="secondary" type="button" onClick={onReset}>
                                Сбросить
                            </Form.Reset>
                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Применить
                            </Button>
                        </div>
                    </Block.Footer>
                </Form>
            </Block>
        </>
    );
};

export default DiscountsFilter;
