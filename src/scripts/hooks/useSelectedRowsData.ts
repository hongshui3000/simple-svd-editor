import { useMemo, useState } from 'react';

export function useSelectedRowsData<T>(data: T[]): [number[], (val: number[]) => void, T[]] {
    const [ids, setIds] = useState<number[]>([]);

    const selectedRowsData = useMemo(() => {
        const rowsData: T[] = [];
        if (ids.length > 0) {
            ids.forEach(id => {
                rowsData.push(data[id]);
            });
        }
        return rowsData;
    }, [data, ids]);

    return [ids, setIds, selectedRowsData];
}
