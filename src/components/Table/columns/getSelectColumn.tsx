
import { ExtendedRow, ExtendedColumn } from '../types';

import IndeterminateCheckbox from '../IndeterminateCheckbox';

export const getSelectColumn = (maxRowSelect = 0): ExtendedColumn => ({
    accessor: 'select',

    Header: ({ getToggleAllRowsSelectedProps }: { getToggleAllRowsSelectedProps: () => void }) =>
        maxRowSelect ? null : <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} id="header" />,

    Cell: ({ row, selectedFlatRows }: { row: ExtendedRow; selectedFlatRows?: ExtendedRow[] }) => {
        const disabled = maxRowSelect > 0 && selectedFlatRows?.length === maxRowSelect && !row.isSelected;

        return (
            <button type="button" onClick={e => e.stopPropagation()} css={{ display: 'grid', alignItems: 'center' }}>
                <IndeterminateCheckbox
                    {...(row?.getToggleRowSelectedProps && row.getToggleRowSelectedProps())}
                    id={row.id}
                    disabled={disabled}
                />
            </button>
        );
    },
    disableSortBy: true,
});
