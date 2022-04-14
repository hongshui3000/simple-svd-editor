import { CommonResponse } from '@api/common/types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';

import {
    DeliveryKpiDataAndMeta,
    DeliveryKpiFormData,
    DeliveryKpiCtData,
    DeliveryKpiCtFormData,
    DeliveryKpiPptData,
    DeliveryKpiPpt,
    DeliveryKpiPptFormData,
    DeliveryKpiCt,
} from './types';

export const useDeliveryKpi = () =>
    useQuery<DeliveryKpiDataAndMeta, FetchError>({
        queryKey: 'delivery-kpi',
        queryFn: () => apiClient.get('logistic/delivery-kpi'),
    });

export const useDeliveryKpiChange = () => {
    const queryClient = useQueryClient();

    return useMutation<DeliveryKpiDataAndMeta, FetchError, DeliveryKpiFormData>(
        data => apiClient.patch(`logistic/delivery-kpi`, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-kpi'),
        }
    );
};

export const useDeliveryKpiCt = (data: DeliveryKpiCtData = {}) =>
    useQuery<CommonResponse<DeliveryKpiCt[]>, FetchError>({
        queryKey: ['delivery-kpi-ct', data],
        queryFn: () => apiClient.post('logistic/delivery-kpi-ct:search', { data }),
    });

export const useDeliveryKpiCtCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<DeliveryKpiCt>, FetchError, DeliveryKpiCtFormData>(
        deliveryKpiCt => {
            const { seller_id, ...deliveryKpiCtData } = deliveryKpiCt;
            return apiClient.post(`logistic/delivery-kpi-ct/${seller_id}`, { data: deliveryKpiCtData });
        },
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-kpi-ct'),
        }
    );
};

export const useDeliveryKpiCtEdit = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<DeliveryKpiCt>, FetchError, DeliveryKpiCtFormData>(
        deliveryKpiCt => {
            const { seller_id, ...deliveryKpiCtData } = deliveryKpiCt;
            return apiClient.put(`logistic/delivery-kpi-ct/${seller_id}`, { data: deliveryKpiCtData });
        },
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-kpi-ct'),
        }
    );
};

export const useDeliveryKpiCtDelete = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(
        seller_id => apiClient.delete(`logistic/delivery-kpi-ct/${seller_id}`),
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-kpi-ct'),
        }
    );
};

export const useDeliveryKpiPpt = (data: DeliveryKpiPptData = {}) =>
    useQuery<CommonResponse<DeliveryKpiPpt[]>, FetchError>({
        queryKey: ['delivery-kpi-ppt', data],
        queryFn: () => apiClient.post('logistic/delivery-kpi-ppt:search', { data }),
    });

export const useDeliveryKpiPptCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<DeliveryKpiPpt>, FetchError, DeliveryKpiPptFormData>(
        deliveryKpiPpt => {
            const { seller_id, ...deliveryKpiPptData } = deliveryKpiPpt;
            return apiClient.post(`logistic/delivery-kpi-ppt/${seller_id}`, { data: deliveryKpiPptData });
        },
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-kpi-ppt'),
        }
    );
};

export const useDeliveryKpiPptEdit = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<DeliveryKpiPpt>, FetchError, DeliveryKpiPptFormData>(
        deliveryKpiPpt => {
            const { seller_id, ...deliveryKpiPptData } = deliveryKpiPpt;
            return apiClient.put(`logistic/delivery-kpi-ppt/${seller_id}`, { data: deliveryKpiPptData });
        },
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-kpi-ppt'),
        }
    );
};

export const useDeliveryKpiPptDelete = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(
        seller_id => apiClient.delete(`logistic/delivery-kpi-ppt/${seller_id}`),
        {
            onSuccess: () => queryClient.invalidateQueries('delivery-kpi-ppt'),
        }
    );
};
