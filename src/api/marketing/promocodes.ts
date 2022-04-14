import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { Promocode, PromocodeMutate, PromocodeFilter } from './types';

const API_URL = 'marketing/promo-codes';
const QueryKeys = {
    PROMOCODES: 'promocodes',
    PROMOCODE: 'promocode',
};

export const usePromocodes = (data: CommonSearchParams<PromocodeFilter> = {}) =>
    useQuery<CommonResponse<Promocode[]>, FetchError>({
        queryKey: [QueryKeys.PROMOCODES, data],
        queryFn: () => apiClient.post(`${API_URL}:search`, { data }),
    });

export const usePromocodeCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Promocode>, FetchError, PromocodeMutate>(
        data => apiClient.post(API_URL, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries(QueryKeys.PROMOCODES),
        }
    );
};

export const usePromocode = ({
    id,
    enabled = true,
    include,
}: {
    id?: string | number;
    enabled: boolean;
    include?: string;
}) =>
    useQuery<CommonResponse<Promocode>, FetchError>({
        queryKey: [QueryKeys.PROMOCODE, id],
        queryFn: () => apiClient.get(`${API_URL}/${id}`, include ? { params: { include } } : {}),
        enabled,
    });

export const useUpdatePromocode = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Promocode>, FetchError, Promocode>(
        ({ id, ...data }) => apiClient.put(`${API_URL}/${id}`, { data }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(QueryKeys.PROMOCODES);
                queryClient.invalidateQueries(QueryKeys.PROMOCODE);
            },
        }
    );
};

export const usePatchPromocode = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Promocode>, FetchError, Promocode>(
        ({ id, ...data }) => apiClient.patch(`${API_URL}/${id}`, { data }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(QueryKeys.PROMOCODES);
                queryClient.invalidateQueries(QueryKeys.PROMOCODE);
            },
        }
    );
};

export const useDeletePromocode = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.delete(`${API_URL}/${id}`), {
        onSuccess: () => {
            queryClient.invalidateQueries(QueryKeys.PROMOCODES);
            queryClient.invalidateQueries(QueryKeys.PROMOCODE);
        },
    });
};
