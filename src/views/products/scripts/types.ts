export enum ATTR_TYPES {
    STRING = 'string',
    INTEGER = 'integer',
    DOUBLE = 'double',
    BOOLEAN = 'boolean',
    DATETIME = 'datetime',
    LINK = 'link',
    DIRECTORY = 'directory',
}

export enum ATTR_PROPS {
    COLOR = 'color',
    FILTER = 'filter',
    FEW_VALUES = 'fewValues',
}

export interface DirectoryValueItem {
    value: string;
    name: string;
    code: string;
}
