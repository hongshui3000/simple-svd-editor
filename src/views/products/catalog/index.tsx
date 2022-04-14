import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Button, scale, Layout, typography } from '@scripts/gds';
import { FormikValues } from 'formik';

import { useProducts, useBrands, useCategories } from '@api/catalog';

import PageWrapper from '@components/PageWrapper';
import OldTable, { TableRowProps } from '@components/OldTable';
import Block from '@components/Block';

import Form from '@components/controls/Form';
import CalendarRange from '@components/controls/CalendarRange';
import Tooltip from '@components/controls/Tooltip';
import Pagination from '@components/controls/Pagination';
import Select from '@components/controls/Select';

import { declOfNum } from '@scripts/helpers';
import { ITEMS_PER_PRODUCTS_PAGE } from '@scripts/constants';
import { useFiltersHelper } from '@scripts/hooks';

import TipIcon from '@icons/small/status/tip.svg';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: 'linkedID' }),
    },
    {
        Header: '',
        accessor: 'photo',
        getProps: () => ({ type: 'photo' }),
    },
    {
        Header: 'Название и артикул',
        accessor: 'title',
        getProps: () => ({ type: 'double' }),
    },
    {
        Header: 'Бренд',
        accessor: 'brand',
    },
    {
        Header: 'Категория',
        accessor: 'category',
    },
    {
        Header: 'Дата создания',
        accessor: 'date',
        getProps: () => ({ type: 'date' }),
    },
    {
        Header: 'Цена, руб.',
        accessor: 'price',
        getProps: () => ({ type: 'price' }),
    },
    {
        Header: 'Количество, шт',
        accessor: 'quantity',
    },
    {
        Header: 'На витрине',
        accessor: 'active',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'В архиве',
        accessor: 'archive',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'Контент',
        accessor: 'content',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'Согласование',
        accessor: 'agreed',
        getProps: () => ({ type: 'status' }),
    },
    {
        Header: 'Отгружен в Shoppilot',
        accessor: 'shoppilot',
    },
];

