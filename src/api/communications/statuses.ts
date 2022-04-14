import { useQuery, useMutation } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { Status, StatusesFilter, NewStatus } from './type';

export const useCommunicationsStatuses = (data: CommonSearchParams<StatusesFilter> = {}) =>
    useQuery<CommonResponse<Status[]>, FetchError>({
        queryKey: ['communications-statuses-search', data],
        queryFn: () => apiClient.post('communication/statuses:search', { data }),
    });

export const useCommunicationsCreateStatus = () =>
    useMutation<CommonResponse<Status>, FetchError, NewStatus>(newStatus =>
        apiClient.post('communication/statuses', {
            data: newStatus,
        })
    );

export const useCommunicationsUpdateStatus = () =>
    useMutation<CommonResponse<Status>, FetchError, Status>(status =>
        apiClient.patch(`communication/statuses/${status.id}`, { data: status })
    );

export const useCommunicationsDeleteStatus = () =>
    useMutation<CommonResponse<Status>, FetchError, number>(statusId =>
        apiClient.delete(`communication/statuses/${statusId}`)
    );
