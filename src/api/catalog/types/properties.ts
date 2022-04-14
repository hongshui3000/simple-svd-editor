export interface PropertyDirectoryItem {
    id: number;
    name: string;
    code: string;
    property_id: number;
}

export interface PropertyFields {
    name: string;
    display_name: string;
    type: string;
    is_multiple?: boolean;
    is_filterable?: boolean;
    is_color?: boolean;
}

export interface PropertyData extends PropertyFields {
    id: number;
}
export interface Property extends PropertyFields {
    id: number;
    code: string;
    directory: PropertyDirectoryItem[];
}
export interface PropertiesFilters {
    id?: number[];
    name?: string;
    code?: string[];
}
export interface DirectoryData {
    name: string;
    propertyId: number;
}

export interface ChangeDirectoryData {
    directoryId: number;
    name: string;
}

export enum QUERY_KEYS {
    PROPERTIES = 'properties',
    PROPERTY = 'property',
}
