import { UseMutationResult, UseQueryResult } from 'react-query';
import { CommonResponse } from '@api/common/types';
import { useDeleteUser, User, useUpdateUser, useUser } from '@api/customers';
import {
    useAdminUser,
    useUpdateAdminUser,
    useDeleteAdminUser,
    useSellerUser,
    useUpdateSellerUser,
    useDeleteSellerUser,
    AdminUser,
    SellerUser,
} from '@api/units';
import { AdminUpdate, CustomerUpdate, SellerUpdate, SYSTEMS } from '../types';

interface Fetches {
    useUser: (id: number) => UseQueryResult<CommonResponse<AdminUser | SellerUser | User>, Error>;
    useUpdateUser: () => SellerUpdate | CustomerUpdate | AdminUpdate;
    useDeleteUser: () => UseMutationResult<CommonResponse<null>, Error, number, unknown>;
}

export const useGetRequests = (system: SYSTEMS) => {
    let fetches: Fetches;

    switch (system) {
        case SYSTEMS.SELLERS:
            fetches = {
                useUser: useSellerUser,
                useUpdateUser: useUpdateSellerUser,
                useDeleteUser: useDeleteSellerUser,
            }
            break;
        case SYSTEMS.CUSTOMERS:
            fetches = {
                useUser,
                useUpdateUser,
                useDeleteUser,
            }
            break;
        default:
        case SYSTEMS.ADMIN:
            fetches = {
                useUser: useAdminUser,
                useUpdateUser: useUpdateAdminUser,
                useDeleteUser: useDeleteAdminUser,
            }
            break;
    }

    return fetches;
};
