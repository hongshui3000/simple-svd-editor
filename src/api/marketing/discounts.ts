import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CommonResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';

import {
    Discount,
    DiscountsData,
    DiscountsStatusFormData,
    DiscountStatus,
    DiscountType,
    DiscountConditionType,
    DiscountConditionTypeProp,
} from './types';

export const DISCOUNTS_BASE_URL = 'marketing/discounts';
export const DISCOUNT_BASE_URL = 'marketing/discount';

export const useDiscounts = (data: DiscountsData = {}) =>
    useQuery<CommonResponse<Discount[]>, FetchError>({
        queryKey: ['discounts', data],
        queryFn: () => apiClient.post(`${DISCOUNTS_BASE_URL}:search`, { data }),
    });

export const useDiscountsStatusChange = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, DiscountsStatusFormData>(
        data => apiClient.post(`${DISCOUNTS_BASE_URL}:mass-status-update`, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries('discounts'),
        }
    );
};

export const useDiscount = (id?: number | null, include?: string) =>
    useQuery<CommonResponse<Discount>, FetchError>({
        queryKey: ['discount', id],
        queryFn: () => apiClient.get(`${DISCOUNTS_BASE_URL}/${id}${include ? `?include=${include}` : ''}`),
        enabled: !!id,
    });

export const useDiscountCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Discount>, FetchError, Discount>(
        data => apiClient.post(`${DISCOUNTS_BASE_URL}`, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries('discounts'),
        }
    );
};

export const useDiscountEdit = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Discount>, FetchError, Discount>(
        data => apiClient.put(`${DISCOUNTS_BASE_URL}/${data.id}`, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries('discounts'),
        }
    );
};

export const useDiscountStatuses = () =>
    useQuery<CommonResponse<DiscountStatus[]>, FetchError>({
        queryKey: ['discount-statuses'],
        queryFn: () => apiClient.get(`${DISCOUNT_BASE_URL}-statuses`),
    });

export const useDeleteDiscount = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number | string>(
        id => apiClient.delete(`${DISCOUNTS_BASE_URL}/${id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('discounts');
            },
        }
    );
};

export const useDiscountTypes = () =>
    useQuery<CommonResponse<DiscountType[]>, FetchError>({
        queryKey: ['discount-types'],
        queryFn: () => apiClient.get(`${DISCOUNT_BASE_URL}-types`),
    });

export const useDiscountConditionTypes = () =>
    useQuery<CommonResponse<DiscountConditionType[]>, FetchError>({
        queryKey: ['discount-condition-types'],
        queryFn: () => apiClient.get(`${DISCOUNT_BASE_URL}-condition-types`),
    });

export const useDiscountConditionTypeProps = () =>
    useQuery<CommonResponse<DiscountConditionTypeProp[]>, FetchError>({
        queryKey: ['discount-condition-type-props'],
        queryFn: () => apiClient.get(`${DISCOUNT_BASE_URL}-condition-type-props`),
    });
