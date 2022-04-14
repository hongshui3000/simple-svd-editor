import { OffsetPaginationQuery, OffsetPagination, ApiError, FileType } from '@api/common/types';

export interface BrandFilter {
    id?: string[];
    name?: string;
    code?: string;
}

export interface BrandsParams {
    filter?: BrandFilter;
    pagination?: OffsetPaginationQuery;
}

export interface BrandBase {
    name: string;
    code: string;
    description?: string;
}

export interface BrandBaseWithId extends BrandBase {
    id: number;
}

export interface Brand extends BrandBaseWithId {
    file?: FileType;
}

export interface BrandResponse<T> {
    data: T;
    meta: { pagination?: OffsetPagination };
    errors?: ApiError[];
}

export interface BrandsImageMutateParams {
    id: number;
    file: FormData;
}
