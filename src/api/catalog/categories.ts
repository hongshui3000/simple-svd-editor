import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';
import { Category, CategoriesFilter, CategoryFormData, CategoryItemFormData } from './types';

const API_URL = 'catalog/categories';
const QUERY_KEY = 'categories';

export const useCategories = (data: CommonSearchParams<CategoriesFilter>) =>
    useQuery<CommonResponse<Category[]>, FetchError>({
        queryKey: [QUERY_KEY, data],
        queryFn: () => apiClient.post(`${API_URL}:search`, { data }),
    });

export const useCategoryCreate = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<Category>, FetchError, CategoryFormData>(
        category => apiClient.post(API_URL, { data: category }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY) }
    );
};

export const useCategoryUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Category>, FetchError, CategoryItemFormData>(
        category => {
            const { id, ...categoryData } = category;
            return apiClient.put(`${API_URL}/${id}`, { data: categoryData });
        },
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY) }
    );
};

export const useCategoryDelete = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.delete(`${API_URL}/${id}`), {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
    });
};
