export interface AddressFilter {
    id?: number;
    customer_id?: number;
    /** Адрес по умолчанию */
    default?: boolean;
}
export interface AddressMutate {
    customer_id: number;
    address_string: string;
    default: boolean | null;
    post_index: string | null;
    country_code: string | null;
    region: string | null;
    region_guid: string | null;
    area: string | null;
    area_guid: string | null;
    city: string | null;
    city_guid: string | null;
    street: string | null;
    house: string | null;
    block: string | null;
    porch: number | null;
    intercom: string | null;
    floor: number | null;
    flat: number | null;
    comment: string | null;
    geo_lat: number | null;
    geo_lon: number | null;
}
export interface Address extends AddressMutate {
    id: number;
}
