import { ProductGroupTypeParams, useProductGroupTypes } from '@api/catalog';
import { SelectItemProps } from '@components/controls/Select';
import { useMemo } from 'react';

export const useProductTypesSelectable = (
    props: ProductGroupTypeParams = {
        include: [],
        pagination: {
            limit: 10,
            type: 'offset',
            offset: 0,
        },
        sort: ['id'],
    }
) => {
    const { data: groupTypes } = useProductGroupTypes(props);

    const options = useMemo<SelectItemProps[]>(
        () =>
            groupTypes?.data?.map(({ id, name }) => ({
                value: id.toString(),
                label: name,
            })) || [],
        [groupTypes?.data]
    );

    return options;
};
