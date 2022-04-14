import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CommonResponse, CommonOption } from '@api/common/types';
import { OMSSettings, OMSSettingsMutate } from './types';
import { apiClient, FetchError } from '../index';

export const useOrderStatuses = () =>
    useQuery<CommonResponse<CommonOption[]>, FetchError>({
        queryKey: 'orderStatuses',
        queryFn: () => apiClient.get('orders/order-statuses'),
    });

export const useOrderSources = () =>
    useQuery<CommonResponse<CommonOption[]>, FetchError>({
        queryKey: 'orderSources',
        queryFn: () => apiClient.get('orders/order-sources'),
    });

export const usePaymentMethods = () =>
    useQuery<CommonResponse<CommonOption[]>, FetchError>({
        queryKey: 'paymentMethods',
        queryFn: () => apiClient.get('orders/payment-methods'),
    });

export const usePaymentStatuses = () =>
    useQuery<CommonResponse<CommonOption[]>, FetchError>({
        queryKey: 'paymentStatuses',
        queryFn: () => apiClient.get('orders/payment-statuses'),
    });

export const useDeliveryStatuses = () =>
    useQuery<CommonResponse<CommonOption[]>, FetchError>({
        queryKey: 'deliveryStatuses',
        queryFn: () => apiClient.get('orders/delivery-statuses'),
    });

export const useShipmentStatuses = () =>
    useQuery<CommonResponse<CommonOption[]>, FetchError>({
        queryKey: 'shipmentStatuses',
        queryFn: () => apiClient.get('orders/shipment-statuses'),
    });

export const useRefundStatuses = () =>
    useQuery<CommonResponse<CommonOption[]>, FetchError>({
        queryKey: 'refundStatuses',
        queryFn: () => apiClient.get('orders/refund-statuses'),
    });

const settingsUpdater = (
    prevSettings: CommonResponse<OMSSettings[]> | undefined,
    newSettings: CommonResponse<OMSSettings[]>
) =>
    prevSettings
        ? {
              ...prevSettings,
              data: prevSettings.data.map(setting => {
                  const newItem = newSettings.data.find(n => n.id === setting.id);
                  return newItem || setting;
              }),
          }
        : prevSettings;

const omsSettingsKey = 'oms-settings';
export const useOmsSettings = () =>
    useQuery<CommonResponse<OMSSettings[]>, FetchError>({
        queryKey: [omsSettingsKey],
        queryFn: () => apiClient.get(`orders/${omsSettingsKey}`),
    });

export const useUpdateOMSSettings = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<OMSSettings[]>, FetchError, OMSSettingsMutate[]>(
        data => apiClient.patch(`orders/${omsSettingsKey}`, { data: { settings: data } }),
        {
            onSuccess: newSettings => {
                queryClient.setQueryData<CommonResponse<OMSSettings[]> | undefined>([omsSettingsKey], prevSettings =>
                    settingsUpdater(prevSettings, newSettings)
                );
            },
        }
    );
};

const basketsSettingsKey = 'baskets-settings';
export const useBasketsSettings = () =>
    useQuery<CommonResponse<OMSSettings[]>, FetchError>({
        queryKey: [basketsSettingsKey],
        queryFn: () => apiClient.get(`orders/${basketsSettingsKey}`),
    });

export const useUpdateBasketsSettings = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<OMSSettings[]>, FetchError, OMSSettingsMutate[]>(
        data => apiClient.patch(`orders/${basketsSettingsKey}`, { data: { settings: data } }),
        {
            onSuccess: newSettings => {
                queryClient.setQueryData<CommonResponse<OMSSettings[]> | undefined>(
                    [basketsSettingsKey],
                    prevSettings => settingsUpdater(prevSettings, newSettings)
                );
            },
        }
    );
};
