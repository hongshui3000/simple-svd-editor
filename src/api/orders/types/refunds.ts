import { Order } from './order';
import { BasketItem } from './order-basket';

export interface RefundMutateData {
    status: number;
    responsible_id: number | null;
    rejection_comment: string | null;
}

export interface RefundReason {
    id: number;
    created_at: string;
    updated_at: string;
    code: string;
    name: string;
    description: string | null;
}

export interface RefundFile {
    id: number;
    refund_id: number;
    original_name: string;
    file: { description: string };
    created_at: string;
    updated_at: string;
}

export interface Refund {
    id: number;
    price: number;
    is_partial: boolean;
    files: RefundFile[];
    created_at: string;
    updated_at: string;
    status: number;
    responsible_id: number | null;
    rejection_comment: string | null;
    order_id: number;
    manager_id: number | null;
    source: number;
    user_comment: string;
    order: Order;
    items: BasketItem[];
    reasons: RefundReason[];
}

export type RefundFilters = {
    id: number;
    order_id: number;
    manager_id: number;
    responsible_id: number;
    source: number[];
    status: number[];
};

export interface RefundCreateData {
    order_id: number;
    manager_id: number | null;
    source: number;
    user_comment: string;
    status: number;
    responsible_id: number | null;
    rejection_comment: string | null;
    order_items: { id: number; qty: number }[];
    refund_reason_ids: number[];
}

export interface RefundReasonCreate {
    code: string;
    name: string;
    description: string | null;
}

export type RefundsInclude = ('order' | 'items' | 'reasons' | 'files')[];
