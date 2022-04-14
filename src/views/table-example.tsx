import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { useTheme, scale, Button, Layout, typography } from '@scripts/gds';
import { getNubmerId, getRandomItem } from '@scripts/mock';
import { useFiltersHelper } from '@scripts/hooks';

import BasicField from '@components/controls/Form/BasicField';
import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';
import CalendarInput from '@components/controls/CalendarInput';
import PageWrapper from '@components/PageWrapper';
import Table, {
    Data,
    getSelectColumn,
    getSettingsColumn,
    Cell,
    TooltipContentProps,
    ExtendedColumn,
    TableHeader,
    TableFooter,
    TableEmpty,
} from '@components/Table';
import Tooltip, { hideOnEsc, ContentBtn } from '@components/controls/Tooltip';

import FilterIcon from '@icons/small/sliders.svg';
import FilterActiveIcon from '@icons/filter-active.svg';
import ResetIcon from '@icons/small/reset.svg';
import PlusIcon from '@icons/small/plus.svg';
import SearchIcon from '@icons/small/search.svg';
import KebabIcon from '@icons/small/kebab.svg';

const getTableItem = () => ({
    id: getNubmerId(),
    photo: '',
    titleAndCode: getRandomItem([
        ['Наушники QCY, белые', 172957172, 721183],
        ['Беспроводные наушники Apple  Airpods Pro белый', 172957172, 721183],
    ]),
    brand: getRandomItem(['Apple', 'Xiaomi', 'Sumsung', 'Huawei']),
    category: 'Беспроводные наушники',
    status: getRandomItem([
        { name: 'Проверен (опубликован)', value: 1 },
        { name: 'Требует дозаполнения', value: 2 },
        { name: 'Отклонено', value: 3 },
    ]),
    features: [
        getRandomItem(['На модерации', 'Наполнение мастер-данными']),
        getRandomItem(['На производстве контента', '']),
    ],
    created_at: new Date(Date.now() - 60 * 60 * 24 * getRandomItem([1, 2, 3, 4])),
    updated_at: new Date(),
});

function makeRandomData<T>(len: number, cb: (index: number) => T) {
    return [...Array(len).keys()].map(el => cb(el));
}

const columns: ExtendedColumn[] = [
    getSelectColumn(),
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: '',
        accessor: 'photo',
        Cell: props => <Cell type="photo" {...props} />,
        disableSortBy: true,
    },
    {
        Header: 'Название, артикул',
        accessor: 'titleAndCode',
        Cell: ({ value }: { value: string[] }) => {
            const { colors } = useTheme();
            return value.map((item, i) => (
                <p css={i !== 0 && { color: colors?.grey800 }} key={item}>
                    {i === 1 && 'Артикул: '}
                    {i === 2 && 'Штрихкод: '}
                    {item}
                </p>
            ));
        },
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
        Header: 'Статус',
        accessor: 'status',
        Cell: ({ value }: { value: { value: number; name: string } }) => {
            const { colors } = useTheme();

            const getBgColor = (val: number) => {
                switch (val) {
                    case 1:
                        return colors?.success;
                    case 2:
                        return colors?.warning;
                    case 3:
                    default:
                        return colors?.danger;
                }
            };

            return (
                <p>
                    <span
                        css={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            marginRight: scale(1),
                            background: getBgColor(value.value),
                        }}
                    />
                    {value.name}
                </p>
            );
        },
    },
    {
        Header: 'Признаки',
        accessor: 'features',
        Cell: ({ value }) => <Cell type="array" value={value} />,
    },
    {
        Header: 'Создан',
        accessor: 'created_at',
        Cell: ({ value }) => <Cell type="date" value={value} />,
    },
    {
        Header: 'Изменен',
        accessor: 'updated_at',
        Cell: ({ value }) => <Cell type="date" value={value} />,
    },
    getSettingsColumn(),
];

const emptyInitialValues = {
    id: '',
    name: '',
    code: '',
    priceFrom: '',
    priceTo: '',
    date: null,
};

const tooltipAction = (rows: Data | Data[]) => {
    if (Array.isArray(rows)) {
        alert(`You want to make multi action with ${rows.length} selected row(s)`);
    } else {
        alert(`You want to make action with 1 row which id is ${rows.id}`);
    }
};

