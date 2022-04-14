import { UseMutationResult, UseQueryResult } from 'react-query';
import { CommonResponse } from '@api/common/types';
import {
    useSellersRoles,
    useAdminRoles,
    useAddRoleSellerUser,
    useDeleteRoleSellerUser,
    Role,
    AdminRoleAddFields,
    SellerRoleAddFields,
    SellerRoleDeleteFields,
    AdminRoleDeleteFields
} from '@api/units';
import { useAddRoleAdminUser, useDeleteRoleAdminUser } from '@api/units/admin-users';
import { SYSTEMS } from '../types';

interface Fetches {
    useRoles: (isOpen: boolean) => UseQueryResult<CommonResponse<Role[]>, Error>;
    useAddRole: () => UseMutationResult<CommonResponse<Role>, Error, SellerRoleAddFields | AdminRoleAddFields, unknown>;
    useDeleteRole: () => UseMutationResult<CommonResponse<Role>, Error, SellerRoleDeleteFields | AdminRoleDeleteFields, unknown>
}

export const useGetRolesRequests = (system: SYSTEMS) => {
    let fetches: Fetches;

    switch (system) {
        case SYSTEMS.SELLERS:
            fetches = {
                useRoles: useSellersRoles,
                useAddRole: useAddRoleSellerUser,
                useDeleteRole: useDeleteRoleSellerUser
            }
            break;
        default:
        case SYSTEMS.ADMIN:
            fetches = {
                useRoles: useAdminRoles,
                useAddRole: useAddRoleAdminUser,
                useDeleteRole: useDeleteRoleAdminUser
            }
            break;
    }

    return fetches;
};
