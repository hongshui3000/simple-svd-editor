import { CustomerGender, CustomerStatus } from '@scripts/enums';
import { CommonOption } from '@api/common/types';
import { Address } from './addresses';
import { User } from './users';

export interface CustomersFilter {
    id?: number | null;
    user_id?: number | null;
    status?: CustomerStatus | null;
}

export interface CustomerMutate {
    user_id: number;
    status_id?: number | null;
    manager_id?: number | null;
    yandex_metric_id?: string | null;
    google_analytics_id?: string | null;
    attribute_ids?: number[] | null;
    active?: boolean;
    email: string;
    phone: string;
    last_name?: string | null;
    first_name?: string | null;
    middle_name?: string | null;
    gender?: CustomerGender | null;
    create_by_admin: boolean;
    city?: string | null;
    birthday?: string;
    last_visit_date?: string | null;
    comment_status?: string | null;
    timezone: string;
}
export interface CustomerMutateWithId extends CustomerMutate {
    id: number;
}
export interface Customer extends CustomerMutateWithId {
    avatar?: string;
    addresses?: Address;
    user?: User;
    status: CommonOption[];
    attributes: CommonOption[];
}
