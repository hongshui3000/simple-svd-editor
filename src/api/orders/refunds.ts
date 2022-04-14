import { useQuery, useQueryClient, useMutation } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import {
    Refund,
    RefundReason,
    RefundReasonCreate,
    RefundCreateData,
    RefundMutateData,
    RefundFile,
    RefundFilters,
    RefundsInclude,
} from './types';

const baseURL = 'orders/refunds';

export const useRefundsSearch = (data: CommonSearchParams<Partial<RefundFilters>, string[], RefundsInclude>) =>
    useQuery<CommonResponse<Refund[]>, FetchError>({
        queryKey: ['refunds', data],
        queryFn: () => apiClient.post(`${baseURL}:search`, { data }),
    });

export const useCreateRefund = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Refund>, FetchError, RefundCreateData>(
        data => apiClient.post(baseURL, { data }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('refunds');
            },
        }
    );
};

export const useRefund = (id: number | string | undefined, include?: RefundsInclude) =>
    useQuery<CommonResponse<Refund>, FetchError>({
        queryKey: ['refund', id, include],
        queryFn: () => apiClient.get(`${baseURL}/${id}${include ? `?include=${include.join(',')}` : ''}`),
        enabled: !!id,
    });

export const usePatchRefund = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Refund>, FetchError, Partial<RefundMutateData> & { id: number | string }>(
        ({ id, ...data }) => apiClient.patch(`${baseURL}/${id}`, { data }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('refund');
                queryClient.invalidateQueries('refunds');
            },
        }
    );
};

export const useRefundAddFile = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<RefundFile>, FetchError, { id: number | string; file: File }>(
        ({ id, file }) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.post(`${baseURL}/${id}:attach-file`, { data: formData });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('refund');
                queryClient.invalidateQueries('refunds');
            },
        }
    );
};
export const useRefundDeleteFiles = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, { id: number | string; file_ids: number[] }>(
        ({ id, ...data }) => apiClient.delete(`${baseURL}/${id}:delete-files`, { data }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('refund');
                queryClient.invalidateQueries('refunds');
            },
        }
    );
};

const reasonsURL = 'orders/refund-reasons';
export const useRefundReasons = () =>
    useQuery<CommonResponse<RefundReason[]>, FetchError>({
        queryKey: 'refundReasons',
        queryFn: () => apiClient.get(reasonsURL),
    });

export const useCreateRefundReasons = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<RefundReason>, FetchError, RefundReasonCreate>(
        data => apiClient.post(reasonsURL, { data }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('refundReasons');
            },
        }
    );
};
export const usePatchRefundReasons = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<RefundReason>, FetchError, Partial<RefundReasonCreate & { id: number | string }>>(
        ({ id, ...rest }) => apiClient.patch(`${reasonsURL}/${id}`, { data: rest }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('refundReasons');
            },
        }
    );
};
