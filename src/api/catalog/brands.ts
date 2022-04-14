import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CommonResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { BrandsParams, Brand, BrandBase, BrandBaseWithId, BrandsImageMutateParams } from './types';

const BRANDS_BASE_URL = 'catalog/brands';

export const useBrands = (data: BrandsParams = {}, enabled = true) =>
    useQuery<CommonResponse<Brand[]>, FetchError>({
        queryKey: ['brands', data],
        queryFn: () => apiClient.post(`${BRANDS_BASE_URL}:search`, { data }),
        enabled,
    });

export const useBrand = (id: number) =>
    useQuery<CommonResponse<Brand>, FetchError>({
        queryKey: ['brands', id],
        queryFn: () => apiClient.get(`${BRANDS_BASE_URL}/${id}`),
    });

export const useCreateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Brand>, FetchError, BrandBase>(
        data => apiClient.post(BRANDS_BASE_URL, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries('brands'),
        }
    );
};

export const useEditBrand = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Brand>, FetchError, BrandBaseWithId>(
        data => apiClient.put(`${BRANDS_BASE_URL}/${data.id}`, { data }),
        { onSuccess: () => queryClient.invalidateQueries('brands') }
    );
};

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.delete(`${BRANDS_BASE_URL}/${id}`), {
        onSuccess: () => queryClient.invalidateQueries('brands'),
    });
};

export const useMutateBrandImage = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Brand>, FetchError, BrandsImageMutateParams>(
        ({ id, file }) => apiClient.post(`${BRANDS_BASE_URL}/${id}:upload-image`, { data: file }),
        { onSuccess: () => queryClient.invalidateQueries('brands') }
    );
};

export const useDeleteBrandImage = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Brand>, FetchError, number>(
        id => apiClient.post(`${BRANDS_BASE_URL}/${id}:delete-image`),
        { onSuccess: () => queryClient.invalidateQueries('brands') }
    );
};
