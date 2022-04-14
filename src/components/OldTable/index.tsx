import { useEffect, useMemo, ReactElement, useCallback, ReactNode } from 'react';
import { scale, useTheme, Button, typography } from '@scripts/gds';
import {
    useTable,
    useSortBy,
    useRowSelect,
    Row,
    Cell as CellProps,
    ColumnInstance,
    HeaderGroup,
    TableHeaderProps,
    UseTableInstanceProps,
    TableState,
    useExpanded,
} from 'react-table';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { CSSObject } from '@emotion/core';
import ArrowDownIcon from '@icons/small/arrowDown.svg';
import ArrowUpIcon from '@icons/small/arrowUp.svg';
import EditIcon from '@icons/small/edit.svg';
import SettingsIcon from '@icons/small/settings.svg';
import TrashIcon from '@icons/small/trash.svg';
import PlusIcon from '@icons/small/plus.svg';
import MinusIcon from '@icons/small/minus.svg';
import DragIcon from '@icons/small/dragAndDrop.svg';
import { usePrevious } from '@scripts/hooks';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import Cell from './Cell';

export type TableColumnProps = {
    Header: string | (() => ReactElement);
    accessor: string;
};
export type TableRowProps = Record<string, any>;

export interface MoreHeaderGroupProps extends HeaderGroup<TableRowProps> {
    isSorted?: boolean;
    isSortedDesc?: boolean;
    getSortByToggleProps?: () => Partial<TableHeaderProps>;
}

export interface MoreRow extends Row<TableRowProps> {
    isSelected?: boolean;
    depth?: number;
}

export interface MoreColumnProps extends ColumnInstance<TableRowProps> {
    getProps?: () => {
        type: string;
        items: any[];
    };
    customRender?: boolean;
}

export interface MoreCellProps extends CellProps<TableRowProps, any> {
    column: MoreColumnProps;
}

interface extendedTableState extends TableState<TableRowProps> {
    selectedRowIds: Record<string, boolean>;
    expanded: Record<string, boolean>;
}
interface extendedUseTableInstanceProps extends UseTableInstanceProps<TableRowProps> {
    state: extendedTableState;
}

export interface expandableRowInfoProps {
    rowId: number;
    content: ReactNode;
}

export interface TableProps {
    columns: TableColumnProps[];
    data: Array<TableRowProps>;
    /** handle row info */
    editRow?: (originalRow: TableRowProps | undefined) => void;
    /** delete row */
    deleteRow?: (originalRow: TableRowProps | undefined) => void;
    /** On row select handler */
    onRowSelect?: (ids: number[]) => void;
    /** Need checkboxes column */
    needCheckboxesCol?: boolean;
    /** Need settings column */
    needSettingsColumn?: boolean;
    /** Has sub rows */
    expandable?: boolean;
    /** Need deleting column */
    needSettingsBtn?: boolean;
    /** Class name */
    className?: string;
    /** Breadcrumbs item content */
    children?: ReactElement;
    /** Header cell styles */
    headerCellCSS?: CSSObject;
    /** isDragDisabled */
    isDragDisabled?: boolean;
    /** if you need change incoming data */
    setData?: (data: any) => void;
    /** on row click handler */
    onRowClick?: (row: Record<string, any>) => void;
    /** if you need show additional row with expandable info */
    expandableRowInfo?: expandableRowInfoProps;
    /** max rows to select */
    maxSelectedRows?: number;
}

export const makeStringRow = (id: number, string: string) => ({ id, string });

