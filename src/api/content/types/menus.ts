import { CommonResponse, OffsetPaginationQuery } from "@api/common/types";

export type MenuSort = 'id' | '-id';

export interface MenuFilter {
    id?: number;
    code?: string;
}

export type MenuInclude = 'items';

export interface MenuSearchBase {
    sort: MenuSort[];
    filter?: MenuFilter;
    include: MenuInclude[];
}

export type MenuSearchParams = MenuSearchBase & {
    pagination: OffsetPaginationQuery;
}

export type MenuSearchOneParams = MenuSearchBase;

export enum MenuCode {
    header_main = 'header_main',
    header_help = 'header_help',
    footer_main = 'footer_main',
}

export interface MenuItemBase {
    url: string;
    name: string;
}

export type MenuItem = MenuItemBase & {
    id: number;
    menu_id: number;
    _lft: number;
    _rgt: number;
    parent_id: number;
};

export type MenuTreeItem = MenuItemBase & {
    children: MenuTreeItem[];
}

export interface Menu {
    id: number;
    name: string;
    code: MenuCode;
    items: MenuItem[];
    itemsTree: MenuTreeItem[];
}

export interface MenuUpdateTreeParams {
    items: MenuTreeItem[];
}

export type MenuUpdateTreeResponse = CommonResponse<MenuUpdateTreeParams>;
export type MenuSearchResponse = CommonResponse<Menu[]>;
export type MenuSearchOneResponse = CommonResponse<Menu>;