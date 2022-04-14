import { OffsetPaginationQuery } from '@api/common/types';

export interface DeliveryKpiFormData {
    rtg: number;
    ct: number;
    ppt: number;
}
export interface DeliveryKpi extends DeliveryKpiFormData {
    created_at: string;
    updated_at: string;
}

export interface DeliveryKpiDataAndMeta {
    data: DeliveryKpi;
    meta: {};
}

export interface DeliveryKpiCt {
    seller_id: number;
    created_at: string;
    updated_at: string;
    ct: number;
}

export interface DeliveryKpiPpt {
    seller_id: number;
    created_at: string;
    updated_at: string;
    ppt: number;
}

export interface DeliveryKpiCtFilter {
    seller_id: number;
}

export interface DeliveryKpiPptFilter {
    seller_id: number;
}
export interface DeliveryKpiCtData {
    filter?: DeliveryKpiCtFilter;
    pagination?: OffsetPaginationQuery;
}
export interface DeliveryKpiPptData {
    filter?: DeliveryKpiPptFilter;
    pagination?: OffsetPaginationQuery;
}

export interface DeliveryKpiCtFormData {
    seller_id: number;
    ct: number;
}

export interface DeliveryKpiPptFormData {
    seller_id: number;
    ppt: number;
}
