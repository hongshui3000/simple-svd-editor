import { BasketItem } from './order-basket';
import { OrderListItemShipmentStatus } from './oms-enums';

export interface DeliveryTimeslot {
    id: number;
    from: string;
    to: string;
}
export interface Address {
    address_string?: string;
    post_index: string | null;
    country_code: string | null;
    region: string | null;
    region_guid: string | null;
    area: string | null;
    area_guid: string | null;
    city: string | null;
    city_guid: string;
    street: string | null;
    house: string | null;
    block: string | null;
    porch: number | null;
    intercom: string | null;
    floor: number | null;
    flat: string | null;
    comment: string | null;
    geo_lat: string | null;
    geo_lon: string | null;
}

export interface OrderShipment {
    id: number;
    number: string;
    status: number;
    status_at: string;
    is_problem: boolean;
    is_problem_at: string | null;
    delivery_service_zero_mile: number | null;
    is_canceled: boolean;
    is_canceled_at: string | null;
    cost: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    created_at: string;
    updated_at: string;
    delivery_id: number;
    seller_id: number;
    store_id: number;
    assembly_problem_comment: number | null;
    delivery: any;
    order_items: BasketItem[];
}

export interface OrderDelivery {
    id: number;
    order_id: number;
    number: string;
    status: OrderListItemShipmentStatus;
    status_at: string | null;
    cost: number;
    width: number;
    height: number;
    length: number;
    weight: number;
    created_at: string | null;
    updated_at: string | null;
    date: string | null;
    shipments: OrderShipment[];
    timeslot: DeliveryTimeslot;
}

export interface DeliveryChangeData {
    id: number;
    timeslot?: DeliveryTimeslot;
    date?: string;
}

export interface OrderDeliveryChange {
    delivery_service: number;
    delivery_method: number;
    delivery_cost: number;
    delivery_price: number;
    delivery_tariff_id: number | null;
    delivery_point_id: number | null;
    delivery_address: Address | null;
    delivery_comment: string | null;
}

export type OrderDeliveryChangeKeys = keyof OrderDeliveryChange;
