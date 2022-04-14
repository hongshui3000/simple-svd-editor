import { MouseEvent, useState, useMemo, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button, scale, useTheme } from '@scripts/gds';
import { useLocalStorage, useMount } from '@scripts/hooks';

import SettingsIcon from '@icons/small/settings.svg';
import KebabIcon from '@icons/small/kebab.svg';
import DragIcon from '@icons/small/dragAndDrop.svg';

import Popup from '@components/controls/Popup';
import Checkbox from '@components/controls/Checkbox';
import Form from '@components/controls/Form';
import Tabs from '@components/controls/Tabs';

import { useFormikContext } from 'formik';
import { useRow } from '../RowContext';
import { COLUMNS_TO_IGNORE_DEFAULT } from '../constants';
import { ExtendedColumn } from '../types';

type getSettingsColumnProps = {
    /** Unique table name in case if there are more than one table on page */
    name?: string;
    /** Need to show settings button flag */
    hasSettingsBtn?: boolean;
    /** On settings click callback */
    onSettingsClick?: () => void;
    /** Columns to not show in popup. Array of column's ids */
    columnsToIgnore?: string[];
    /** Columns to disable switch off in popup. Array of column's ids */
    columnsToDisable?: string[];
    /** Columns to show in table */
    defaultVisibleColumns?: string[];
};

const ColumnOrderHelper = ({ setColumns }: { setColumns: (columns: string[]) => void }) => {
    const { values } = useFormikContext<Record<string, boolean>>();

    const columnsFromValues = useMemo(
        () =>
            Object.keys(values).reduce((acc, key) => {
                if (values[key] && !COLUMNS_TO_IGNORE_DEFAULT.includes(key)) {
                    acc.push(key);
                }
                return acc;
            }, [] as string[]),
        [values]
    );

    useEffect(() => {
        setColumns(columnsFromValues);
    }, [columnsFromValues, setColumns]);
    return null;
};

