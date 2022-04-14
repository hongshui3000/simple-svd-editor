import { Product } from '@api/catalog/types/';

export interface ProductData {
    weight: number;
    weight_gross: number;
    width: number;
    height: number;
    length: number;
    external_id: number;
    storage_address: string;
    storage_area: string;
    barcode: string;
}

export interface Directory {
    id: number;
    name: string;
    code: string;
}

export interface ProductAttr {
    directory: Directory[];
    property_id: number;
    value: (number | boolean | string)[];
}

export interface BasketProduct extends Product {
    description: string;
    product_type_id: number;
    brand_id: number;
    category_id: number;
    manufacturer_id: number;
    country_id: number;
    weight_gross: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    ingredients: string;
    is_new: boolean;
    archive: number;
    sale_active: boolean;
    attributes: ProductAttr[];
}
export interface BasketItem {
    id: number;
    order_id: number;
    shipment_id: number;
    offer_id: number;
    name: string;
    qty: number;
    price: number;
    price_per_one: number;
    cost: number;
    cost_per_one: number;
    refund_qty: number | null;
    product_data: ProductData;
    created_at: number;
    updated_at: number;
    product: BasketProduct;
}