const CatalogFilter = ({
    initialValues,
    totalProducts,
    onSubmit,
    onReset,
}: {
    initialValues: FormikValues;
    totalProducts: number;
    onSubmit: (filters: FormikValues) => void;
    onReset: () => void;
}) => {
    const { data: brandsData } = useBrands({ pagination: { type: 'offset', limit: -1, offset: 0 } });
    const { data: categoriesData } = useCategories({});

    const brandOptions = useMemo(
        () => brandsData?.data.map(({ name, code }) => ({ label: name, value: code })) || [],
        [brandsData?.data]
    );

    const categoryOptions = useMemo(
        () => categoriesData?.data.map(({ name, code }) => ({ label: name, value: code })) || [],
        [categoriesData?.data]
    );
    return (
        <>
            <Block css={{ marginBottom: scale(3) }}>
                <Form initialValues={initialValues} enableReinitialize onSubmit={onSubmit}>
                    <Block.Body>
                        <Layout cols={12}>
                            <Layout.Item col={4}>
                                <Form.Field name="name" label="Название" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.Field name="code" label="Артикул" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.Field name="id" label="ID" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.Field name="priceFrom" label="Цена" type="number" placeholder="От" />
                            </Layout.Item>
                            <Layout.Item col={2} css={{ marginTop: scale(3) }} align="end">
                                <Form.Field name="priceTo" type="number" placeholder="До" />
                            </Layout.Item>
                            <Layout.Item col={4}>
                                <CalendarRange label="Введите дату" nameTo="created_at_to" nameFrom="created_at_from" />
                            </Layout.Item>
                            <Layout.Item col={4}>
                                <Form.Field name="brand">
                                    <Select
                                        label="Бренд"
                                        defaultIndex={0}
                                        items={[{ value: '', label: 'Не выбрано' }, ...brandOptions]}
                                    />
                                </Form.Field>
                            </Layout.Item>
                            <Layout.Item col={4}>
                                <Form.Field name="category">
                                    <p css={{ marginBottom: scale(1) }}>
                                        Категория{' '}
                                        <Tooltip
                                            content="Будут показаны товары выбранной и всех дочерних категорий"
                                            arrow
                                            maxWidth={scale(30)}
                                        >
                                            <button type="button" css={{ verticalAlign: 'middle' }}>
                                                <TipIcon />
                                            </button>
                                        </Tooltip>
                                    </p>
                                    <Select
                                        defaultIndex={0}
                                        items={[{ value: '', label: 'Не выбрано' }, ...categoryOptions]}
                                    />
                                </Form.Field>
                            </Layout.Item>
                        </Layout>
                    </Block.Body>
                    <Block.Footer>
                        <div css={typography('bodySm')}>
                            Найдено {`${totalProducts} ${declOfNum(totalProducts, ['товар', 'товара', 'товаров'])}`}
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

const CatalogTable = ({
    data,
    pages,
}: // onRowSelect,
{
    data: TableRowProps[];
    pages: number | null;
    // onRowSelect: (ids: number[]) => void;
}) => (
    <>
        <OldTable
            columns={COLUMNS}
            data={data}
            editRow={row => console.log('rowdata', row)}
            // onRowSelect={onRowSelect}
        />
        {pages ? <Pagination pages={pages} css={{ marginTop: scale(2) }} /> : null}
    </>
);

const Catalog = () => {
    const emptyInitialValues = {
        id: '',
        name: '',
        code: '',
        category: [],
        brand: [],
        created_at_from: '',
        created_at_to: '',
        priceFrom: '',
        priceTo: '',
    };

    const { pathname, push, query } = useRouter();

    const activePage = Number(query?.page || 1);

    const { initialValues, URLHelper } = useFiltersHelper(emptyInitialValues);

    // const [isChangeBadgeOpen, setIsChangeBadgeOpen] = useState(false);
    // const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
    const { data } = useProducts({
        filter: {
            id: initialValues.id,
            name: initialValues.name,
            code: initialValues.code && [initialValues.code],
            category_id: initialValues.category && [initialValues.category],
            brand_id: initialValues.brand && [initialValues.brand],
            created_at_from: initialValues.created_at_from && new Date(initialValues.created_at_from).toISOString(),
            created_at_to: initialValues.created_at_to && new Date(initialValues.created_at_to).toISOString(),
            price_from: initialValues.priceFrom,
            price_to: initialValues.priceTo,
        },
        pagination: {
            type: 'offset',
            limit: ITEMS_PER_PRODUCTS_PAGE,
            offset: (activePage - 1) * ITEMS_PER_PRODUCTS_PAGE,
        },
    });

    const convertedProducts = useMemo(
        () =>
            data?.data?.map(p => ({
                id: p.id,
                photo: p.images && p.images[0].file,
                title: [p.name, p.barcode],
                brand: p.brand?.name,
                category: p.category?.name,
                price: p.price,
                active: p.sale_active,
                date: p.created_at,
            })) || [],
        [data?.data]
    );

    const totalProducts = data?.meta?.pagination?.total || 0;

    const pages = totalProducts ? Math.ceil(totalProducts / ITEMS_PER_PRODUCTS_PAGE) : null;

    // const [ids, setIds, popupTableData] = useSelectedRowsData<typeof convertedProducts[0]>(convertedProducts);

    // const copyToClipBoard = useCallback(() => {
    //     const selectedIDs = popupTableData.map((d: { id: string }) => d.id);
    //     navigator.clipboard.writeText(selectedIDs.join(',')).catch(() => alert('Не удалось скопировать ID!'));
    // }, [popupTableData]);

    return (
        <PageWrapper h1="Товары">
            <>
                <CatalogFilter
                    initialValues={initialValues}
                    totalProducts={totalProducts}
                    onSubmit={URLHelper}
                    onReset={() => push(pathname)}
                />
                <Block>
                    {/* {ids.length !== 0 ? (
                        <Block.Header>
                            <div css={{ display: 'flex' }}> */}
                    {/* <Button
                                theme="primary"

                                css={{ marginRight: scale(2) }}
                                onClick={() => alert('Тут должен быть экспорт')}
                                Icon={ExportIcon}
                            >
                                Экспорт отфильтрованных товаров
                            </Button> */}

                    {/* <Button
                                        theme="primary"

                                        css={{ marginRight: scale(2) }}
                                        onClick={() => alert('Тут должен быть экспорт')}
                                        Icon={ExportIcon}
                                    >
                                        Экспорт выбранных
                                    </Button> */}
                    {/* <Button
                                    theme="primary"

                                    css={{ marginRight: scale(2) }}
                                    onClick={() => setIsChangeStatusOpen(true)}
                                >
                                    Изменить статус
                                </Button>
                                <Tooltip
                                    content={`ID скопирован${ids.length > 1 ? 'ы' : ''}`}
                                    arrow
                                    maxWidth={scale(30)}
                                    trigger="click"
                                    onShow={instance => {
                                        setTimeout(() => {
                                            instance.hide();
                                        }, 1000);
                                    }}
                                >
                                    <Button
                                        theme="outline"

                                        css={{ marginRight: scale(2) }}
                                        Icon={CopyIcon}
                                        onClick={copyToClipBoard}
                                    >
                                        Копировать ID
                                    </Button>
                                </Tooltip>
                                <Button
                                    theme="outline"

                                    css={{ marginRight: scale(2) }}
                                    Icon={SettingsIcon}
                                    onClick={() => setIsChangeBadgeOpen(true)}
                                >
                                    Назначить шильдики
                                </Button>
                            </div>
                        </Block.Header>
                    ) : null} */}
                    <Block.Body>
                        <CatalogTable data={convertedProducts} pages={pages} />
                    </Block.Body>
                </Block>
                {/* <Popup
                    isOpen={isChangeStatusOpen}
                    onRequestClose={() => setIsChangeStatusOpen(false)}
                    title={`Редактировать статус оффер${ids.length === 1 ? 'a' : 'ов'}`}
                    popupCss={{ minWidth: scale(60) }}
                >
                    <Form
                        onSubmit={values => {
                            console.log(values);
                        }}
                        initialValues={{
                            status: null,
                        }}
                    >
                        <div
                            css={{
                                maxHeight: scale(40),
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                marginBottom: scale(4),
                            }}
                        >
                            <OldTable
                                columns={changeStatusPopupColumns}
                                data={popupTableData}
                                needCheckboxesCol={false}
                                needSettingsColumn={false}
                                css={{ marginBottom: scale(2) }}
                            />
                        </div>
                        <Form.Field name="status" css={{ marginBottom: scale(2) }}>
                            <Select
                                label="Сменить статус"
                                items={[
                                    { value: 'inArchive', label: 'В архив' },
                                    { value: 'fromArchive', label: 'Из архива' },
                                    { value: 'needShooting', label: 'Контент: Необходима съемка' },
                                    { value: 'shootingAllowed', label: 'Контент: Съемка одобрена' },
                                    { value: 'accepted', label: 'Контент: Принято на студии' },
                                    { value: 'shooting', label: 'Контент: На съемке' },
                                    { value: 'agreed', label: 'Контент: Согласовано' },
                                    { value: 'uploaded', label: 'Контент: Загружено' },
                                    { value: 'clarify', label: 'Контент: Требуется уточнение' },
                                    { value: 'rejected', label: 'Контент: Отклонено' },
                                    { value: 'notAgreed', label: 'Согласование: Не согласовано' },
                                    { value: 'sent', label: 'Согласование: Отправлено' },
                                    { value: 'inProcess', label: 'Согласование: На рассмотрении' },
                                    { value: 'rejected', label: 'Согласование: Отклонено' },
                                    { value: 'agreed', label: 'Согласование: Согласовано' },
                                ]}
                            />
                        </Form.Field>
                        <Button type="submit"  theme="primary">
                            Сохранить
                        </Button>
                    </Form>
                </Popup>
                <Popup
                    isOpen={isChangeBadgeOpen}
                    onRequestClose={() => setIsChangeBadgeOpen(false)}
                    title={`Редактирование шильдиков товар${ids.length === 1 ? 'a' : 'ов'}`}
                    popupCss={{ minWidth: scale(60) }}
                >
                    <Form
                        onSubmit={values => {
                            console.log(values);
                        }}
                        initialValues={{
                            badges: [],
                        }}
                    >
                        <Form.Field name="badges" css={{ marginBottom: scale(2) }}>
                            <CheckboxGroup label="Шильдики">
                                <Checkbox value="new">Новинки</Checkbox>
                                <Checkbox value="discount">Скидки</Checkbox>
                                <Checkbox value="week">Товар недели</Checkbox>
                                <Checkbox value="hit">Хит</Checkbox>
                            </CheckboxGroup>
                        </Form.Field>
                        <div
                            css={{
                                maxHeight: scale(40),
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                marginBottom: scale(2),
                            }}
                        >
                            <OldTable
                                columns={changeStatusPopupColumns}
                                data={popupTableData}
                                needCheckboxesCol={false}
                                needSettingsColumn={false}
                                css={{ marginBottom: scale(2) }}
                            />
                        </div>

                        <div css={{ display: 'flex' }}>
                            <Form.Reset

                                theme="outline"
                                onClick={() => setIsChangeBadgeOpen(false)}
                                css={{ marginRight: scale(2) }}
                            >
                                Отменить
                            </Form.Reset>
                            <Button type="submit"  theme="primary">
                                Сохранить
                            </Button>
                        </div>
                    </Form>
                </Popup> */}
            </>
        </PageWrapper>
    );
};

export default Catalog;
