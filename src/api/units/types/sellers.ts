import { OffsetPaginationQuery, OffsetPagination } from '@api/common/types';
import { Role } from './common';

export interface SellerFilter {
    created_at_from: string;
    created_at_to: string;
    status: number[];
    id: number;
    legal_name: string;
    owner_full_name: string;
    owner_email: string;
    owner_phone: string;
    manager_user_id: number[];
}

export interface SellerSearch {
    sort?: string[];
    include?: string[];
    pagination?: OffsetPaginationQuery;
    filter?: Partial<SellerFilter>;
}

export interface User {
    id: number;
    full_name: string;
    short_name?: string;
    created_at: string;
    updated_at: string;
    active?: boolean;
    login?: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    email?: string;
    phone?: string;
    timezone?: string;
    roles?: Role[];
    communication_way?: number;
    password?: string;
}

export interface SellerData {
    id?: number;
    legal_name?: string;
    external_id?: string;
    inn?: string;
    kpp?: string;
    legal_address?: string;
    fact_address?: string;
    payment_account?: string;
    bank?: string;
    bank_address?: string;
    bank_bik?: string;
    status?: string;
    manager_id?: number;
    rating_id?: number;
    correspondent_account?: string;
    storage_address?: string;
    site?: string;
    can_integration?: boolean;
    sale_info?: string;
    city?: string;
}

export interface SellerDataWithId {
    body: SellerData;
    id: number;
}

export interface Seller extends SellerData {
    id: number;
    status_at: string;
    created_at: string;
    updated_at: string;
    owner: User;
    manager: User;
}

export interface SellersResponse {
    data: Seller[];
    meta: {
        pagination: OffsetPagination;
    };
}

export interface SellerResponse {
    data: Seller;
    meta: {};
}

export interface SellerDigest {
    products_count: number;
    accepted_orders_count: number;
    delivered_orders_count: number;
    sold_orders_count: number;
}

export interface SellerRowData {
    registrationDate?: string[];
    status?: string;
    id: number;
    organizationName: { name: string; to: string };
    contactName?: string;
    email?: string;
    phone?: string;
    manager?: number;
}
