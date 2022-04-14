import { FieldArray, useFormikContext } from 'formik';

import { Button, scale, Layout, useTheme, typography } from '@scripts/gds';
import { mockCategories } from '@scripts/mock';
import { useListCSS } from '@scripts/hooks/useListCSS';
import { SELLER_COMMISSION_TYPES } from '@scripts/data/different';

import PlusIcon from '@icons/small/plus.svg';
import RemoveIcon from '@icons/small/trash.svg';

import Form from '@components/controls/Form';
import Block from '@components/Block';
import CalendarRange from '@components/controls/CalendarRange';
import Select from '@components/controls/Select';

const types = [
    ...[{ label: 'Выберите тип', value: 'Выберите тип' }],
    ...SELLER_COMMISSION_TYPES.map(i => ({ label: i, value: i })),
];
const categories = [{ label: 'Выберите категорию', value: '' }, ...mockCategories.map(i => ({ label: i, value: i }))];

const FieldArrayBlock = () => {
    const {
        values: { commissionArray },
    } =
        useFormikContext<{
            commissionArray: {
                type: { label: string; value: string };
                commission: number;
                product: { label: string; value: string };
                date: Date[];
            }[];
        }>();

    const { colors } = useTheme();
    const titleCSS = {
        ...typography('bodySmBold'),
    };

    const trCSS = {
        ':not(:last-child)': { borderBottom: `1px solid ${colors?.grey400}` },
    };

    const itemCSS = {
        padding: `${scale(3, true)}px`,
    };
    return (
        <>
            <Layout cols={[2, 1, 3, 3, `minmax(180px, 2fr)`]} gap={0} css={trCSS}>
                <Layout.Item css={{ ...titleCSS, ...itemCSS }}>Тип</Layout.Item>
                <Layout.Item css={{ ...titleCSS, ...itemCSS }}>Комиссия</Layout.Item>
                <Layout.Item css={{ ...titleCSS, ...itemCSS }}>Бренд/Категория/Товар</Layout.Item>
                <Layout.Item css={{ ...titleCSS, ...itemCSS }}>Даты активности</Layout.Item>
            </Layout>
            <FieldArray
                name="commissionArray"
                render={({ push, remove }) =>
                    commissionArray.map((c, index) => {
                        const isNewItem = commissionArray.length === index + 1;
                        return (
                            <Layout
                                cols={[2, 1, 3, 3, `minmax(180px, 2fr)`]}
                                gap={0}
                                align={isNewItem ? 'end' : 'start'}
                                css={trCSS}
                                key={`commission-item-${index}`}
                            >
                                <Layout.Item css={{ ...itemCSS }}>
                                    {isNewItem ? (
                                        <Form.Field name={`commissionArray[${index}][type]`}>
                                            <Select items={types} />
                                        </Form.Field>
                                    ) : (
                                        <p>{c.type.label}</p>
                                    )}
                                </Layout.Item>
                                <Layout.Item css={{ ...itemCSS }}>
                                    <Form.Field name={`commissionArray[${index}][commission]`} />
                                </Layout.Item>
                                <Layout.Item css={{ ...itemCSS }}>
                                    {isNewItem ? (
                                        <Form.Field name={`commissionArray[${index}][product]`}>
                                            <Select items={categories} />
                                        </Form.Field>
                                    ) : (
                                        <p>Категория: {c.product.label}</p>
                                    )}
                                </Layout.Item>
                                <Layout.Item css={{ ...itemCSS }}>
                                    <Form.Field name={`commissionArray[${index}][date]`}>
                                        <CalendarRange
                                            nameFrom={`commissionArray[${index}][date_from]`}
                                            nameTo={`commissionArray[${index}][date_to]`}
                                        />
                                    </Form.Field>
                                </Layout.Item>
                                <Layout.Item css={{ display: 'flex', ...itemCSS }}>
                                    {isNewItem && (
                                        <Button
                                            theme="outline"
                                            hidden
                                            Icon={PlusIcon}
                                            onClick={() =>
                                                push({
                                                    type: { label: '', value: '' },
                                                    commission: '',
                                                    product: { label: '', value: '' },
                                                    date: '',
                                                })
                                            }
                                        >
                                            Добавить
                                        </Button>
                                    )}
                                    {!isNewItem && (
                                        <Button theme="outline" onClick={() => console.log('Сохранить')} type="submit">
                                            Сохранить
                                        </Button>
                                    )}
                                    {!isNewItem && (
                                        <Button
                                            theme="outline"
                                            hidden
                                            Icon={RemoveIcon}
                                            css={{ marginLeft: scale(1) }}
                                            onClick={() => remove(index)}
                                        >
                                            Удалить
                                        </Button>
                                    )}
                                </Layout.Item>
                            </Layout>
                        );
                    })
                }
            />
        </>
    );
};

const Commission = () => {
    const { dlBaseStyles, dtBaseStyles, ddBaseStyles } = useListCSS();

    return (
        <>
            <Block css={{ marginBottom: scale(3) }}>
                <Form
                    initialValues={{
                        sellerCommission: '',
                        commissionArray: [
                            {
                                type: '',
                                commission: '',
                                product: '',
                                date: '',
                            },
                        ],
                    }}
                    onSubmit={values => {
                        console.log(values);
                    }}
                >
                    <Block.Header>
                        <h2>Фильтр</h2>
                        <div css={{ display: 'flex', justifyContent: 'flex-end', button: { marginLeft: scale(2) } }}>
                            <Button theme="outline">Удалить</Button>
                            <Button type="submit">Сохранить</Button>
                        </div>
                    </Block.Header>
                    <Block.Body>
                        <dl css={{ ...dlBaseStyles, gridTemplateColumns: '200px 1fr' }}>
                            <dt css={dtBaseStyles}>Комиссия продавца, %</dt>
                            <dd css={{ ...ddBaseStyles, display: 'flex' }}>
                                <Form.Field name="sellerCommission" />
                            </dd>
                        </dl>
                    </Block.Body>
                    <Block.Body>
                        <FieldArrayBlock />
                    </Block.Body>
                </Form>
            </Block>
        </>
    );
};

export default Commission;
