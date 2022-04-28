import Tooltip, { ContentBtn } from "@components/controls/Tooltip";
import { NodeField, NodeFieldProps } from "@components/NodeDetails/Field";
import { scale } from '@scripts/gds';
import { useEffect, useState } from "react";
import { followCursor } from "tippy.js";
import { Cell, CellProps } from "../Cell";
import { ExtendedColumn } from "../types";

export const getCopyableColumn = ({
    accessor,
    type,
    cellType,
    pasteToColumn,
    Header,
    ...other
}: {
    accessor: string;
    type: NodeFieldProps['type'];
    cellType: CellProps['type'];
    pasteToColumn: (accessor: string, val: any) => void;
} & Omit<ExtendedColumn, 'accessor'>): ExtendedColumn => ({
    accessor,
    Header: (/* {  data, column } */) => {
        const [visible, setVisible] = useState(false);
        const [copyVal, setCopyVal] = useState('');

        const getTooltipContent = () => (
            <>
                <NodeField
                    name="copy-val"
                    type={type}
                    value={copyVal}
                    onChange={e => { setCopyVal(e.currentTarget.value) }}
                />
                <ul>
                    <li>
                        <ContentBtn
                            type="edit"
                            onClick={e => {
                                e.stopPropagation();

                                pasteToColumn(accessor, copyVal);

                                setVisible(false);
                            }}
                        >
                            Вставить
                        </ContentBtn>
                    </li>
                </ul>
            </>
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
            <>
                <Tooltip
                    content={getTooltipContent()}
                    plugins={[followCursor]}
                    followCursor="initial"
                    arrow
                    theme="light"
                    placement="bottom"
                    minWidth={scale(36)}
                    appendTo={() => document.body}
                    visible={visible}
                    onClickOutside={() => setVisible(false)}
                >
                    <button
                        type="button"
                        onContextMenu={e => {
                            console.log('set visible because of click');
                            e.preventDefault();
                            setVisible(true);
                        }}
                    >
                        {Header}
                    </button>
                </Tooltip>
            </>
        );
    },
    Cell: props => <Cell type={cellType} {...props} />,
    ...other,
});