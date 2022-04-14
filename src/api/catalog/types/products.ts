import { CommonResponse, CommonSearchParams, OffsetPagination, OffsetPaginationQuery } from '@api/common/types';
import { CatalogPropertyType, ProductAttribute } from './attributes';
import { Banner } from './banners';
import { Brand } from './brands';
import { PropertyDirectoryItem } from './properties';
import { Category } from './categories';
import { Country } from './countries';
import { Manufacturer } from './manufacturers';
import { ProductType } from './product-types';
import { ProductImage } from './product-image';

export interface ProductFilter {
    id: string[];
    name: string;
    code: string[];
    external_id: string[];
    category_id: number[];
    brand_id: number[];
    product_type_id: number[];
    created_at_from: string;
    created_at_to: string;
    price_from: number;
    price_to: number;
}
export interface Product {
    id: number;
    created_at: string;
    external_id: string;
    name: string;
    code: string;
    description: string;
    product_type_id: number;
    brand_id: number;
    category_id: number;
    manufacturer_id: number;
    country_id: number;
    barcode: string;
    weight: number;
    weight_gross: number;
    length: number;
    width: number;
    height: number;
    ingredients: string;
    is_new: boolean;
    archive: number;
    sale_active: boolean;
    cost: number;
    price: number;
    brand: Brand;
    country: Country;
    manufacturer: Manufacturer;
    type: ProductType;
    category: Category;
    images: ProductImage[];
    attributes: ProductAttribute[];
}

export interface ProductProp {
    data: Product[];
    meta: {
        pagination: OffsetPagination;
    };
}

export interface ProductAttributeValue {
    property_id: number;
    value: (number | boolean | string)[];
}

export interface ProductAttributeItem extends ProductAttributeValue {
    directory?: PropertyDirectoryItem[];
}

export interface ProductDetailBase {
    id: number;
    external_id: number;
    name: string;
    code: string;
    description?: string;
    product_type_id?: number;
    brand_id?: number;
    category_id?: number;
    manufacturer_id?: number;
    country_id?: number;
    barcode?: number;
    weight?: number;
    weight_gross: number;
    length?: number;
    width?: number;
    height?: number;
    ingredients?: string;
    is_new: boolean;
    archive?: number;
}
export interface ProductDetail extends ProductDetailBase {
    created_at: string;
    sale_active: boolean;
    cost: number;
    price: number;
    brand?: Brand;
    category: Category;
    images: ProductImage[];
    attributes?: ProductAttributeItem[];
}

export interface ProductsImageMutateParams {
    id: number;
    file: FormData;
}

export interface ProductGroupTypeFilter {
    id: number[];
    name: string;
    code: string[];
}

export interface ProductGroupFilterResponse {
    id: number;
    name: string;
    display_name: string;
    code: string;
    type: CatalogPropertyType;
    is_multiple: true;
    is_filterable: true;
    is_color: true;
    directory: {
        id: number;
        name: string;
        code: string;
    }[]
}

export interface ProductGroupTypeParams {
    sort: string[];
    filter?: ProductGroupTypeFilter;
    include: string[];
    pagination: OffsetPaginationQuery;
}

export enum ProductGroupCode {
    promo = 'promo',
    sets = 'sets',
    brands = 'brands',
}

export interface ProductGroupType {
    id: number;
    code: ProductGroupCode;
    name: string;
}

export type ProductGroupTypeResponse = CommonResponse<ProductGroupType[]>;

export interface ProductGroupSearchFilter {
    id?: number;
    name?: string;
    code?: string;
    active?: boolean;
    is_shown?: boolean;
    type_id?: number;
    banner_id?: number;
    category_code?: string;
    'products.product_id'?: number;
}

export interface ProductGroupFilter {
    code: string;
    value: string;
    id: number;
    product_group_id: number;
}

export type ProductGroupFilterParams = CommonSearchParams<Partial<{
    type: CatalogPropertyType,
    is_filterable: boolean,
}>> & {
    category: number | null;
}

export interface ProductGroupBase {
    name: string;
    code: string;
    active: boolean;
    is_shown: boolean;
    type_id: number;
    banner_id: number | null;
    category_code: string;
}

export interface ProductGroupProduct {
    sort: number;
    product_id: number;
}

export type ProductGroupCreateParams = ProductGroupBase & {
    products: ProductGroupProduct[];
    filters: {
        code: string;
        value: string;
    }[];
};

export type ProductGroup = ProductGroupBase & {
    id: number;
    preview_photo: string | null;
    filters?: ProductGroupFilter[];
    products?: {
        sort: number;
        product_id: number;
        id: number;
        product_group_id: number;
    }[],
    type?: ProductGroupType;
    banner?: Banner;
};

export interface ProductGroupSearchParams {
    sort: (keyof ProductGroupSearchFilter)[];
    filter?: ProductGroupSearchFilter;
    include: ('filters' | 'products' | 'type' | 'banner' | 'banner.button')[];
    pagination: OffsetPaginationQuery;
}

export type ProductGroupSearchResponse = CommonResponse<ProductGroup[]>;
export type ProductGroupSearchOneResponse = CommonResponse<ProductGroup>;
export type ProductGroupCreateResponse = CommonResponse<ProductGroup[]>;
