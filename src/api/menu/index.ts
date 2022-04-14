import { useQuery } from 'react-query';
import { STALE_TIME_DAY } from '@scripts/constants';
import { CommonResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';

export interface MenuData {
    items: string[];
}

export const useMenu = () =>
    useQuery<CommonResponse<MenuData>, FetchError>({
        queryKey: 'menu',
        queryFn: () => apiClient.get('menu'),
        staleTime: STALE_TIME_DAY,
    });
