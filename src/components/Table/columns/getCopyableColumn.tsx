import Form from "@components/controls/Form";
import Tooltip from "@components/controls/Tooltip";
import { NodeField, NodeFieldProps } from "@components/NodeDetails/Field";
import { Button, scale } from '@scripts/gds';
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

        const getTooltipContent = () => (
            <>
                <Form initialValues={{ copyVal: '' }} onSubmit={(vals) => {
                    pasteToColumn(accessor, vals.copyVal);

                    setVisible(false);
                }} css={{
                    padding: '0 8px',
                }}>
                    <NodeField
                        label="Клонируемое значение"
                        name="copyVal"
                        value=""
                        type={type}
                    />
                    <Button type="submit" css={{ marginTop: scale(2) }}>Вставить</Button>
                    {/* <ul>
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
                    </ul> */}
                </Form>
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