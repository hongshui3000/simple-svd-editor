import { OffsetPaginationQuery } from '@api/common/types';

export interface DeliveryMethod {
    id: number;
    name: string;
}

export interface Region {
    id: number;
    federal_district_id: number;
    name: string;
    guid: string;
}

export interface FederalDistrict {
    id: number;
    name: string;
    regions?: Region[];
}

export interface DeliveryPrice {
    id: number;
    federal_district_id: number;
    region_id: number;
    delivery_service: number;
    delivery_method: number;
    /** в копейках! */
    price: number;
    federal_district: FederalDistrict;
    region?: Region;
}

export interface DeliveryPricesFilter {
    id?: number;
    federal_district_id?: string;
    region_id?: number;
    delivery_service?: number;
    delivery_method?: number;
}

export interface DeliveryPricesData {
    filter?: DeliveryPricesFilter;
    include?: string[];
    pagination?: OffsetPaginationQuery;
}

export interface DeliveryMethodsDataAndMeta {
    data: DeliveryMethod[];
    meta: {};
}

export interface DeliveryPriceFormData {
    id?: number;
    federal_district_id: number;
    region_id?: number | null;
    region_guid?: string | null;
    delivery_service: number;
    delivery_method: number;
    price: number;
}

export interface FederalDistrictsData {
    filter?: {
        id: number;
    };
}

export interface RegionsData {
    filter?: {
        federal_district_id?: number;
    };
}
