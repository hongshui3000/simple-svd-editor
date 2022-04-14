import { OffsetPaginationQuery } from '@api/common/types';
import { Address } from '@api/orders/types';
import { Days } from '@scripts/enums';

export interface StoreListFilter {
    id?: number;
    seller_id?: number;
    name?: string;
    address_string?: string;
    contact_name?: string;
    contact_phone?: string;
}

export interface StoreWorkingMutate {
    store_id: number;
    day: Days;
    active?: boolean;
    working_start_time?: string;
    working_end_time?: string;
}

export interface StoreWorking extends StoreWorkingMutate {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface StoreContactMutate {
    store_id: number;
    name: string;
    phone?: string;
    email?: string;
}
export interface StoreContact extends StoreContactMutate {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface PickupTimeMutate {
    store_id: number;
    day: Days;
    pickup_time_code?: string;
    pickup_time_start?: string;
    pickup_time_end?: string;
    cargo_export_time?: string;
    delivery_service?: number;
}
export interface PickupTime extends PickupTimeMutate {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface Store {
    id: number;
    created_at: string;
    updated_at: string;
    seller_id: number;
    xml_id: string;
    active: boolean;
    name: string;
    address: Partial<Address>;
    timezone: string;
    workings: StoreWorking[];
    contacts: StoreContact[];
    pickup_times: PickupTime[];
}

export interface StoreListData {
    pagination?: OffsetPaginationQuery;
    filter?: StoreListFilter;
    sort?: ('id' | 'name' | 'address_string' | 'contact_name' | 'contact_phone')[];
    include?: ['contact'];
}

export interface StoreMutate {
    seller_id: number;
    name: string;
    xml_id?: string;
    active?: boolean;
    address?: Address;
    timezone?: string;
}
export interface StoreMutateWithId extends StoreMutate {
    id: number;
}
