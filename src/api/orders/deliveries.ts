import { useMutation, useQueryClient } from 'react-query';
import { CommonResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { Order, DeliveryChangeData } from './types/index';

export const useDeliveryChange = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Order[]>, FetchError, DeliveryChangeData>(
        delivery => {
            const { id, ...deliveryData } = delivery;
            return apiClient.patch(`orders/deliveries/${id}`, { data: deliveryData });
        },
        { onSuccess: () => queryClient.invalidateQueries('orders') }
    );
};