export default function ExamplePage() {
    const { push, pathname } = useRouter();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [itemsPerPageCount, setItemsPerPageCount] = useState(10);

    const resetFilters = useCallback(() => {
        push(pathname);
    }, [pathname, push]);
    const data = useMemo<Data[]>(() => makeRandomData(itemsPerPageCount, getTableItem), [itemsPerPageCount]);

    const closeFilters = useCallback(() => {
        setFiltersOpen(false);
    }, []);

    const { initialValues, URLHelper, filtersActive } = useFiltersHelper(emptyInitialValues);

    console.warn('You need initialValues to pass in react-query hook', typeof initialValues);

    const tooltipContent: TooltipContentProps[] = useMemo(
        () => [
            {
                type: 'edit',
                text: 'Изменить статус',
                action: tooltipAction,
            },
            {
                type: 'edit',
                text: 'Изменить атрибут',
                action: tooltipAction,
            },
            {
                type: 'edit',
                text: 'Изменить категоризацию',
                action: tooltipAction,
            },
            {
                type: 'edit',
                text: 'Задать признаки',
                action: tooltipAction,
            },
            {
                type: 'edit',
                text: 'Отправить на модерацию',
                action: tooltipAction,
            },
            {
                type: 'copy',
                text: 'Копировать ID',
                action: tooltipAction,
            },
            {
                type: 'copy',
                text: 'Копировать артикул',
                action: tooltipAction,
            },
            {
                type: 'export',
                text: 'Экспорт товаров',
                action: tooltipAction,
            },
            {
                type: 'delete',
                text: 'Удалить',
                action: tooltipAction,
            },
        ],
        []
    );

    const renderHeader = useCallback(
        (selectedRows: Data[]) => {
            const count = selectedRows.length;
            const isSelected = count > 0;

            return (
                <TableHeader>
                    {isSelected ? (
                        <span css={typography('bodyMdBold')}>Выбрано {count}</span>
                    ) : (
                        <>
                            <span>Товаров {data.length} </span>
                            <BasicField
                                placeholder="Поиск по названию, артикулу или штрихкоду"
                                css={{ width: scale(42), marginLeft: scale(2) }}
                                Icon={SearchIcon}
                            />
                            <Button
                                theme="secondary"
                                Icon={filtersActive ? FilterActiveIcon : FilterIcon}
                                css={{ marginLeft: scale(2) }}
                                onClick={() => setFiltersOpen(true)}
                            >
                                Фильтры
                            </Button>
                            {filtersActive && (
                                <Button
                                    theme="fill"
                                    Icon={ResetIcon}
                                    css={{ marginLeft: scale(2) }}
                                    onClick={resetFilters}
                                >
                                    Сбросить
                                </Button>
                            )}
                        </>
                    )}
                    <Button theme="secondary" css={{ marginLeft: 'auto' }}>
                        Экспорт товаров
                    </Button>

                    {isSelected ? (
                        <Tooltip
                            content={
                                <>
                                    {tooltipContent.map(t => (
                                        <ContentBtn
                                            key={t.text}
                                            type={t.type}
                                            onClick={() => {
                                                t.action(selectedRows);
                                            }}
                                        >
                                            {t.text}
                                        </ContentBtn>
                                    ))}
                                </>
                            }
                            plugins={[hideOnEsc]}
                            trigger="click"
                            arrow
                            theme="light"
                            placement="bottom"
                            minWidth={scale(36)}
                            disabled={tooltipContent.length === 0}
                            appendTo={() => document.body}
                        >
                            <Button theme="outline" Icon={KebabIcon} css={{ marginLeft: scale(2) }} iconAfter>
                                Действия
                            </Button>
                        </Tooltip>
                    ) : (
                        <Button Icon={PlusIcon} css={{ marginLeft: scale(2) }}>
                            Добавить товар
                        </Button>
                    )}
                </TableHeader>
            );
        },
        [data.length, filtersActive, resetFilters, tooltipContent]
    );

    return (
        <PageWrapper title="Пример страницы с таблицей" css={{ padding: 0 }}>
            <>
                <p>Сортировка: {sort}</p>

                <Table
                    columns={columns}
                    data={data}
                    onSortingChange={setSort}
                    tooltipContent={tooltipContent}
                    onDoubleClick={originalRow => push(`table-example/${originalRow?.id}`)}
                    renderHeader={renderHeader}
                />

                {data.length === 0 ? (
                    <TableEmpty
                        filtersActive={filtersActive}
                        titleWithFilters="Товары не найдены"
                        titleWithoutFilters="Товаров нет"
                        addItems={() => setItemsPerPageCount(10)}
                        addItemsText="Добавьте товары"
                    />
                ) : (
                    <TableFooter
                        pages={7}
                        itemsPerPageCount={itemsPerPageCount}
                        setItemsPerPageCount={setItemsPerPageCount}
                    />
                )}

                <Popup title="Фильтры" rightHanded isOpen={filtersOpen} onRequestClose={closeFilters}>
                    <Form
                        onSubmit={vals => {
                            URLHelper(vals);
                            closeFilters();
                        }}
                        initialValues={initialValues}
                        css={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                        <Popup.Body>
                            <Layout cols={1} css={{ width: '100%' }}>
                                <Layout.Item col={1}>
                                    <Form.FastField name="name" label="Название" />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="code" label="Артикул" />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="id" label="ID" />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="priceFrom" label="Цена" type="number" />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.FastField name="date" label="Создан">
                                        <CalendarInput />
                                    </Form.FastField>
                                </Layout.Item>
                            </Layout>
                        </Popup.Body>
                        <Popup.Footer>
                            <Layout gap={scale(2)} cols={2}>
                                <Layout.Item col={1}>
                                    <Button
                                        theme="fill"
                                        block
                                        onClick={() => {
                                            push(pathname);
                                            closeFilters();
                                        }}
                                    >
                                        Сбросить
                                    </Button>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Button block type="submit">
                                        Показать
                                    </Button>
                                </Layout.Item>
                            </Layout>
                        </Popup.Footer>
                    </Form>
                </Popup>
            </>
        </PageWrapper>
    );
}

// You need this function to allow  filters work on first render
export async function getServerSideProps() {
    return {
        props: {},
    };
}
