import { useLocalStorage } from '@scripts/hooks';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo } from 'react';
import {
    useTable,
    useRowSelect,
    useExpanded,
    PluginHook,
    useSortBy,
    useColumnOrder,
} from 'react-table';
import { RowProvider } from './RowContext';
import { TableRow } from './TableRow';
import {
    TableProps,
    ExtendedUseTableInstanceProps,
    ExtendedHeaderGroup,
    ExtendedRow,
    ExtendedTableOptions,
    Data,
} from './types';
import { StyledHeadCell, SortingIcon } from './utils';

/** api принимает строку в случае ascending и строку с минусом в случае descending  */
const getSortedId = (columnId: string | undefined, desc?: boolean) =>
    columnId ? `${desc ? '-' : ''}${columnId}` : undefined;

const isDescSort = (columnId: string) => /^-/.test(columnId);

const Table: FC<TableProps> = ({
    columns,
    data,
    className,
    children,
    onRowClick,
    onRowContextMenu,
    onDoubleClick,
    tooltipContent = [],
    allowRowSelect = true,
    expandable = false,
    disableSortBy = false,
    allowColumnOrder = true,
    onSortingChange,
    renderHeader,
    initialSortBy,
}) => {
    const { pathname } = useRouter();
    const plugins: PluginHook<Data>[] = useMemo(() => {
        const pluginsToUse = [];
        if (!disableSortBy) pluginsToUse.push(useSortBy);
        if (expandable) pluginsToUse.push(useExpanded);
        if (allowRowSelect) pluginsToUse.push(useRowSelect);
        if (allowColumnOrder) pluginsToUse.push(useColumnOrder);
        return pluginsToUse;
    }, [disableSortBy, expandable, allowRowSelect, allowColumnOrder]);

    const [columnOrderByUser] = useLocalStorage<string[]>(`${pathname}ColumnOrder`, []);

    const options: ExtendedTableOptions = useMemo(
        () => ({
            columns,
            data,
            disableMultiSort: true,
            autoResetSortBy: false,
            manualSortBy: true,
            disableSortBy,
            initialState: { columnOrder: columnOrderByUser },
        }),
        [columnOrderByUser, columns, data, disableSortBy]
    );

    const tableInstance = useTable(options, ...plugins);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { sortBy, selectedRowIds },
        setSortBy,
    } = tableInstance as any as ExtendedUseTableInstanceProps;

    const selectedRows = useMemo(() => {
        if (selectedRowIds) {
            const ids = Object.keys(selectedRowIds);
            const selectedRowsArray: Data[] = [];
            ids.forEach(i => {
                selectedRowsArray.push(data[+i]);
            });
            return selectedRowsArray;
        }
        return [];
    }, [data, selectedRowIds]);

    const sorted = sortBy && sortBy[0];

    // Set  sorting arrow in column header if needed
    useEffect(() => {
        if (initialSortBy)
            setSortBy([{ id: initialSortBy, desc: isDescSort(initialSortBy) }]);
    }, [initialSortBy, setSortBy]);

    // on sorting change callback calling
    useEffect(() => {
        if (onSortingChange) onSortingChange(getSortedId(sorted?.id, sorted?.desc));
    }, [sorted?.id, sorted?.desc, onSortingChange]);

    return (
        <>
            {renderHeader && renderHeader(selectedRows)}
            <div css={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                <div css={{ width: '100%', overflow: 'auto' }} className={className}>
                    <table
                        {...getTableProps()}
                        css={{
                            position: 'relative',
                            width: '100%',
                            borderSpacing: 0,
                            borderCollapse: 'collapse',
                            tableLayout: 'auto',
                        }}
                    >
                        {children}

                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(
                                        (column: ExtendedHeaderGroup) => (
                                            <StyledHeadCell
                                                {...column.getHeaderProps({
                                                    ...(column?.getSortByToggleProps &&
                                                        column?.getSortByToggleProps()),
                                                })}
                                                key={column.id}
                                            >
                                                {column.render('Header')}
                                                {column?.isSorted && (
                                                    <SortingIcon
                                                        isSortedDesc={
                                                            column?.isSortedDesc
                                                        }
                                                    />
                                                )}
                                            </StyledHeadCell>
                                        )
                                    )}
                                </tr>
                            ))}
                        </thead>

                        <tbody {...getTableBodyProps()}>
                            {rows.map((row: ExtendedRow) => {
                                prepareRow(row);
                                return (
                                    <RowProvider key={row.original.id}>
                                        <TableRow
                                            tooltipContent={tooltipContent}
                                            onRowClick={onRowClick}
                                            onRowContextMenu={onRowContextMenu}
                                            onDoubleClick={onDoubleClick}
                                            row={row}
                                        />
                                    </RowProvider>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Table;
