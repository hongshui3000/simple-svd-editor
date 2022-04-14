import { FC, useEffect } from 'react';
import { followCursor } from 'tippy.js';

import Tooltip, { ContentBtn } from '@components/controls/Tooltip';

import { scale } from '@scripts/gds';

import { TableRowProps } from './types';
import { StyledCell, StyledRow } from './utils';
import { useRow } from './RowContext';

export const TableRow: FC<TableRowProps> = ({ row, onRowClick, tooltipContent, onDoubleClick, onRowContextMenu }) => {
    const { visible, setVisible } = useRow();

    const getTooltipContent = () => (
        <ul>
            {tooltipContent.map(t => (
                <li key={t.text}>
                    <ContentBtn
                        type={t.type}
                        onClick={e => {
                            e.stopPropagation();
                            t.action(row.original);
                            setVisible(false);
                        }}
                    >
                        {t.text}
                    </ContentBtn>
                </li>
            ))}
        </ul>
    );

    useEffect(() => {
        const callback = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setVisible(false);
        };
        if (visible) {
            document.addEventListener('keydown', callback);
        }
        return () => {
            document.removeEventListener('keydown', callback);
        };
    }, [setVisible, visible]);

    return (
        <Tooltip
            content={getTooltipContent()}
            plugins={[followCursor]}
            followCursor="initial"
            arrow
            theme="light"
            placement="bottom"
            minWidth={scale(36)}
            disabled={tooltipContent.length === 0}
            appendTo={() => document.body}
            visible={visible}
            onClickOutside={() => setVisible(false)}
        >
            <StyledRow
                {...row.getRowProps()}
                key={`row-id-${row.original.id}`}
                onClick={() => {
                    if (onRowClick) onRowClick(row.original);
                }}
                onDoubleClick={() => {
                    if (onDoubleClick) onDoubleClick(row.original);
                }}
                onContextMenu={e => {
                    e.preventDefault();
                    setVisible(true);
                    if (onRowContextMenu) onRowContextMenu(row.original);
                }}
            >
                {row.cells.map(cell => (
                    <StyledCell {...cell.getCellProps()} key={`${cell.column.id}/${cell.row.id}`}>
                        {cell.render('Cell')}
                    </StyledCell>
                ))}
            </StyledRow>
        </Tooltip>
    );
};