const Table = ({
    columns,
    data,
    editRow,
    deleteRow,
    onRowSelect,
    needCheckboxesCol = true,
    needSettingsColumn = true,
    expandable = false,
    needSettingsBtn = true,
    className,
    children,
    headerCellCSS,
    isDragDisabled = true,
    setData,
    onRowClick,
    expandableRowInfo,
    maxSelectedRows,
}: TableProps) => {
    const { colors } = useTheme();
    const arrowStyle: CSSObject = {
        marginLeft: scale(1),
        marginBottom: -scale(1, true),
        fill: colors?.primary,
    };

    const tableInstanse = useTable(
        {
            columns,
            data,
        },
        useSortBy,
        useExpanded,
        useRowSelect,
        hooks => {
            if (needCheckboxesCol) {
                hooks.visibleColumns.push(columns => [
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }: { getToggleAllRowsSelectedProps: () => void }) =>
                            maxSelectedRows ? null : (
                                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} id="header" />
                            ),
                        Cell: ({
                            row,
                            rows,
                        }: {
                            row: {
                                getToggleRowSelectedProps: () => void;
                                original: { id: string };
                                isSelected: boolean;
                            };
                            rows: { isSelected: boolean }[];
                        }) => {
                            const selectedRowsCount = rows.filter(r => r.isSelected).length;
                            return (
                                <IndeterminateCheckbox
                                    {...row.getToggleRowSelectedProps()}
                                    id={row.original.id}
                                    disabled={
                                        maxSelectedRows && selectedRowsCount >= maxSelectedRows && !row.isSelected
                                    }
                                />
                            );
                        },
                    },
                    ...columns,
                ]);
            }
            if (expandable) {
                hooks.visibleColumns.push(columns => [
                    ...columns,
                    {
                        id: 'expander',
                        Header: ({
                            getToggleAllRowsExpandedProps,
                            isAllRowsExpanded,
                        }: {
                            getToggleAllRowsExpandedProps: () => void;
                            isAllRowsExpanded: boolean;
                        }) => (
                            <Button
                                hidden
                                Icon={isAllRowsExpanded ? MinusIcon : PlusIcon}
                                theme="ghost"
                                title={isAllRowsExpanded ? 'Скрыть все' : 'Раскрыть все'}
                                {...getToggleAllRowsExpandedProps()}
                            >
                                Toggle
                            </Button>
                        ),
                        Cell: ({
                            row,
                        }: {
                            row: { getToggleRowExpandedProps: () => void; canExpand: boolean; isExpanded: boolean };
                        }) =>
                            row.canExpand ? (
                                <Button
                                    hidden
                                    title={row.isExpanded ? 'Скрыть' : 'Раскрыть'}
                                    Icon={row.isExpanded ? MinusIcon : PlusIcon}
                                    theme="ghost"
                                    {...row.getToggleRowExpandedProps()}
                                >
                                    Toggle
                                </Button>
                            ) : null,
                    },
                ]);
            }
        }
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { selectedRowIds },
    } = tableInstanse as any as extendedUseTableInstanceProps;

    const selectedRowIdsArray = useMemo(
        () => (selectedRowIds ? Object.keys(selectedRowIds).map(Number) : []),
        [selectedRowIds]
    );
    const prevSelectedRow = usePrevious(selectedRowIdsArray);
    useEffect(() => {
        if (JSON.stringify(prevSelectedRow) !== JSON.stringify(selectedRowIdsArray)) {
            if (onRowSelect) onRowSelect(selectedRowIdsArray);
        }
    }, [onRowSelect, prevSelectedRow, selectedRowIdsArray]);

    const reorderTable = useCallback(
        (startIndex: number, endIndex: number) => {
            const newData = [...data];
            const [movedRow] = newData.splice(startIndex, 1);
            newData.splice(endIndex, 0, movedRow);
            if (setData) setData(newData);
        },
        [data, setData]
    );

    const onDragEnd = useCallback(
        ({ source, destination }: DropResult) => {
            if (!destination || destination.index === source.index) return;
            reorderTable(source.index, destination.index);
        },
        [reorderTable]
    );

    const childrenWidth: string[] = children?.props?.children?.map((c: ReactElement) => c.props.width);

    return (
        <div css={{ display: 'grid', gridTemplateColumns: '1fr' }}>
            <div css={{ width: '100%', overflow: 'auto' }} className={className}>
                <table
                    {...getTableProps()}
                    css={{
                        width: '100%',
                        borderSpacing: 0,
                        borderCollapse: 'collapse',
                        position: 'relative',
                    }}
                >
                    {children}

                    <thead>
                        {headerGroups.map((headerGroup, key) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={key}>
                                {isDragDisabled ? null : (
                                    <th
                                        css={{ padding: scale(1), borderBottom: `1px solid ${colors?.grey400}` }}
                                        key="drag"
                                    />
                                )}
                                {headerGroup.headers.map(
                                    (column: MoreHeaderGroupProps) =>
                                        column?.getSortByToggleProps && (
                                            <th
                                                {...column.getHeaderProps(column?.getSortByToggleProps())}
                                                css={{
                                                    ...typography('smallBold'),
                                                    padding: scale(1),
                                                    textAlign: 'left',
                                                    borderBottom: `1px solid ${colors?.grey400}`,
                                                    whiteSpace: 'nowrap',
                                                    verticalAlign: 'top',
                                                    ...headerCellCSS,
                                                    ...(needCheckboxesCol && {
                                                        '&:first-of-type': {
                                                            verticalAlign: 'top',
                                                        },
                                                    }),
                                                }}
                                                key={column.id}
                                            >
                                                {column.render('Header')}
                                                {column.isSorted && column.isSortedDesc && (
                                                    <ArrowDownIcon css={arrowStyle} />
                                                )}
                                                {column.isSorted && !column.isSortedDesc && (
                                                    <ArrowUpIcon css={arrowStyle} />
                                                )}
                                            </th>
                                        )
                                )}
                                {needSettingsColumn && (
                                    <th
                                        css={{
                                            ...typography('smallBold'),
                                            padding: scale(1),
                                            textAlign: 'left',
                                            borderBottom: `1px solid ${colors?.grey400}`,
                                            whiteSpace: 'nowrap',
                                        }}
                                        key="new"
                                    >
                                        {needSettingsBtn ? (
                                            <Button theme="ghost" hidden Icon={SettingsIcon}>
                                                Настройки
                                            </Button>
                                        ) : (
                                            ''
                                        )}
                                    </th>
                                )}
                            </tr>
                        ))}
                    </thead>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable-table-id">
                            {provided => (
                                <tbody {...getTableBodyProps()} ref={provided.innerRef} {...provided.droppableProps}>
                                    {rows.map((row: MoreRow, i) => {
                                        prepareRow(row);
                                        const textRow = Object.keys(row.original).length === 2 && row.original?.string;
                                        return (
                                            <Draggable
                                                draggableId={row.original.id?.toString()}
                                                key={row.original.id}
                                                index={i}
                                                isDragDisabled={isDragDisabled}
                                            >
                                                {(draggableProvided, snapshot) => (
                                                    <>
                                                        <tr
                                                            {...row.getRowProps()}
                                                            key={i}
                                                            css={{
                                                                borderBottom: `1px solid ${colors?.grey400}`,
                                                                '&:last-child': {
                                                                    border: 'none',
                                                                },
                                                                backgroundColor: colors?.white,
                                                                ...(onRowClick && { cursor: 'pointer' }),
                                                                ...(snapshot.isDragging ? { display: 'flex' } : {}),
                                                            }}
                                                            ref={draggableProvided.innerRef}
                                                            {...draggableProvided.dragHandleProps}
                                                            {...draggableProvided.draggableProps}
                                                            onClick={() => {
                                                                if (onRowClick) onRowClick(row.original);
                                                            }}
                                                        >
                                                            {isDragDisabled ? null : (
                                                                <th css={{ padding: scale(1) }} key={`drag-${row.id}`}>
                                                                    <Button
                                                                        theme="ghost"
                                                                        Icon={DragIcon}
                                                                        hidden
                                                                        css={{ '&:hover': { cursor: 'grab' } }}
                                                                    >
                                                                        Драг
                                                                    </Button>
                                                                </th>
                                                            )}
                                                            {textRow ? (
                                                                <td
                                                                    css={{
                                                                        verticalAlign: 'top',
                                                                        padding: scale(1),
                                                                        ...typography('bodySm'),
                                                                        ...(childrenWidth
                                                                            ? { width: childrenWidth[0] }
                                                                            : {}),
                                                                    }}
                                                                    colSpan={
                                                                        row.allCells.length + Number(needSettingsColumn)
                                                                    }
                                                                    key={`1-${row.id}`}
                                                                >
                                                                    <p>
                                                                        <strong>{row.original.string}</strong>
                                                                    </p>
                                                                </td>
                                                            ) : (
                                                                row.cells.map((cell: MoreCellProps, index) => {
                                                                    const props =
                                                                        cell.column?.getProps && cell.column.getProps();
                                                                    const type = props && props.type;

                                                                    return (
                                                                        <td
                                                                            css={{
                                                                                verticalAlign: 'top',
                                                                                padding: scale(1),
                                                                                ...typography('bodySm'),
                                                                                ...(childrenWidth
                                                                                    ? { width: childrenWidth[index] }
                                                                                    : {}),
                                                                                ...(row.depth &&
                                                                                    row.depth > 0 && {
                                                                                        '&:first-of-type': {
                                                                                            paddingLeft: scale(
                                                                                                row.depth * 3
                                                                                            ),
                                                                                        },
                                                                                    }),
                                                                            }}
                                                                            {...cell.getCellProps()}
                                                                            key={`${cell.column.id}-${cell.row.id}`}
                                                                        >
                                                                            {cell.column.id === 'selection' ||
                                                                            cell.column.id === 'expander' ||
                                                                            cell.column.customRender ? (
                                                                                cell.render('Cell')
                                                                            ) : (
                                                                                /** лучше пользуйся пропом customRender и определяй ф-цию в Cell в columns */
                                                                                <Cell text={cell?.value} type={type} />
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })
                                                            )}
                                                            {needSettingsColumn && !textRow && (
                                                                <td
                                                                    css={{
                                                                        padding: scale(1),
                                                                        verticalAlign: 'top',
                                                                        ...(childrenWidth
                                                                            ? {
                                                                                  width: childrenWidth[
                                                                                      childrenWidth.length - 1
                                                                                  ],
                                                                              }
                                                                            : {}),
                                                                    }}
                                                                >
                                                                    {editRow && (
                                                                        <Button
                                                                            onClick={() => editRow(row?.original)}
                                                                            aria-label="Редактировать"
                                                                            Icon={EditIcon}
                                                                            hidden
                                                                            theme="ghost"
                                                                        >
                                                                            Редактировать
                                                                        </Button>
                                                                    )}
                                                                    {deleteRow && (
                                                                        <Button
                                                                            onClick={() => deleteRow(row?.original)}
                                                                            aria-label="Удалить"
                                                                            Icon={TrashIcon}
                                                                            hidden
                                                                            theme="ghost"
                                                                        >
                                                                            Удалить
                                                                        </Button>
                                                                    )}
                                                                </td>
                                                            )}
                                                        </tr>

                                                        {expandableRowInfo &&
                                                            expandableRowInfo.rowId === row.original.id && (
                                                                <tr key={`${i}-additionalInfo`}>
                                                                    <td
                                                                        colSpan={
                                                                            row.allCells.length +
                                                                            Number(needSettingsColumn)
                                                                        }
                                                                    >
                                                                        {expandableRowInfo.content}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                    </>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </tbody>
                            )}
                        </Droppable>
                    </DragDropContext>
                </table>
            </div>
        </div>
    );
};

export default Table;
