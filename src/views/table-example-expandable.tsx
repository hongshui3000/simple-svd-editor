import PageWrapper from '@components/PageWrapper';
import { useMemo, MouseEvent } from 'react';
import { Column } from 'react-table';
import Table, {
    Data,
    getSelectColumn,
    getSettingsColumn,
    Cell,
    TooltipContentProps,
    ExtendedRow,
} from '@components/Table';
import { getNubmerId } from '@scripts/mock';
import { endOfYesterday, startOfDay } from 'date-fns';
import { Button, colors, scale } from '@scripts/gds';
import ChevronDownIcon from '@icons/small/chevronDown.svg';

const categories = [
    {
        id: getNubmerId(),
        title: 'Мужчины',
        code: 'Man',
        created_at: endOfYesterday(),
        updated_at: new Date(),
        status: 'Активный',
        subRows: [
            {
                id: getNubmerId(),
                title: 'Штаны',
                code: 'shtani',
                created_at: endOfYesterday(),
                updated_at: new Date(),
                status: 'Активный',
                subRows: [
                    {
                        id: getNubmerId(),
                        title: 'Спортивные',
                        code: 'Sport',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                    {
                        id: getNubmerId(),
                        title: 'Брюки',
                        code: 'Bruki',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                    {
                        id: getNubmerId(),
                        title: 'Джоггеры',
                        code: 'Joggeri',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                    {
                        id: getNubmerId(),
                        title: 'Джинсы',
                        code: 'Joggeri',
                        created_at: startOfDay(new Date()),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                ],
            },
            {
                id: getNubmerId(),
                title: 'Футболки',
                code: 'Footbolki',
                created_at: endOfYesterday(),
                updated_at: new Date(),
                status: 'Активный',
                subRows: [
                    {
                        id: getNubmerId(),
                        title: 'Безрукавки',
                        code: 'Bezrukavki',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                    {
                        id: getNubmerId(),
                        title: 'Поло',
                        code: 'Polo',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                ],
            },
        ],
    },
    {
        id: getNubmerId(),
        title: 'Женщины',
        code: 'Woman',
        created_at: endOfYesterday(),
        updated_at: new Date(),
        status: 'Активный',
        subRows: [
            {
                id: getNubmerId(),
                title: 'Штаны',
                code: 'shtani',
                created_at: endOfYesterday(),
                updated_at: new Date(),
                status: 'Активный',
                subRows: [
                    {
                        id: getNubmerId(),
                        title: 'Спортивные',
                        code: 'Sport',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                    {
                        id: getNubmerId(),
                        title: 'Брюки',
                        code: 'Bruki',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                    {
                        id: getNubmerId(),
                        title: 'Джоггеры',
                        code: 'Joggeri',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                    {
                        id: getNubmerId(),
                        title: 'Джинсы',
                        code: 'Joggeri',
                        created_at: startOfDay(new Date()),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                ],
            },
            {
                id: getNubmerId(),
                title: 'Футболки',
                code: 'Footbolki',
                created_at: endOfYesterday(),
                updated_at: new Date(),
                status: 'Активный',
                subRows: [
                    {
                        id: getNubmerId(),
                        title: 'Безрукавки',
                        code: 'Bezrukavki',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                    {
                        id: getNubmerId(),
                        title: 'Поло',
                        code: 'Polo',
                        created_at: endOfYesterday(),
                        updated_at: new Date(),
                        status: 'Активный',
                    },
                ],
            },
        ],
    },
];

const columns: Column<Data>[] = [
    getSelectColumn(),
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Названиe',
        accessor: 'title',
        Cell: ({ value, row }: { value: string; row: ExtendedRow }) => (
            <p css={{ paddingLeft: (row?.depth || 0) * scale(4) + (row?.canExpand ? 0 : scale(4)) }}>
                {row?.canExpand && row.toggleRowExpanded && (
                    <Button
                        theme="ghost"
                        Icon={ChevronDownIcon}
                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            if (row.toggleRowExpanded) {
                                e.stopPropagation();
                                row.toggleRowExpanded();
                            }
                        }}
                        hidden
                        css={{
                            ':hover': {
                                background: 'transparent !important',
                            },
                            svg: {
                                transition: 'transform 0.2s ease',
                                ...(row?.isExpanded && { transform: 'rotate(-180deg)' }),
                            },
                        }}
                    >
                        Развернуть/свернуть ряд
                    </Button>
                )}
                {value}
            </p>
        ),
    },
    {
        Header: 'Код',
        accessor: 'code',
    },
    {
        Header: 'Создано',
        accessor: 'created_at',
        Cell: ({ value }) => <Cell value={value} type="datetime" />,
    },
    {
        Header: 'Обновлено',
        accessor: 'updated_at',
        Cell: ({ value }) => <Cell value={value} type="datetime" />,
    },
    {
        Header: 'Статус',
        accessor: 'status',
        Cell: ({ value }) => (
            <p>
                <span
                    css={{
                        width: 6,
                        height: 6,
                        background: colors.success,
                        borderRadius: '50%',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginRight: scale(1),
                    }}
                />
                {value}
            </p>
        ),
    },
    getSettingsColumn(),
];

const tooltipAction = (rows: Data | Data[]) => {
    if (Array.isArray(rows)) {
        alert(`You want to make multi action with ${rows.length} selected row(s)`);
    } else {
        alert(`You want to make action with 1 row which id is ${rows.id}`);
    }
};

export default function Home() {
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

    return (
        <PageWrapper title="Пример страницы с таблицей" css={{ padding: 0 }}>
            <Table expandable columns={columns} data={categories} tooltipContent={tooltipContent} />
        </PageWrapper>
    );
}
