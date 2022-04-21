import { useQuery } from 'react-query';

import { getXML } from './api';

export const useXML = (data: { path: string }) => {
    const { key, fetch } = getXML(data);

    return useQuery<string, {}>({
        queryKey: key,
        queryFn: fetch,
    });
};
