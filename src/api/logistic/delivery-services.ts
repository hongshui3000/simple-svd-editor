import { useQuery, useMutation } from 'react-query';
import { CommonResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';

import {
    DeliveryService,
    DeliveryServiceStatus,
    DeliveryServicesData,
    DeliveryServiceDetail,
    DeliveryServicePaymentMethods,
    DeliveryServicePaymentMethod,
} from './types';

const LOGISTIC_URL = 'logistic/delivery-services';

export const useDeliveryServices = (data: DeliveryServicesData = {}) =>
    useQuery<CommonResponse<DeliveryService[]>, FetchError>({
        queryKey: ['delivery-services', data],
        queryFn: () => apiClient.post(`${LOGISTIC_URL}:search`, { data }),
    });

export const useDeliveryStatuses = () =>
    useQuery<CommonResponse<DeliveryServiceStatus[]>, FetchError>({
        queryKey: 'delivery-service-statuses',
        queryFn: () => apiClient.get('logistic/delivery-service-statuses'),
    });

export const useDeliveryService = (id: number, include?: string) =>
    useQuery<CommonResponse<DeliveryServiceDetail>, FetchError>({
        queryKey: ['delivery-services', id],
        queryFn: () => apiClient.get(`${LOGISTIC_URL}/${id}${include ? `?include=${include}` : ''}`),
        enabled: !!id,
    });

export const useDeliveryServiceChange = () =>
    useMutation<CommonResponse<DeliveryServiceDetail>, FetchError, Partial<DeliveryServiceDetail>>(deliveryService => {
        const { id, ...deliveryServiceData } = deliveryService;
        return apiClient.patch(`${LOGISTIC_URL}/${id}`, { data: deliveryServiceData });
    });

export const useDeliveryServiceAddPaymentMethods = () =>
    useMutation<CommonResponse<null>, FetchError, DeliveryServicePaymentMethods>(data =>
        apiClient.post(`${LOGISTIC_URL}/${data.id}:add-payment-methods`, {
            data,
        })
    );

export const useDeliveryServiceDeletePaymentMethod = () =>
    useMutation<CommonResponse<null>, FetchError, DeliveryServicePaymentMethod>(data =>
        apiClient.post(`${LOGISTIC_URL}/${data.id}:delete-payment-method`, {
            data,
        })
    );
