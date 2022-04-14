import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { Customer, AddressFilter, AddressMutate, Address } from './types';
import { apiClient, FetchError } from '..';

const ADDRESS_URL = 'customers/addresses';

type UseAddressParams = CommonSearchParams<AddressFilter> & { enabled?: boolean };
export const useAddresses = (data: UseAddressParams = { enabled: true }) =>
    useQuery<CommonResponse<Address[]>, FetchError>({
        queryKey: ['addresses', data],
        queryFn: () => apiClient.post(`${ADDRESS_URL}:search`, { data }),
        enabled: data.enabled,
    });

export const useCreateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Address>, FetchError, AddressMutate>(
        data => apiClient.post(ADDRESS_URL, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries('addresses'),
        }
    );
};

export const useUpdateAddress = () =>
    useMutation<CommonResponse<Customer>, FetchError, Address>(({ id, ...data }) =>
        apiClient.put(`${ADDRESS_URL}/${id}`, { data })
    );

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<Customer>, FetchError, number>(id => apiClient.delete(`${ADDRESS_URL}/${id}`), {
        onSuccess: () => queryClient.invalidateQueries('addresses'),
    });
};

export const useSetDefaultAddress = () =>
    useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.post(`${ADDRESS_URL}/${id}:set-as-default`));
