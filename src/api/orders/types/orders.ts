import { OrderStatus, OrderListFilterPaymentMethod } from './oms-enums';

export interface OrderListFilter {
    number_like?: string;
    created_at_from?: string;
    created_at_to?: string;
    status?: OrderStatus;
    payment_method?: OrderListFilterPaymentMethod;
    price_from?: number;
    price_to?: number;
    'deliveries.shipments.seller_id'?: number[];
    'deliveries.shipments.store_id'?: number[];
    'deliveries.delivery_service'?: number[];
    is_problem?: boolean;
    manager_comment_like?: string;
    seller_id?: number;
}
