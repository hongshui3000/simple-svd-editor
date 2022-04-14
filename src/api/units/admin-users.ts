import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CommonResponse, FilterResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import {
    AdminUserSearch,
    AdminUser,
    AdminUserMutateWithId,
    Role,
    AdminRoleAddFields,
    AdminRoleDeleteFields,
} from './types';

const ADMIN_USERS_BASE_URL = 'units/admin-users';
const QUERY_KEY_ADMINS = 'admin-users';
const QUERY_KEY_ADMIN = 'admin-user';

export const useAdminUsers = (data: AdminUserSearch) =>
    useQuery<CommonResponse<AdminUser[]>, FetchError>({
        queryKey: [QUERY_KEY_ADMINS, data],
        queryFn: () => apiClient.post(`${ADMIN_USERS_BASE_URL}:search`, { data }),
    });

export const useAdminUser = (id: number | undefined | null) =>
    useQuery<CommonResponse<AdminUser>, FetchError>({
        queryKey: [QUERY_KEY_ADMIN, id],
        queryFn: () => apiClient.get(`${ADMIN_USERS_BASE_URL}/${id}`),
        enabled: !!id,
    });

export const useCreateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<AdminUser>, FetchError, AdminUser>(
        data => apiClient.post(ADMIN_USERS_BASE_URL, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_ADMINS) }
    );
};

export const useUpdateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<AdminUser>, FetchError, AdminUserMutateWithId>(
        ({ id, ...data }) => apiClient.patch(`${ADMIN_USERS_BASE_URL}/${id}`, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_ADMIN) }
    );
};

export const useDeleteAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number>(
        id => apiClient.delete(`${ADMIN_USERS_BASE_URL}/${id}`),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_ADMINS) }
    );
};

export const useAdminRoles = (isOpen: boolean) =>
    useQuery<CommonResponse<Role[]>, FetchError>({
        queryKey: ['admin-roles'],
        queryFn: () => apiClient.get(`admin-user-roles:search`),
        enabled: isOpen,
    });

export const useAddRoleAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Role>, FetchError, AdminRoleAddFields>(
        ({ id, ...data }) => apiClient.post(`${ADMIN_USERS_BASE_URL}/${id}:add-roles`, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_ADMIN) }
    );
};

export const useDeleteRoleAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Role>, FetchError, AdminRoleDeleteFields>(
        ({ id, ...data }) => apiClient.post(`${ADMIN_USERS_BASE_URL}/${id}:delete-role`, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_ADMIN) }
    );
};

export const getAdminUserEnumValues = async (query: string) => {
    const result: CommonResponse<FilterResponse> = await apiClient.post('units/admin-user-enum-values:search', {
        data: {
            filter: {
                query,
                id: [],
            },
        },
    });
    if (result && result.data) {
        return result.data.map(i => ({
            value: i.id,
            label: i.title,
        }));
    }
    return [];
};
