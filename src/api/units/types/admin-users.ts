import { OffsetPaginationQuery } from '@api/common/types';
import { Role } from './common';

export interface AdminUserMutate {
    active?: boolean;
    login?: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    email: string;
    phone: string;
    timezone?: string;
}

export interface AdminUserMutateWithId extends AdminUserMutate {
    id: number;
}

export interface AdminUser extends AdminUserMutateWithId {
    full_name: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

export interface AdminUserFilter {
    email?: string;
    phone?: string;
    id?: number | number[];
    login?: string;
    active?: boolean;
    role?: number;
}

export interface AdminUserSearch {
    sort?: string[];
    include?: string[];
    pagination?: OffsetPaginationQuery;
    filter?: AdminUserFilter;
}

export interface AdminRoleAddFields {
    id: number;
    roles: number[];
    expires: string;
}

export interface AdminRoleDeleteFields {
    id: number;
    role_id: number;
}
