import { useQuery } from 'react-query';
import { CommonResponse, FetchError } from '@api/common/types';
import { apiClient } from '..';

export interface CurrentUser {
    id: number;
    full_name: string;
    short_name: string;
    active: boolean;
    login: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    email: string;
    phone: string;
    roles: number[];
}

export const useCurrentUser = () =>
    useQuery<CommonResponse<CurrentUser>, FetchError>({
        queryKey: 'curentUser',
        queryFn: () => apiClient.get(`auth/current-user`),
    });
