import { Product } from './products';
import { Attributes } from './attributes';

export interface VariantsFilter {
    id: number[];
}

export interface VariantMutate {
    product_ids: number[];
    attribute_ids: number[];
}
export interface Variant extends VariantMutate {
    id: number;
    created_at: string;
    updated_at: string;
    products: Product[];
    attributes: Attributes[];
}
