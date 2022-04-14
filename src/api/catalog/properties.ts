import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { useQuery, useMutation, useQueryClient, QueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';
import {
    PropertyData,
    DirectoryData,
    ChangeDirectoryData,
    PropertyFields,
    PropertiesFilters,
    PropertyDirectoryItem,
    Property,
    QUERY_KEYS,
} from './types';

const updateProperties = (queryClient: QueryClient) => {
    queryClient.invalidateQueries(QUERY_KEYS.PROPERTIES);
    queryClient.invalidateQueries(QUERY_KEYS.PROPERTY);
};

export const useProperties = (data: CommonSearchParams<PropertiesFilters>, enabled = true) =>
    useQuery<CommonResponse<Property[]>, FetchError>({
        queryKey: [QUERY_KEYS.PROPERTIES, data],
        queryFn: () => apiClient.post('catalog/properties:search', { data }),
        enabled,
    });

export const useProperty = (id?: number) =>
    useQuery<CommonResponse<Property>, FetchError>({
        queryKey: [QUERY_KEYS.PROPERTY, id],
        queryFn: () => apiClient.get(`catalog/properties/${id}`, { params: { include: 'directory' } }),
        enabled: !!id,
    });

export const usePropertyCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Property>, FetchError, PropertyFields>(
        productType => apiClient.post('catalog/properties', { data: productType }),
        { onSuccess: () => updateProperties(queryClient) }
    );
};

export const usePropertyChange = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Property>, FetchError, PropertyData>(
        property => {
            const { id, ...propertyData } = property;
            return apiClient.put(`catalog/properties/${id}`, { data: propertyData });
        },
        { onSuccess: () => updateProperties(queryClient) }
    );
};

export const usePropertyRemove = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.delete(`catalog/properties/${id}`), {
        onSuccess: () => updateProperties(queryClient),
    });
};

export const usePropertyDirectoryCreate = () =>
    useMutation<CommonResponse<PropertyDirectoryItem>, FetchError, DirectoryData>(directory => {
        const { propertyId, ...directoryData } = directory;
        return apiClient.post(`catalog/properties/${propertyId}:add-directory`, { data: directoryData });
    });

export const usePropertyDirectoryChange = () =>
    useMutation<CommonResponse<PropertyDirectoryItem>, FetchError, ChangeDirectoryData>(directory => {
        const { directoryId, ...directoryData } = directory;
        return apiClient.put(`catalog/properties/directory/${directoryId}`, { data: directoryData });
    });

export const usePropertyDirectoryRemove = () =>
    useMutation<CommonResponse<PropertyDirectoryItem>, FetchError, number>(id =>
        apiClient.delete(`catalog/properties/directory/${id}`)
    );
