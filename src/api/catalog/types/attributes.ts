export interface ProductAttribute {
    directory: { id: number; name: string; code: string }[];
    property_id: number;
    value: (number | boolean | string)[];
}

export type CatalogPropertyType = 'string' | 'integer' | 'double' | 'boolean' | 'datetime' | 'link' | 'directory';

export interface Attributes {
    id: number;
    name: string;
    display_name: string;
    code: string;
    type: CatalogPropertyType;
    is_multiple: boolean;
    is_filterable: boolean;
    is_color: boolean;
    directory: {
        id: number;
        name: string;
        code: string;
    }[];
}
