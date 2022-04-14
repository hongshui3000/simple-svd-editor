import { useQuery } from 'react-query';
import { FilterSearchParam, FilterResponse, FetchError, CommonResponse } from '@api/common/types';
import { apiClient } from '..';

export const usePointEnumValuesSearch = (data: FilterSearchParam) =>
    useQuery<CommonResponse<FilterResponse>, FetchError>({
        queryKey: ['point-enum-values', data],
        queryFn: () => apiClient.post('/logistic/point-enum-values:search', { data }),
    });
