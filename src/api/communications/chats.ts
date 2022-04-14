import { useQuery, useMutation } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { Chat, ChatsFilter, NewChat, UpdateChat } from './type';

export const useCommunicationsChats = (data: CommonSearchParams<ChatsFilter> = {}) =>
    useQuery<CommonResponse<Chat[]>, FetchError>({
        queryKey: ['communications-chats-search', data],
        queryFn: () => apiClient.post('communication/chats:search', { data }),
    });

export const useCommunicationsCreateChat = () =>
    useMutation<CommonResponse<Chat>, FetchError, NewChat>(newChat =>
        apiClient.post('communication/chats', { data: newChat })
    );

export const useCommunicationsUpdateChat = () =>
    useMutation<CommonResponse<Chat>, FetchError, UpdateChat>(chat =>
        apiClient.patch(`communication/chats/${chat.id}`, { data: chat })
    );