export const getSettingsColumn = ({
    name,
    hasSettingsBtn = true,
    onSettingsClick,
    columnsToIgnore = [],
    columnsToDisable = ['id', 'title'],
    defaultVisibleColumns,
}: getSettingsColumnProps = {}): ExtendedColumn => ({
    accessor: 'settings',
    // @ts-ignore
    Header: ({ allColumns, setHiddenColumns, setColumnOrder }) => {
        const { colors } = useTheme();
        const { pathname } = useRouter();
        const [isOpen, setIsOpen] = useState(false);
        const close = () => setIsOpen(false);

        const ignoredColumns = useMemo(() => [...columnsToIgnore, ...COLUMNS_TO_IGNORE_DEFAULT], []);

        const columnsToRender = useMemo(
            () => allColumns.filter(c => !ignoredColumns.includes(c.id)),
            [allColumns, ignoredColumns]
        );

        const defaultHiddenColumns = useMemo(
            () =>
                defaultVisibleColumns &&
                allColumns.reduce((acc, column) => {
                    const { id } = column;
                    if (
                        typeof id === 'string' &&
                        !defaultVisibleColumns.includes(id) &&
                        !COLUMNS_TO_IGNORE_DEFAULT.includes(id)
                    ) {
                        acc.push(id);
                    }
                    return acc;
                }, [] as string[]),
            [allColumns]
        );

        const [columnsToHide, setColumnsToHide] = useLocalStorage<string[]>(
            `${pathname}${`${name}-` || ''}'HiddenColumns`,
            []
        );

        // Set initial hidden columns if only default available
        const defaultSet = useRef(false);
        useEffect(() => {
            if (
                !defaultSet.current &&
                defaultHiddenColumns &&
                defaultHiddenColumns.length > 0 &&
                columnsToHide.length === 0
            ) {
                defaultSet.current = true;
                setHiddenColumns(defaultHiddenColumns);
            }
        }, [columnsToHide.length, defaultHiddenColumns, setColumnsToHide, setHiddenColumns]);

        // Set initial hidden columns if columnsToHide exists
        useMount(() => {
            if (columnsToHide.length > 0) setHiddenColumns(columnsToHide);
        });

        const [, setColumnOrderByUser] = useLocalStorage<string[]>(`${pathname}ColumnOrder`, []);

        const columnsObject = useMemo(
            () =>
                allColumns.reduce((acc, column) => {
                    acc[column.id] = column.render('Header') || column.id;
                    return acc;
                }, {} as Record<string, ReactNode>),
            [allColumns]
        );

        const [columns, setColumns] = useState<string[]>([]);

        /** react beautiful dnd callbacks */
        const reorderItems = useCallback(
            (startIndex: number, endIndex: number) => {
                const newColumnOrder = columns.slice();
                const [movedItem] = newColumnOrder.splice(startIndex, 1);
                newColumnOrder.splice(endIndex, 0, movedItem);
                setColumns(newColumnOrder);
            },
            [columns]
        );

        const onDragEnd = useCallback(
            ({ source, destination }: DropResult) => {
                if (
                    !destination ||
                    (destination.index === source.index && destination.droppableId === source.droppableId)
                )
                    return;
                reorderItems(source.index, destination.index);
            },
            [reorderItems]
        );

        return hasSettingsBtn ? (
            <>
                <Button
                    type="button"
                    theme="ghost"
                    hidden
                    size="sm"
                    Icon={SettingsIcon}
                    onClick={() => {
                        if (onSettingsClick) onSettingsClick();
                        setIsOpen(true);
                    }}
                    css={{
                        background: 'inherit !important',
                        paddingTop: '0 !important',
                        paddingBottom: '0 !important',
                    }}
                >
                    Управлять количеством столбцов
                </Button>
                <Popup isOpen={isOpen} onRequestClose={close} rightHanded title="Настройка столбцов" scrollInside>
                    <Form
                        initialValues={allColumns.reduce((acc, column) => {
                            acc[column.id] = column.isVisible;
                            return acc;
                        }, {} as Record<string, boolean>)}
                        onSubmit={vals => {
                            const hiddenColumns = Object.keys(vals).filter(k => !vals[k]);
                            setHiddenColumns(hiddenColumns);
                            setColumnsToHide(hiddenColumns);
                            if (setColumnOrder) setColumnOrder(columns);
                            setColumnOrderByUser(columns);
                            close();
                        }}
                        css={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                        <Popup.Body>
                            <Tabs>
                                <Tabs.List>
                                    <Tabs.Tab>Показывать</Tabs.Tab>
                                    <Tabs.Tab>Сортировать</Tabs.Tab>
                                </Tabs.List>
                                <Tabs.Panel>
                                    <ul
                                        css={{
                                            li: { ':not(:last-of-type)': { marginBottom: scale(2) } },
                                        }}
                                    >
                                        {columnsToRender.map(column => (
                                            <li key={column.id}>
                                                <Form.FastField name={column.id}>
                                                    <Checkbox disabled={columnsToDisable.includes(column.id)}>
                                                        {column.render('Header')}
                                                    </Checkbox>
                                                </Form.FastField>
                                            </li>
                                        ))}
                                    </ul>
                                </Tabs.Panel>
                                <Tabs.Panel>
                                    <ColumnOrderHelper setColumns={setColumns} />
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="column-order">
                                            {droppableprops => (
                                                <ul
                                                    ref={droppableprops.innerRef}
                                                    {...droppableprops.droppableProps}
                                                    css={{ position: 'relative' }}
                                                >
                                                    {columns.map((column, index) => (
                                                        <Draggable key={column} draggableId={column} index={index}>
                                                            {(provided, snapshot) => (
                                                                <li
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    css={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: scale(1),
                                                                        padding: `${scale(1)}px 0`,
                                                                        svg: { opacity: 0 },
                                                                        '&:hover': { svg: { opacity: 1 } },
                                                                        backgroundColor: colors?.white,
                                                                        left: `${scale(3)}px !important`,
                                                                        ...(snapshot.isDragging && {
                                                                            svg: { opacity: 1 },
                                                                        }),
                                                                    }}
                                                                >
                                                                    <DragIcon />
                                                                    {columnsObject[column]}
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    ))}

                                                    {droppableprops.placeholder}
                                                </ul>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </Tabs.Panel>
                            </Tabs>
                        </Popup.Body>
                        <Popup.Footer>
                            <Button theme="fill" block onClick={close} type="button">
                                Отменить
                            </Button>
                            <Button type="submit" block>
                                Сохранить
                            </Button>
                        </Popup.Footer>
                    </Form>
                </Popup>
            </>
        ) : null;
    },
    Cell: () => {
        const { visible, setVisible } = useRow();
        return (
            <Button
                type="button"
                theme="ghost"
                hidden
                size="sm"
                Icon={KebabIcon}
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    setVisible(!visible);
                }}
                onDoubleClick={(event: MouseEvent<HTMLButtonElement>) => event.stopPropagation()}
                css={{ ':hover': { background: 'inherit !important' } }}
            >
                Вызвать контекстное меню
            </Button>
        );
    },
    disableSortBy: true,
});
