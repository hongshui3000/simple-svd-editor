import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import deepEqual from 'react-fast-compare';

import { getQueryObjectForPathname, isEmptyArray } from '@scripts/helpers';

const PARAMS_TO_EXCLUDE = ['page'];

const isObject = (value: any) => typeof value === 'object' && !Array.isArray(value) && value !== null;

/** Takes query-params from url, and enrich emptyInitValues */
export const useFiltersHelper = <T extends Record<string, any>>(emptyInitValues: FormikValues) => {
    const { push, query, pathname } = useRouter();

    /** Push form fields values in router history */
    const URLHelper = useCallback(
        (vals: T) => {
            const newURLSearchParams = new URLSearchParams();
            const queryForPathname = getQueryObjectForPathname(pathname, query) as any as Record<string, string>;

            if (isObject(vals)) {
                /** add unique form values */
                Object.keys(vals).forEach(k => {
                    if (vals[k] && !isEmptyArray(vals[k])) newURLSearchParams.append(k, JSON.stringify(vals[k]));
                });

                /** add query params wich associated with pathname params (next specific) */
                Object.keys(queryForPathname).forEach(k => {
                    newURLSearchParams.append(k, queryForPathname[k]);
                });

                push({ pathname, query: newURLSearchParams.toString() });
            }
        },
        [push, pathname, query]
    );

    const initialValues = useMemo(() => {
        const valuesFromUrl: FormikValues = {};
        const queryForPathname = getQueryObjectForPathname(pathname, query);

        Object.keys(query).forEach(key => {
            const value = query[key];
            if (value) {
                /** exclude params from pathname params (next specific) and PARAMS_TO_EXCLUDE exceptions */
                if (!PARAMS_TO_EXCLUDE.some(p => p === key) && !Object.keys(queryForPathname).some(k => k === key)) {
                    const parsedValue = Array.isArray(value) ? value.map(v => JSON.parse(v)) : JSON.parse(value);
                    valuesFromUrl[key] = parsedValue;
                }
            }
        });

        return {
            ...emptyInitValues,
            ...valuesFromUrl,
        } as T;
    }, [emptyInitValues, pathname, query]);

    const filtersActive = useMemo(() => !deepEqual(emptyInitValues, initialValues), [emptyInitValues, initialValues]);

    return { initialValues, URLHelper, filtersActive };
};
