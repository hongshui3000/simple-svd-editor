import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CommonSearchParams, CommonResponse } from '@api/common/types';
import { Variant, VariantsFilter, VariantMutate } from '@api/catalog/types';
import { apiClient, FetchError } from '@api/index';

const API_URL = `catalog/variants`;
enum VariantKeys {
    VARIANTS = 'variants',
    VARIANT = 'variant',
}

export const useVariants = (data: CommonSearchParams<VariantsFilter>) =>
    useQuery<CommonResponse<Variant[]>, FetchError>({
        queryKey: [VariantKeys.VARIANTS, data],
        queryFn: () => apiClient.post(`${API_URL}:search`, { data }),
    });

export const useVariant = (id: number | string, include?: string) =>
    useQuery<CommonResponse<Variant>, FetchError>({
        queryKey: [VariantKeys.VARIANT, id, include],
        queryFn: () => apiClient.get(`${API_URL}/${id}`, include ? { params: { include } } : {}),
        enabled: !!id,
    });

export const useCreateVariant = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<Variant>, FetchError, VariantMutate>(data => apiClient.post(API_URL, { data }), {
        onSuccess: () => queryClient.invalidateQueries(VariantKeys.VARIANTS),
    });
};

export const useUpdateVariant = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<Variant>, FetchError, VariantMutate & { id: number | string }>(
        data => apiClient.put(`${API_URL}/${data.id}`, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries(VariantKeys.VARIANTS),
        }
    );
};

export const useDeleteVariant = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<null>, FetchError, number | string>(id => apiClient.delete(`${API_URL}/${id}`), {
        onSuccess: () => {
            queryClient.invalidateQueries(VariantKeys.VARIANTS);
            queryClient.invalidateQueries(VariantKeys.VARIANT);
        },
    });
};
