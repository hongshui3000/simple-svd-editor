import { OffsetPaginationQuery } from '@api/common/types';

export interface DiscountOffer {
    id?: number;
    discount_id: number;
    offer_id: number;
    except: boolean;
}

export interface DiscountBrand {
    id?: number;
    discount_id: number;
    brand_id: number;
    except: boolean;
}

export interface DiscountCategory {
    id?: number;
    discount_id: number;
    category_id: number;
}
export interface DiscountCondition {
    id?: number;
    discount_id: number;
    type: number;
    condition?: {};
}
export interface Discount {
    id?: number;
    name: string;
    type?: number;
    created_at?: string;
    start_date?: string;
    end_date?: string;
    seller_id?: number;
    user_id?: number;
    status: number;
    value_type: number;
    value: number;
    promo_code_only: boolean;
    offers?: DiscountOffer[];
    brands?: DiscountBrand[];
    categories?: DiscountCategory[];
    conditions?: DiscountCondition[];
}

export interface DiscountsData {
    filter?: {
        id?: number;
        seller_id?: number;
        user_id?: number;
        type?: number;
        name?: string;
        value_type?: number;
        value?: number;
        status?: number;
        start_date?: string;
        start_date_from?: string;
        end_date?: string;
        end_date_to?: string;
        created_at_from?: string;
        created_at_to?: string;
        is_unlimited?: boolean;
        promo_code_only?: boolean;
    };
    include?: [];
    pagination?: OffsetPaginationQuery;
}

export interface DiscountsStatusFormData {
    id: (number | undefined)[];
    status: number;
}

export interface DiscountStatus {
    id: number;
    name: string;
}
export interface DiscountType {
    id: number;
    name: string;
}
export interface DiscountConditionType {
    id: number;
    name: string;
    props: string[];
}

export interface DiscountConditionTypeProp {
    id: string;
    name: string;
    type: string;
}
