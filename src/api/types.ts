export interface CursorPagination {
    cursor: string;
    limit: number;
    next_cursor: string;
    previous_cursor: string;
    type: 'cursor';
}

export interface OffsetPaginationQuery {
    limit: number;
    // type: 'offset';
    offset: number;
}

export interface OffsetPagination extends OffsetPaginationQuery {
    total: number;
}
export interface CommonOption {
    id: number;
    name: string;
}

export interface ApiError {
    code: string;
    message: string;
    meta?: {
        description: string;
    };
}

export interface FileType {
    /** relative path */
    path: string;
    /** file name */
    name: string;
    /** full url */
    url: string;
}
interface CommonResponseMeta {
    pagination?: OffsetPagination;
}
export interface CommonResponse<T, M = CommonResponseMeta> {
    data: T;
    meta: M;
    errors?: ApiError[];
}

export interface FileUpload {
    id: number;
    file: FormData;
}

export interface BaseParams {
    locale?: string;
}

export interface BaseAuthParams extends BaseParams {
    token: string;
}

export interface CommonSearchParams<F, S = string[], I = string[]> {
    filter?: F;
    sort?: S;
    include?: I;
    pagination?: OffsetPaginationQuery;
}

export class FetchError extends Error {
    constructor(public message: string, public status: number, public code: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export interface Config {
    token?: string;
    locale?: string;
    data?: any;
    headers?: Record<string, string>;
    params?: any;
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
}

export type Client = (endpoint: string, config?: Config) => Promise<any>;

export type FieldTypeEnum =
    | 'string'
    | 'email'
    | 'phone'
    | 'datetime'
    | 'date'
    | 'url'
    | 'int'
    | 'price'
    | 'float'
    | 'enum'
    | 'bool';

export type FieldFilterTypeEnum = 'default' | 'like' | 'many' | 'range';

export type MetaField = {
    code: string;
    name: string;
    list: boolean;
    type: FieldTypeEnum;
    enum_info: {
        endpoint: string;
        values: { id: string; title: string }[];
    };
    sort: boolean;
    sort_key: string;
    filter: FieldFilterTypeEnum | null;
    filter_range_key_from: string;
    filter_range_key_to: string;
    filter_key: string;
};

export type Meta = {
    fields: MetaField[];
    detail_link: string;
    default_sort: string;
    default_list: string[];
    default_filter: string[];
};

export type FilteredItem = { id: string; title: string };

export type FilterResponse = FilteredItem[];

export interface FilterSearchParam {
    filter: {
        query: string;
        id: (number | string)[];
    };
}
