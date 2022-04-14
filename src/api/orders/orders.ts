import { useQuery, useQueryClient, useMutation } from 'react-query';
import { CommonResponse, CommonSearchParams, Meta } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import {
    OrderSearchFilter,
    OrderSearchInclude,
    OrderSearchSort,
    Order,
    OrderChangeData,
    OrderDeliveryChange,
    OrderFile,
} from './types/index';

const baseURL = 'orders/orders';

export const useOrdersSearch = (
    data: CommonSearchParams<OrderSearchFilter, OrderSearchSort, OrderSearchInclude>,
    enabled: boolean = true
) =>
    useQuery<CommonResponse<Order[]>, FetchError>({
        enabled,
        queryKey: ['orders', data],
        queryFn: () => apiClient.post(`${baseURL}:search`, { data }),
    });

export const useOrderDetail = (id: number | string | undefined, include?: OrderSearchInclude) =>
    useQuery<CommonResponse<Order>, FetchError>({
        enabled: !!id,
        queryKey: ['order', id],
        queryFn: () => apiClient.get(`${baseURL}/${id}${include ? `?include=${include.join(',')}` : ''}`),
    });

export const useOrderChange = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Order>, FetchError, OrderChangeData>(
        order => {
            const { id, ...orderData } = order;
            return apiClient.patch(`${baseURL}/${id}`, { data: orderData });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('order');
                queryClient.invalidateQueries('orders');
            },
        }
    );
};
export const useOrderDeliveryChange = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Order>, FetchError, OrderDeliveryChange & { id: number }>(
        delivery => {
            const { id, ...deliveryData } = delivery;
            return apiClient.post(`${baseURL}/${id}:change-delivery`, { data: deliveryData });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('order');
                queryClient.invalidateQueries('orders');
            },
        }
    );
};

export const useOrdersMeta = () =>
    useQuery<{ data: Meta }, FetchError>({
        queryKey: 'ordersMeta',
        queryFn: () => apiClient.get(`${baseURL}:meta`),
    });

export const useOrdersAddFile = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<OrderFile>, FetchError, { id: number | string; file: File }>(
        ({ id, file }) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.post(`${baseURL}/${id}:attach-file`, { data: formData });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('order');
                queryClient.invalidateQueries('orders');
            },
        }
    );
};

export const useOrdersDeleteFiles = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, { id: number | string; file_ids: number[] }>(
        ({ id, ...data }) => apiClient.delete(`${baseURL}/${id}:delete-files`, { data }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('order');
                queryClient.invalidateQueries('orders');
            },
        }
    );
};
