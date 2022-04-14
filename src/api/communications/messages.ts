import { useQuery, useMutation } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { MessagesFilter, Message, NewMessage } from './type';

export const useCommunicationsMessages = (data: CommonSearchParams<MessagesFilter> = {}) =>
    useQuery<CommonResponse<Message[]>, FetchError>({
        queryKey: ['communications-messages-search', data],
        queryFn: () => apiClient.post('communication/messages:search', { data }),
    });

export const useCommunicationsPostNewMessage = () =>
    useMutation<CommonResponse<Message>, FetchError, NewMessage>(newMessage =>
        apiClient.post('communication/messages', { data: newMessage })
    );
