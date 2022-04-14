import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { User, UserFilter, UserMutate, UserMutateOptional } from './types';
import { apiClient, FetchError } from '..';

const USER_URL = 'customers/users';
const QUERY_KEY_USERS = 'users';
const QUERY_KEY_USER = 'user';

export const useUsers = (data: CommonSearchParams<UserFilter> = {}) =>
    useQuery<CommonResponse<User[]>, FetchError>({
        queryKey: [QUERY_KEY_USERS, data],
        queryFn: () => apiClient.post(`${USER_URL}:search`, { data }),
    });

export const useUserSearchOne = (data: CommonSearchParams<UserFilter> & { enabled: boolean } = { enabled: true }) =>
    useQuery<CommonResponse<User>, FetchError>({
        queryKey: [QUERY_KEY_USER, data],
        queryFn: () => apiClient.post(`${USER_URL}:search-one`, { data }),
        enabled: data.enabled,
    });

/** include - Связанные сущности для подгрузки, через запятую */
export const useUser = (id: number, include?: string) =>
    useQuery<CommonResponse<User>, FetchError>({
        queryKey: [QUERY_KEY_USER, id],
        queryFn: () => apiClient.get(`${USER_URL}/${id}${include ? `?include=${include}` : ''}`),
    });

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<User>, FetchError, UserMutate>(data => apiClient.post(USER_URL, { data }), {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_USERS),
    });
};
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<User>, FetchError, UserMutateOptional>(
        ({ id, ...data }) => apiClient.patch(`${USER_URL}/${id}`, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_USER),
        }
    );
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<null>, FetchError, number>(id => apiClient.delete(`${USER_URL}/${id}`), {
        onSuccess: () => queryClient.invalidateQueries(QUERY_KEY_USERS),
    });
};
