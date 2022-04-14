import { CommonResponse } from '@api/common/types';
import { useMutation } from 'react-query';
import { apiClient, FetchError } from '..';
import { BannerCreateResponse, BannerCreateParams, BannerCreateImageParams } from './types/banners';

const BASE_URL = 'cms/banners';

export const useCreateProductGroupBanner = () =>
    useMutation<BannerCreateResponse, FetchError, BannerCreateParams>(data => apiClient.post(`${BASE_URL}`, { data }));

export const useUpdateProductGroupBanner = () =>
    useMutation<
        BannerCreateResponse,
        FetchError,
        BannerCreateParams & {
            id: number;
        }
    >(data => apiClient.put(`${BASE_URL}/${data.id}`, { data }));

export const useUploadProductGroupBannerFile = () =>
    useMutation<{ data: { url: string } }, FetchError, BannerCreateImageParams>(data =>
        apiClient.post(`${BASE_URL}/${data.id}:upload-file`, {
            data: data.formData,
        })
    );

export const useDeleteProductGroupBannerFile = () =>
    useMutation<
        BannerCreateResponse,
        FetchError,
        {
            id: number;
            /**
             * @example
             * const formData = new FormData()
             * formData.append('type', 'desktop' | 'mobile')
             */
            formData: FormData;
        }
    >(data =>
        apiClient.post(`${BASE_URL}/${data.id}:delete-file`, {
            data: data.formData,
        })
    );

export const useDeleteProductGroupBanner = () =>
    useMutation<CommonResponse<null>, FetchError, number | string>(id => apiClient.delete(`${BASE_URL}/${id}`));
