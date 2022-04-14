import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CommonSearchParams, CommonResponse } from '@api/common/types';
import { apiClient } from '../index';
import {
    BannersFilter,
    BannerTypesFilter,
    BannerData,
    BannerSearchResponse,
    BannerTypesSearchResponseData,
    BannerCreateParams,
    BannersSearchParams,
    BannerDeleteAndMeta,
} from './types/banners';

export const useBanners = (data: CommonSearchParams<BannersFilter>) =>
    useQuery<CommonResponse<BannerData[]>, Error>({
        queryKey: ['banners', data],
        queryFn: () => apiClient.post('cms/banners:search', { data }),
    });

export const useBanner = (data: BannersSearchParams) =>
    useQuery<BannerSearchResponse | undefined, Error>({
        enabled: typeof data.filter?.id === 'number',
        queryKey: [`banners-${data.filter?.id || -1}`, data.filter?.id],
        queryFn: () => apiClient.post(`cms/banners:search-one`, { data }),
    });

export const useCreateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation<BannerSearchResponse, Error, BannerCreateParams>(
        data => apiClient.post('cms/banners', { data }),
        {
            onSuccess: () => queryClient.invalidateQueries('banners'),
        }
    );
};

export const useUpdateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation<
        BannerSearchResponse,
        Error,
        BannerCreateParams & {
            id: number;
        }
    >(data => apiClient.put(`cms/banners/${data.id}`, { data }), {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries('banners');
            queryClient.invalidateQueries(`banners-${data.id}`);
        },
    });
};

export const useDeleteBanner = () => {
    const queryClient = useQueryClient();

    return useMutation<
        BannerDeleteAndMeta,
        Error,
        {
            id: number;
        }
    >(({ id }) => apiClient.delete(`cms/banners/${id}`), {
        onSuccess: () => {
            queryClient.invalidateQueries('banners');
        },
    });
};

export const useUploadBannerFile = () =>
    useMutation<
        {
            data: {
                url: string;
            };
        },
        Error,
        {
            id: number;
            formData: FormData;
        }
    >(data =>
        apiClient.post(`cms/banners/${data.id}:upload-file`, {
            data: data.formData,
        })
    );

export const useDeleteBannerFile = () =>
    useMutation<
        CommonResponse<null>,
        Error,
        {
            id: number;
            formData: FormData;
        }
    >(data =>
        apiClient.post(`cms/banners/${data.id}:delete-file`, {
            data: data.formData,
        })
    );

export const useBannerTypes = (data: CommonSearchParams<BannerTypesFilter>) =>
    useQuery<CommonResponse<BannerTypesSearchResponseData[]>, Error>({
        queryKey: ['cms-banner-types', data],
        queryFn: () => apiClient.post('cms/banner-types:search', { data }),
    });
