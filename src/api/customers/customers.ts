import { useQuery, useMutation } from 'react-query';
import { CommonResponse, FileUpload, CommonSearchParams } from '@api/common/types';
import { Customer, CustomersFilter, CustomerMutate, CustomerMutateWithId } from './types';
import { apiClient, FetchError } from '..';

const CUSTOMER_URL = 'customers/customers';

export const useCustomers = (data: CommonSearchParams<CustomersFilter> = {}) =>
    useQuery<CommonResponse<Customer[]>, FetchError>({
        queryKey: ['customers', data],
        queryFn: () => apiClient.post(`${CUSTOMER_URL}:search`, { data }),
    });

export const useCustomer = (id: string | number | undefined | null) =>
    useQuery<CommonResponse<Customer>, FetchError>({
        queryKey: ['customer', id],
        queryFn: () => apiClient.get(`${CUSTOMER_URL}/${id}`),
        enabled: !!id,
    });

export const useCreateCustomer = () =>
    useMutation<CommonResponse<Customer>, FetchError, CustomerMutate>(data => apiClient.post(CUSTOMER_URL, { data }));

export const useUpdateCustomer = () =>
    useMutation<CommonResponse<Customer>, FetchError, CustomerMutateWithId>(({ id, ...data }) =>
        apiClient.put(`${CUSTOMER_URL}/${id}`, { method: 'PUT', data })
    );

export const useDeleteCustomer = () =>
    useMutation<CommonResponse<Customer>, FetchError, number>(id => apiClient.delete(`${CUSTOMER_URL}/${id}`));

export const useChangeCustomerStatus = () =>
    useMutation<CommonResponse<Customer>, FetchError, number>(id =>
        apiClient.post(`${CUSTOMER_URL}/${id}:change-status-if-profile-filled`)
    );

export const useAddCustomerAvatar = () =>
    useMutation<CommonResponse<Customer>, FetchError, FileUpload>(({ id, file }) =>
        apiClient.post(`${CUSTOMER_URL}/${id}:upload-image`, { data: file })
    );

export const useDeleteCustomerAvatar = () =>
    useMutation<CommonResponse<Customer>, FetchError, number>(id =>
        apiClient.post(`${CUSTOMER_URL}/${id}:delete-image`)
    );
