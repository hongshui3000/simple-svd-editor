import { useState, useMemo, FC, useCallback, useEffect } from 'react';
import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { Meta, MetaField } from '@api/common/types';
import { apiClient } from '@api/index';

import { Button, scale, Layout, useTheme } from '@scripts/gds';

import FilterIcon from '@icons/small/sliders.svg';
import ResetIcon from '@icons/small/reset.svg';
import DragIcon from '@icons/small/dragAndDrop.svg';

import Block from '@components/Block';
import MultiSelect from '@components/controls/MultiSelect';
import Select from '@components/controls/Select';
import CalendarRange from '@components/controls/CalendarRange';
import Form from '@components/controls/Form';
import Autocomplete from '@components/controls/Autocomplete';
import AutocompleteMulti from '@components/controls/AutocompleteMulti';
import CalendarInput from '@components/controls/CalendarInput';
import Popup from '@components/controls/Popup';
import Mask from '@components/controls/Mask';
import Tabs from '@components/controls/Tabs';
import { maskPhone } from '@scripts/mask';
import Checkbox from '@components/controls/Checkbox';

import { useLocalStorage, useMedia } from '@scripts/hooks';

import { FilterOrderHelper } from './FilterOrderHelper';

interface AutoFiltersTypes {
    initialValues: FormikValues;
    emptyInitialValues: FormikValues;
    onSubmit: (values: FormikValues) => void;
    filtersActive?: boolean;
    className?: string;
    meta: Meta | undefined;
}

const booleanOptions = [
    { label: '', value: '' },
    { label: 'Нет', value: '0' },
    { label: 'Да', value: '1' },
];

