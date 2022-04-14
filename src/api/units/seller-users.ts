import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CommonResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import {
    SellerUserSearch,
    SellerUser,
    SellerUserMutateWithId,
    Role,
    SellerRoleAddFields,
    SellerRoleDeleteFields,
    SellerUserMutate,
} from './types';

const SELLER_USERS_BASE_URL = 'units/seller-users';
const QUERY_KEY_SELLERS = 'sellers-users';
const QUERY_KEY_SELLER = 'seller-user';

export const useGetSellerUsers = (data: SellerUserSearch = {}) =>
    useQuery<CommonResponse<SellerUser[]>, FetchError>({
        queryKey: [QUERY_KEY_SELLERS, data],
        queryFn: () => apiClient.post(`${SELLER_USERS_BASE_URL}:search`, { data }),
    });

export const useSellerUser = (id?: number | string) =>
    useQuery<CommonResponse<SellerUser>, FetchError>({
        queryKey: [QUERY_KEY_SELLER, id],
        queryFn: () => apiClient.get(`${SELLER_USERS_BASE_URL}/${id}`),
        enabled: !!id,
    });

export const usePostSellerUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<SellerUserMutateWithId>, FetchError, SellerUserMutate>(
        data => apiClient.post(SELLER_USERS_BASE_URL, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_SELLERS) }
    );
};

export const useUpdateSellerUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<SellerUser>, FetchError, SellerUserMutateWithId>(
        ({ id, ...data }) => apiClient.patch(`${SELLER_USERS_BASE_URL}/${id}`, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_SELLER) }
    );
};

export const useDeleteSellerUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(
        id => apiClient.delete(`${SELLER_USERS_BASE_URL}/${id}`),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_SELLERS) }
    );
};

export const useSellersRoles = (isOpen: boolean) =>
    useQuery<CommonResponse<Role[]>, FetchError>({
        queryKey: ['sellers-roles'],
        queryFn: () => apiClient.get(`seller-user-roles:search`),
        enabled: isOpen,
    });

export const useAddRoleSellerUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Role>, FetchError, SellerRoleAddFields>(
        ({ id, ...data }) => apiClient.post(`${SELLER_USERS_BASE_URL}/${id}:add-roles`, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_SELLER) }
    );
};

export const useDeleteRoleSellerUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Role>, FetchError, SellerRoleDeleteFields>(
        ({ id, ...data }) => apiClient.post(`${SELLER_USERS_BASE_URL}/${id}:delete-role`, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_SELLER) }
    );
};
