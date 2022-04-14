import { ApiError } from '@api/common/types';
import { BannerButtonLocation, BannerButtonType, BannerCode } from '@scripts/enums';

export interface BannerButton {
    url: string;
    text: string;
    location: BannerButtonLocation;
    type: BannerButtonType;
    id: number;
}

export interface BannerType {
    id: number;
    code: BannerCode;
    active: boolean;
    name: string;
}

export interface Banner {
    id: number;
    desktop_image: string | null;
    tablet_image: string | null;
    mobile_image: string | null;
    name: string;
    active: boolean;
    type_id: number;
    button_id: number;
    button?: BannerButton;
    type?: BannerType;
}

export interface BannerCreateParams {
    name: string;
    active: boolean;
    type_id: number;
    button_id: null;
    button?: {
        [key in keyof Omit<BannerButton, 'id'>]: string;
    }
}

export interface BannerCreateImageParams {
    id: number;
    /**
     * @example
     * const formData = new FormData()
     * // тип image - File
     * formData.append('file', image);
     * formData.append('type', 'desktop' | 'mobile')
     */
    formData: FormData;
}

export interface BannerCreateResponse {
    data: Banner;
    errors?: ApiError[];
    meta: {};
}

export interface BannerFileUploadResponse {
    data: {
        url: string;
    };
    errors?: ApiError[];
    meta: {};
}