const AutoFilters: FC<AutoFiltersTypes> = ({
    initialValues,
    emptyInitialValues,
    onSubmit,
    filtersActive,
    className,
    meta,
}) => {
    const { colors } = useTheme();
    const { md, xxl, xl } = useMedia();
    const { push, pathname } = useRouter();

    const [filtersOpen, setFiltersOpen] = useState(false);
    const closeFilters = useCallback(() => setFiltersOpen(false), []);

    const filters = useMemo(() => meta?.fields.filter(f => f.filter), [meta?.fields]);
    const filtersObject = useMemo(
        () =>
            filters?.reduce((acc, filter) => {
                acc[filter.code] = filter.name;
                return acc;
            }, {} as Record<string, string>) || {},
        [filters]
    );

    const [filtersSettings, setFiltersSettings] = useLocalStorage<string[]>(`${pathname}FilterSettings`, []);

    useEffect(() => {
        if (filtersSettings.length === 0 && meta?.default_filter) setFiltersSettings(meta?.default_filter);
    }, [meta?.default_filter, filtersSettings, setFiltersSettings]);

    const filtersToShow = useMemo(
        () =>
            filtersSettings.reduce((acc, settingName) => {
                const findedFilter = filters?.find(f => f.code === settingName);
                if (findedFilter) acc.push(findedFilter);
                return acc;
            }, [] as MetaField[]),
        [filters, filtersSettings]
    );

    const [filterOrder, setFilterOrder] = useState<string[]>(filtersSettings);

    /** react beautiful dnd callbacks */
    const reorderItems = useCallback(
        (startIndex: number, endIndex: number) => {
            const newFiltersOrder = filterOrder.slice();
            const [movedItem] = newFiltersOrder.splice(startIndex, 1);
            newFiltersOrder.splice(endIndex, 0, movedItem);
            setFilterOrder(newFiltersOrder);
        },
        [filterOrder]
    );

    const onDragEnd = useCallback(
        ({ source, destination }: DropResult) => {
            if (!destination || (destination.index === source.index && destination.droppableId === source.droppableId))
                return;
            reorderItems(source.index, destination.index);
        },
        [reorderItems]
    );

    return (
        <>
            <Block className={className}>
                <Form initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
                    <Block.Body css={{ borderRadius: 0 }}>
                        <Layout cols={{ xxxl: 4, md: 3, sm: 2, xs: 1 }}>
                            {filtersToShow?.map(f => {
                                const {
                                    type,
                                    code,
                                    name,
                                    enum_info,
                                    filter_key,
                                    filter,
                                    filter_range_key_from,
                                    filter_range_key_to,
                                } = f;

                                if (!filtersSettings.includes(code)) return null;

                                const fieldName = filter_key || code;

                                const items = enum_info?.values?.map(i => ({
                                    label: i.title,
                                    value: i.id,
                                }));

                                const searchAsyncFunc = async (query: string) => {
                                    try {
                                        const res = await apiClient.post(enum_info.endpoint.split('v1/')[1], {
                                            data: { filter: { query } },
                                        });
                                        return res.data.map((i: { title: string; id: string }) => ({
                                            label: i.title,
                                            value: i.id,
                                        }));
                                    } catch {
                                        return [];
                                    }
                                };

                                if (filter === 'range') {
                                    if (['date', 'datetime'].includes(type)) {
                                        return (
                                            <Layout.Item col={1} key={code} align="end">
                                                <CalendarRange
                                                    nameFrom={filter_range_key_from}
                                                    nameTo={filter_range_key_to}
                                                    label={name}
                                                />
                                            </Layout.Item>
                                        );
                                    }
                                    return (
                                        <Layout.Item col={1} key={code} align="end">
                                            <Layout cols={{ xxxl: 2, xxs: 1 }}>
                                                <Layout.Item col={1}>
                                                    <Form.FastField
                                                        label={name}
                                                        type="number"
                                                        name={filter_range_key_from}
                                                        placeholder="От"
                                                    />
                                                </Layout.Item>
                                                <Layout.Item
                                                    col={1}
                                                    css={{
                                                        position: 'relative',
                                                        '&::before': {
                                                            content: "'–'",
                                                            position: 'absolute',
                                                            left: -15,
                                                            bottom: scale(1),
                                                            [xxl]: {
                                                                left: -scale(3, true),
                                                            },
                                                            [xl]: {
                                                                left: -15,
                                                            },
                                                            [md]: {
                                                                left: -scale(3, true),
                                                            },
                                                        },
                                                    }}
                                                    align="end"
                                                >
                                                    <Form.FastField
                                                        type="number"
                                                        name={filter_range_key_to}
                                                        placeholder="До"
                                                    />
                                                </Layout.Item>
                                            </Layout>
                                        </Layout.Item>
                                    );
                                }

                                if (filter === 'many' && type === 'enum') {
                                    if (items) {
                                        return (
                                            <Layout.Item col={1} key={code} align="end">
                                                <Form.FastField name={fieldName}>
                                                    <MultiSelect items={items} label={name} />
                                                </Form.FastField>
                                            </Layout.Item>
                                        );
                                    }
                                    if (enum_info.endpoint) {
                                        return (
                                            <Layout.Item col={1} key={code} align="end">
                                                <Form.FastField name={fieldName}>
                                                    <AutocompleteMulti
                                                        label={name}
                                                        url={enum_info.endpoint.split('v1/')[1]}
                                                    />
                                                </Form.FastField>
                                            </Layout.Item>
                                        );
                                    }
                                }

                                return (
                                    <Layout.Item col={1} key={code} align="end">
                                        {['date', 'datetime'].includes(type) && (
                                            <Form.FastField name={fieldName}>
                                                <CalendarInput label={name} />
                                            </Form.FastField>
                                        )}
                                        {type === 'enum' && items && (
                                            <Form.FastField name={fieldName}>
                                                <Select label={name} items={items} />
                                            </Form.FastField>
                                        )}
                                        {type === 'enum' && enum_info.endpoint && (
                                            <Form.FastField name={fieldName} label={name}>
                                                <Autocomplete searchAsyncFunc={searchAsyncFunc} />
                                            </Form.FastField>
                                        )}
                                        {type === 'phone' && (
                                            <Form.FastField name={fieldName} label={name} type="tel">
                                                <Mask mask={maskPhone} />
                                            </Form.FastField>
                                        )}
                                        {type === 'bool' && (
                                            <Form.FastField name={fieldName}>
                                                <Select label={name} items={booleanOptions} simple />
                                            </Form.FastField>
                                        )}
                                        {type === 'string' && <Form.FastField name={fieldName} label={name} />}
                                        {['url', 'email'].includes(type) && (
                                            <Form.FastField name={fieldName} label={name} type={type} />
                                        )}
                                        {['int', 'price', 'float'].includes(type) && (
                                            <Form.FastField name={fieldName} label={name} type="number" />
                                        )}
                                    </Layout.Item>
                                );
                            })}
                        </Layout>
                    </Block.Body>

                    <Block.Footer>
                        <div>
                            <Button theme="secondary" Icon={FilterIcon} onClick={() => setFiltersOpen(true)}>
                                Настройка фильтров
                            </Button>
                        </div>

                        <div css={{ display: 'flex' }}>
                            {filtersActive && (
                                <Form.Reset
                                    theme="fill"
                                    Icon={ResetIcon}
                                    type="button"
                                    initialValues={emptyInitialValues}
                                    onClick={() => push(pathname)}
                                >
                                    Сбросить
                                </Form.Reset>
                            )}

                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Применить
                            </Button>
                        </div>
                    </Block.Footer>
                </Form>
            </Block>
            <Popup isOpen={filtersOpen} onRequestClose={closeFilters} leftHanded title="Настройка фильтров">
                <Form
                    initialValues={
                        filters?.reduce((acc, f) => {
                            acc[f.code] = Boolean(filtersSettings?.includes(f.code));
                            return acc;
                        }, {} as FormikValues) || {}
                    }
                    enableReinitialize
                    onSubmit={() => setFiltersSettings(filterOrder)}
                    css={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Popup.Body>
                        <FilterOrderHelper setFilterOrder={setFilterOrder} />
                        <Tabs>
                            <Tabs.List>
                                <Tabs.Tab>Показывать</Tabs.Tab>
                                <Tabs.Tab>Сортировать</Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel>
                                <Layout cols={1} gap={scale(2)}>
                                    {filters?.map(f => (
                                        <Layout.Item key={f.code} col={1}>
                                            <Form.FastField name={f.code}>
                                                <Checkbox>{f.name}</Checkbox>
                                            </Form.FastField>
                                        </Layout.Item>
                                    ))}
                                </Layout>
                            </Tabs.Panel>
                            <Tabs.Panel>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="column-order">
                                        {droppableprops => (
                                            <ul
                                                ref={droppableprops.innerRef}
                                                {...droppableprops.droppableProps}
                                                css={{ position: 'relative' }}
                                            >
                                                {filterOrder.map((f, index) => (
                                                    <Draggable key={f} draggableId={f} index={index}>
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
                                                                {filtersObject[f]}
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
                        <Button type="button" theme="fill" block onClick={closeFilters}>
                            Отменить
                        </Button>
                        <Button type="submit" block onClick={closeFilters}>
                            Сохранить
                        </Button>
                    </Popup.Footer>
                </Form>
            </Popup>
        </>
    );
};

export default AutoFilters;
