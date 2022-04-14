import { useQuery, useMutation } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { Notification, NotificationsFilter, NewNotification } from './type';

export const useCommunicationsNotifications = (data: CommonSearchParams<NotificationsFilter> = {}) =>
    useQuery<CommonResponse<Notification[]>, FetchError>({
        queryKey: ['communications-notifications-search', data],
        queryFn: () => apiClient.post('communication/notifications:search', { data }),
    });

export const useCommunicationsCreateNotification = () =>
    useMutation<CommonResponse<Notification>, FetchError, NewNotification>(newNotification =>
        apiClient.post('communication/notifications', { data: newNotification })
    );

export const useCommunicationsUpdateNotification = () =>
    useMutation<CommonResponse<Notification>, FetchError, Notification>(notification =>
        apiClient.patch(`communication/notifications/${notification.id}`, { data: notification })
    );

export const useCommunicationsDeleteNotification = () =>
    useMutation<CommonResponse<Notification>, FetchError, number>(notificationId =>
        apiClient.delete(`communication/notifications/${notificationId}`)
    );
