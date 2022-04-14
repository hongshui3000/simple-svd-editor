import { Customer } from '@api/customers';
import { OrderDelivery, Address } from './order-delivery';
import { OrderListItemPaymentStatus, OrderStatus, OrderListFilterPaymentMethod } from './oms-enums';

export interface OrderResponsible {
    id: number;
    full_name: string;
    short_name: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    login: string;
    last_name: string | null;
    first_name: string | null;
    middle_name: string | null;
    email: string;
    phone: string;
    timezone: string;
    roles: { id: number; title: string; expires: string | null }[];
}

export interface OrderFile {
    id: number;
    order_id: number;
    original_name: string;
    file: { description: string };
    created_at: string;
    updated_at: string;
}
export interface Order {
    id: number;
    number: string;
    customer_id: number | null;
    customer_email: string;
    cost: number;
    price: number;
    spent_bonus: number;
    promo_code: string;
    added_bonus: number;
    source: number;
    status_at: string | null;
    payment_status: OrderListItemPaymentStatus;
    payment_status_at: string | null;
    payed_at: string | null;
    payment_expires_at: string | null;
    payment_method: number;
    payment_system: number;
    payment_link: string | null;
    payment_external_id: string | null;
    is_problem_at: string | null;
    is_expired: boolean;
    is_expired_at: string | null;
    is_return: boolean;
    is_return_at: string | null;
    is_partial_return: boolean;
    is_partial_return_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    status: OrderStatus;
    responsible_id: number | null;
    responsible?: OrderResponsible;
    client_comment: string | null;
    receiver_name?: string | null;
    receiver_phone?: string | null;
    receiver_email?: string | null;
    is_problem: boolean | null;
    problem_comment: string | null;
    delivery_service: number;
    delivery_method: number;
    delivery_cost: number;
    delivery_price: number;
    delivery_tariff_id: number | null;
    delivery_point_id: number | null;
    delivery_address: Address | null;
    delivery_comment: string | null;
    deliveries?: OrderDelivery[];
    customer?: Customer;
    files: OrderFile[];
}

export type OrderKeys = keyof Order;

export type OrderSearchSort = ('number' | 'created_at' | 'price' | 'delivery_price')[];

export type OrderPrices = ('price' | 'delivery_price' | 'cost' | 'delivery_cost')[];

export interface OrderChangeData {
    id: number;
    responsible_id?: number | null;
    status?: number;
    client_comment?: string;
    receiver_name?: string;
    receiver_phone?: string;
    receiver_email?: string;
    is_problem?: boolean;
    problem_comment?: string;
}

export interface OrderSearchFilter {
    number_like?: string;
    created_at_from?: string;
    created_at_to?: string;
    status?: OrderStatus;
    payment_method?: OrderListFilterPaymentMethod;
    price_from?: number;
    price_to?: number;
    'deliveries.shipments.seller_id'?: number[];
    'deliveries.shipments.store_id'?: number[];
    delivery_service?: number[];
    is_problem?: boolean;
    manager_comment_like?: string;
}

export type OrderSearchInclude = (
    | 'files'
    | 'deliveries'
    | 'deliveries.shipments'
    | 'deliveries.shipments.orderItems'
    | 'customer'
    | 'customer.user'
    | 'orderItems.product'
    | 'orderItems.product.images'
    | 'orderItems.product.category'
    | 'orderItems.product.brand'
    | 'responsible'
)[];
