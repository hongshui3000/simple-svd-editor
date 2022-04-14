import { OffsetPaginationQuery } from '@api/common/types';
import { Role } from './common';

export interface SellerUserMutate {
    seller_id?: number;
    active?: boolean;
    login?: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    email?: string;
    phone?: string;
    timezone?: string;
    communication_way?: number;
    password?: string;
}

export interface SellerUserMutateWithId {
    id: number;
    body: SellerUserMutate;
}

export interface SellerUser extends SellerUserMutate{
    id: number;
    full_name: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}

export interface SellerUserFilter {
    full_name?: string;
    email?: string;
    phone?: string;
    id?: number;
    login?: string;
    status?: boolean;
    communication_way?: number;
    seller_id?: number;
    active?: boolean;
}

export interface SellerUserSearch {
    sort?: string[];
    include?: string[];
    pagination?: OffsetPaginationQuery;
    filter?: SellerUserFilter;
}

export interface SellerRoleAddFields {
    id: number;
    roles: number[];
    expires: string;
}

export interface SellerRoleDeleteFields {
    id: number;
    role_id: number;
}
