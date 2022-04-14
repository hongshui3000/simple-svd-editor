import { useMemo } from 'react';
import { FormikValues } from 'formik';
import { useQueries, UseQueryResult } from 'react-query';

import { MetaField, Meta, FilterResponse, FetchError, CommonResponse } from '@api/common/types';

import { toISOString, isEmptyArray, fromRoubleToKopecks } from '@scripts/helpers';
import { useFiltersHelper } from '@scripts/hooks';
import { ExtendedColumn, Cell } from '@components/Table';

import { apiClient } from '@api/index';

type MetaFieldObject = Record<string, Omit<MetaField, 'code'>>;

// из апи приходит url с v1, а наш apiClient принимает без v1
const getRightEndpoint = (url: string) => url.split('v1/')[1];

/**
 * Хук для получения
 */
export const useAutoFilters = (meta: Meta | undefined) => {
    // формируем объект полей, где ключом является code
    const metaField = useMemo(
        () =>
            meta?.fields.reduce((acc, { code, ...rest }) => {
                acc[code] = rest;
                return acc;
            }, {} as MetaFieldObject) || undefined,
        [meta?.fields]
    );

    // формируем объект initialValues в зависимости от типов полей
    const emptyInitialValues = useMemo(
        () =>
            meta?.fields.reduce((acc, { filter, filter_key, code, filter_range_key_to, filter_range_key_from }) => {
                if (filter) {
                    if (filter === 'range') {
                        acc[filter_range_key_from] = '';
                        acc[filter_range_key_to] = '';
                    } else {
                        acc[filter_key || code] = filter === 'many' ? [] : '';
                    }
                }
                return acc;
            }, {} as FormikValues) || {},
        [meta?.fields]
    );

    const { initialValues: values, URLHelper, filtersActive } = useFiltersHelper(emptyInitialValues);

    const searchRequestFilter = useMemo(() => {
        const keys = Object.keys(values) as Array<string>;
        return keys.reduce((acc, key) => {
            const val = values[key];
            const code = key.replace(/(_from)|(_to)/, '');

            if (val && code && metaField && metaField[code]) {
                if (['datetime', 'date'].includes(metaField[code].type)) {
                    acc[key] = toISOString(new Date(val));
                }
                if (metaField[code].type === 'price') {
                    acc[key] = fromRoubleToKopecks(val);
                }
                if (metaField[code].type === 'enum') {
                    if (metaField[code].enum_info?.endpoint) {
                        if (metaField[code].filter === 'many') {
                            if (Array.isArray(val) && val.length > 0) {
                                acc[key] = val.map(i => i.value);
                            }
                        } else if (val?.value) acc[key] = val.value;
                    } else if (val.length > 0) acc[key] = val;
                }
            } else if (val && !isEmptyArray(val)) {
                acc[key] = val;
            }

            return acc;
        }, {} as any);
    }, [values, metaField]);

    return {
        metaField,
        filtersActive,
        URLHelper,
        values,
        emptyInitialValues,
        searchRequestFilter,
    };
};

/**
 * Хук для получения автосгенерированных столбцов
 */
export const useAutoColumns = (meta: Meta | undefined) =>
    useMemo(() => {
        if (!meta?.fields || meta?.fields.length === 0) return [];

        return meta?.fields?.reduce((acc, field) => {
            if (field.list) {
                acc.push({
                    Header: field.name,
                    accessor: field.code,
                    disableSortBy: !field.sort,
                    Cell: ({ value }) => <Cell value={value} type={field.type} />,
                });
            }
            return acc;
        }, [] as ExtendedColumn[]);
    }, [meta?.fields]);

/**
 * Хук автоматически дообогащает данными поля, в которых требовался дополнительный запрос в апи
 */
export function useAutoTableData<T extends Record<string, any>>(
    // данные, полученные от бэка
    dataToEnrich: Array<T> | undefined,
    // данные, полученные из хука useAutoFilters
    metaField: MetaFieldObject | undefined
): Array<T> {
    // Найдем поля, по которым нужно запрашивать данные. Объект типа {code: {endpoing: string, ids: string[]}}
    const dataForRequest = useMemo(
        () =>
            dataToEnrich?.reduce((acc, d) => {
                const keys = Object.keys(d);
                keys.forEach(k => {
                    if (metaField && metaField[k] && (typeof d[k] === 'number' || typeof d[k] === 'string')) {
                        const { type, enum_info } = metaField[k];
                        if (type === 'enum' && enum_info.endpoint) {
                            if (acc[k] && Array.isArray(acc[k].ids) && !acc[k].ids.includes(d[k])) {
                                acc[k].ids.push(d[k]);
                            } else {
                                acc[k] = { endpoint: getRightEndpoint(enum_info.endpoint), ids: [d[k]] };
                            }
                        }
                    }
                });
                return acc;
            }, {} as Record<string, { endpoint: string; ids: string[] }>) || {},
        [dataToEnrich, metaField]
    );

    const dataForRequestKeys = useMemo(() => Object.keys(dataForRequest), [dataForRequest]);

    const enumsDataFromRequest = useQueries(
        dataForRequestKeys.map(key => ({
            queryKey: [key, dataForRequest[key]],
            queryFn: () =>
                apiClient.post(dataForRequest[key].endpoint, {
                    data: { filter: { id: dataForRequest[key].ids } },
                }),
        }))
    ) as unknown as UseQueryResult<CommonResponse<FilterResponse>, FetchError>[];

    const resultEnumsData = useMemo(
        () =>
            enumsDataFromRequest.reduce((acc, { data, isSuccess }, index) => {
                acc[dataForRequestKeys[index]] = isSuccess ? data?.data : [];
                return acc;
            }, {} as Record<string, any>),
        [dataForRequestKeys, enumsDataFromRequest]
    );

    // обогатим данные для таблицы данными, полученными из запроса
    return useMemo(
        () =>
            dataToEnrich?.map(d => {
                if (!metaField) return d;
                const tableData = { ...d };

                Object.keys(d).forEach(k => {
                    const filter = metaField[k];
                    if (filter && filter?.type === 'enum') {
                        if (filter.enum_info?.values) {
                            // @ts-ignore
                            tableData[k] = filter.enum_info.values.find(v => +v.id === +d[k])?.title;
                        } else if (filter.enum_info?.endpoint) {
                            const textValue = resultEnumsData[k]?.find(
                                (list: { id: string; title: string }) => +list.id === +d[k]
                            )?.title;
                            // @ts-ignore
                            if (textValue) tableData[k] = textValue;
                        }
                    }
                });

                return tableData;
            }) || [],
        [dataToEnrich, metaField, resultEnumsData]
    );
}
