import { OffsetPaginationQuery } from '@api/common/types';

export interface DeliveryService {
    id: number;
    name: string;
    status?: number;
    priority?: number;
    statusName?: string;
    pct?: number;
}

export interface DeliveryServiceDetail extends DeliveryService {
    created_at?: string;
    do_consolidation?: boolean;
    do_deconsolidation?: boolean;
    do_zero_mile?: boolean;
    do_express_delivery?: boolean;
    do_return?: boolean;
    add_partial_reject_service?: boolean;
    add_return_service?: boolean;
    add_fitting_service?: boolean;
    add_insurance_service?: boolean;
    do_dangerous_products_delivery?: boolean;
    max_cargo_export_time?: string;
    add_open_service?: boolean;
    max_shipments_per_day?: number;
    payment_methods?: number[];
}

export interface DeliveryServicesFilter {
    id?: number;
    name?: string;
    status?: number;
    legal_info_company_name?: string;
    legal_info_inn?: string;
    legal_info_payment_account?: string;
    legal_info_bik?: string;
    legal_info_bank?: string;
    legal_info_bank_correspondent_account?: string;
    general_manager_name?: string;
    contract_number?: string;
    comment?: string;
    do_consolidation?: boolean;
    do_deconsolidation?: boolean;
    do_zero_mile?: boolean;
    do_express_delivery?: boolean;
    do_return?: boolean;
    do_dangerous_products_delivery?: boolean;
    add_partial_reject_service?: boolean;
    add_insurance_service?: boolean;
    add_fitting_service?: boolean;
    add_return_service?: boolean;
    add_open_service?: boolean;
}

export interface DeliveryServicesData {
    filter?: DeliveryServicesFilter;
    pagination?: OffsetPaginationQuery;
}

export interface DeliveryServiceStatus {
    id: number;
    name: string;
}
export interface DeliveryServicePaymentMethods {
    id: number;
    payment_methods: number[];
}
export interface DeliveryServicePaymentMethod {
    id: number;
    payment_method: number;
}
