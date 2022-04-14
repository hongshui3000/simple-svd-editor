import { useQuery } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { ChannelsFilter, Channel } from './type';

export const useCommunicationsChannels = (data: CommonSearchParams<ChannelsFilter> = {}) =>
    useQuery<CommonResponse<Channel[]>, FetchError>({
        queryKey: ['communication-channels-search', data],
        queryFn: () => apiClient.post('communication/channels:search', { data }),
    });
