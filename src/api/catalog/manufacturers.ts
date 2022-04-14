import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';
import { Manufacturer, ManufacturerFormData, ManufacturerItemFormData } from './types';

const API_URL = 'catalog/manufacturers';
const QUERY_KEY = 'manufacturers';

export const useManufacturers = (data: CommonSearchParams<undefined>) =>
    useQuery<CommonResponse<Manufacturer[]>, FetchError>({
        queryKey: [QUERY_KEY, data],
        queryFn: () => apiClient.post(`${API_URL}:search`, { data }),
    });

export const useManufacturerCreate = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<Manufacturer>, FetchError, ManufacturerFormData>(
        manufacturer => apiClient.post(API_URL, { data: manufacturer }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY) }
    );
};

export const useManufacturerChange = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<Manufacturer>, FetchError, ManufacturerItemFormData>(
        manufacturer => {
            const { id, ...manufacturerData } = manufacturer;
            return apiClient.put(`${API_URL}/${id}`, { data: manufacturerData });
        },
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY) }
    );
};

export const useManufacturerRemove = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.delete(`${API_URL}/${id}`), {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
    });
};
