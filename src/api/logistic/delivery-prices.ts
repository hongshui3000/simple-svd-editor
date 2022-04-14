import { CommonResponse } from '@api/common/types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';

import {
    DeliveryPrice,
    DeliveryPricesData,
    DeliveryPriceFormData,
    FederalDistrictsData,
    FederalDistrict,
    RegionsData,
    Region,
    DeliveryMethodsDataAndMeta,
} from './types';

const API_URL = 'logistic/delivery-prices';

export const useDeliveryPrices = (data: DeliveryPricesData) =>
    useQuery<CommonResponse<DeliveryPrice[]>, FetchError>({
        queryKey: ['delivery-prices', data],
        queryFn: () => apiClient.post(`${API_URL}:search`, { data }),
        enabled: !!data.filter?.delivery_service,
    });

export const useDeliveryPriceCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<DeliveryPrice>, FetchError, DeliveryPriceFormData>(
        deliveryPrice => apiClient.post(API_URL, { data: deliveryPrice }),
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-prices'),
        }
    );
};

export const useFederalDistricts = (data: FederalDistrictsData = {}) =>
    useQuery<CommonResponse<FederalDistrict[]>, FetchError>({
        queryKey: ['federal-districts', data],
        queryFn: () => apiClient.post('logistic/federal-districts:search', { data }),
    });

export const useRegions = (data: RegionsData) =>
    useQuery<CommonResponse<Region[]>, FetchError>({
        queryKey: ['regions', data],
        queryFn: () => apiClient.post('logistic/regions:search', { data }),
        enabled: !!data.filter?.federal_district_id,
    });

export const useDeliveryPriceChange = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<DeliveryPrice>, FetchError, DeliveryPriceFormData>(
        deliveryPrice => {
            const { id, ...deliveryPriceData } = deliveryPrice;
            return apiClient.patch(`${API_URL}/${id}`, { data: deliveryPriceData });
        },
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-prices'),
        }
    );
};

export const useDeleteDeliveryPrice = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.delete(`${API_URL}/${id}`), {
        onSuccess: () => queryClient.invalidateQueries('delivery-prices'),
    });
};

export const useDeliveryMethods = () =>
    useQuery<DeliveryMethodsDataAndMeta, FetchError>({
        queryKey: 'delivery-methods',
        queryFn: () => apiClient.get('logistic/delivery-methods'),
    });
