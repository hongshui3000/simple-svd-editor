import { useMemo, useEffect, FC, Dispatch, SetStateAction } from 'react';
import { useFormikContext } from 'formik';

interface FilterOrderHelperProps {
    setFilterOrder: Dispatch<SetStateAction<string[]>>;
}

export const FilterOrderHelper: FC<FilterOrderHelperProps> = ({ setFilterOrder }) => {
    const { values } = useFormikContext<Record<string, boolean>>();

    const filtersFromValues = useMemo(
        () =>
            Object.keys(values).reduce((acc, key) => {
                if (values[key]) {
                    acc.push(key);
                }
                return acc;
            }, [] as string[]),
        [values]
    );

    useEffect(() => {
        setFilterOrder(prevOrder => {
            const prevOrderFiltered = prevOrder.filter(i => filtersFromValues.includes(i));
            const nextOrderFiltered = filtersFromValues.filter(i => !prevOrderFiltered.includes(i));
            return [...prevOrderFiltered, ...nextOrderFiltered];
        });
    }, [filtersFromValues, setFilterOrder]);
    return null;
};
