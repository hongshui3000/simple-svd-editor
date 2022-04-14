import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';
import { ProductType, ProductTypesFormData, ProductTypesItemFormData } from './types';

const QUERY_KEY = 'product-types';
const API_URL = 'catalog/product-types';

export const useProductTypes = (data: CommonSearchParams<undefined>) =>
    useQuery<CommonResponse<ProductType[]>, FetchError>({
        queryKey: [QUERY_KEY, data],
        queryFn: () => apiClient.post(`${API_URL}:search`, { data }),
    });

export const useProductTypeCreate = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<ProductType>, FetchError, ProductTypesFormData>(
        productType => apiClient.post(API_URL, { data: productType }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY) }
    );
};

export const useProductTypeUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<ProductType>, FetchError, ProductTypesItemFormData>(
        productType => {
            const { id, ...productTypesData } = productType;
            return apiClient.put(`${API_URL}/${id}`, { data: productTypesData });
        },
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY) }
    );
};

export const useProductTypeDelete = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.delete(`${API_URL}/${id}`), {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
    });
};
