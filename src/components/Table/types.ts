import { ContentBtnProps } from '@components/controls/Tooltip';
import { ReactNode } from 'react';
import {
    Row,
    HeaderGroup,
    TableHeaderProps,
    UseTableInstanceProps,
    TableState,
    Column,
    TableOptions,
} from 'react-table';

export type Data = Record<string, any> & { id: string | number; string?: string };

export type ExtendedColumn = Column<Data> & {
    disableSortBy?: boolean;
};

export type ExtendedTableOptions = TableOptions<Data> & {
    disableMultiSort?: boolean;
    autoResetSortBy?: boolean;
    manualSortBy?: boolean;
    disableSortBy?: boolean;
};
export type ExtendedHeaderGroup = HeaderGroup<Data> & {
    isSorted?: boolean;
    isSortedDesc?: boolean;
    getSortByToggleProps?: () => Partial<TableHeaderProps>;
};

export type ExtendedRow = Row<Data> & {
    isSelected?: boolean;
    toggleRowSelected?: () => void;
    getToggleRowSelectedProps?: () => void;
    depth?: number;
    canExpand?: boolean;
    toggleRowExpanded?: () => void;
    isExpanded?: boolean;
};

export type ExtendedTableState = TableState<Data> & {
    selectedRowIds: Record<string, boolean>;
    sortBy: { id: string; desc: boolean }[];
};
export type ExtendedUseTableInstanceProps = UseTableInstanceProps<Data> & {
    state: ExtendedTableState;
    selectedFlatRows: ExtendedRow[];
    setSortBy: (sortBy: { id: string; desc: boolean }[]) => void;
};

export type TooltipContentProps = {
    text: string;
    type: ContentBtnProps['type'];
    action: (originalRow: ExtendedRow['original'] | ExtendedRow['original'][]) => void;
};

export type TableProps = {
    columns: Column<Data>[];
    data: Data[];
    /** On double row click */
    onDoubleClick?: (originalRow: Data | undefined) => void;
    /** On row right mouse button click */
    onRowContextMenu?: (originalRow: Data | undefined) => void;
    /** on row click handler */
    onRowClick?: (originalRow: Data | undefined) => void;
    /** Class name */
    className?: string;
    /** Tooltip content array */
    tooltipContent?: TooltipContentProps[];
    /** Has sub rows */
    expandable?: boolean;
    /** Allow row selection */
    allowRowSelect?: boolean;
    /** Disable all columns sorting */
    disableSortBy?: boolean;
    /** On sorting change callback */
    onSortingChange?: (sortBy: string | undefined) => void;
    /** Render prop for header */
    renderHeader?: (selectedRows: Data[]) => ReactNode;
    /** Column id for initial sorting */
    initialSortBy?: string;
    /** Default visible columns. Array of column id's */
    defaultVisibleColumns?: string[];
    /** Allow column order */
    allowColumnOrder?: boolean;
};

export type TableRowProps = {
    row: ExtendedRow;
    tooltipContent: TooltipContentProps[];
} & Pick<TableProps, 'onRowClick' | 'onDoubleClick' | 'onRowContextMenu'>;
