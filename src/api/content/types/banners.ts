import { OffsetPaginationQuery } from '@api/common/types';

export interface BannersFilter {}
export interface BannerTypesFilter {}

export type BannerData = {
    id: number;
    desktop_image: string;
    tablet_image: string;
    mobile_image: string;
    button_id: null | number;
    name: string;
    active: boolean;
    type_id: number;
    button: {
        url: string;
        text: string;
        location: string;
        type: string;
        id: number;
    },
    type: {
        id: number;
        code: string;
        active: boolean;
        name: string;
    }
}

export type BannerSearchResponse = {
    data: BannerData;
}

export type BannerTypesSearchResponseData = {
    id: number;
    code: string;
    active: boolean;
    name: string;
}

export type BannerCreateParams = {
    name: string;
    active: boolean;
    type_id: number;
    button: {
      url: string;
      text: string;
      location: string;
      type: string;
    }
}

export interface BannerDeleteAndMeta {
    data: null;
    meta: {};
}

export interface BannersSearchFilter {
    id?: number;
    name?: string;
    active?: boolean;
    type_id?: number;
    button_id?: number;
}
export interface BannersSearchParams {
    sort: (keyof BannersSearchFilter)[];
    filter?: BannersSearchFilter;
    include: ('type' | 'button')[];
    pagination: OffsetPaginationQuery;
}
