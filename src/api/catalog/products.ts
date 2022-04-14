import { CommonResponse, ApiError, CommonSearchParams } from '@api/common/types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';
import {
    ProductFilter,
    ProductDetail,
    ProductImage,
    ProductDetailBase,
    ProductAttributeValue,
    ProductGroupTypeParams,
    ProductGroupTypeResponse,
    ProductGroupSearchResponse,
    ProductGroupSearchParams,
    ProductGroupCreateResponse,
    ProductGroupCreateParams,
    ProductGroupSearchOneResponse,
    ProductsImageMutateParams,
    Product,
    ProductGroupFilterParams,
    ProductGroupFilterResponse,
} from './types';

const API_URL = 'catalog/products';

export const productsQueryFn = (data: CommonSearchParams<Partial<ProductFilter>>) =>
    apiClient.post(`${API_URL}:search`, {
        data,
    });

export const useProducts = (data: CommonSearchParams<Partial<ProductFilter>>, isEnabled = true) =>
    useQuery<CommonResponse<Product[]>, FetchError>({
        enabled: isEnabled,
        queryKey: ['products', data],
        queryFn: () => productsQueryFn(data),
    });

export const useProductGroupFilters = (data: ProductGroupFilterParams) => 
    useQuery<CommonResponse<ProductGroupFilterResponse[]>, FetchError>({
        enabled: typeof data.category === 'number',
        queryKey: ['product-group-filters', data],
        queryFn: () => apiClient.post(`cms/product-group-filters:search`, { data }),
    });

/** TODO методы cms должны лежать в соответствующей папочке api */
export const useProductGroupTypes = (data: ProductGroupTypeParams) =>
    useQuery<ProductGroupTypeResponse, FetchError>({
        queryKey: ['product-group-types', data],
        queryFn: () => apiClient.post(`cms/product-group-types:search`, { data }),
    });

export const useProductGroups = (data: ProductGroupSearchParams) =>
    useQuery<ProductGroupSearchResponse, FetchError>({
        queryKey: ['product-groups', data],
        queryFn: () => apiClient.post(`cms/product-groups:search`, { data }),
    });

export const useProductGroup = (data: ProductGroupSearchParams) =>
    useQuery<ProductGroupSearchOneResponse | undefined, FetchError>({
        enabled: typeof data.filter?.id === 'number',
        queryKey: [`product-group-${data.filter?.id || -1}`, data.filter?.id],
        queryFn: () => {
            if (!data.filter?.id) return new Promise(resolve => resolve(undefined));
            return apiClient.post(`cms/product-groups:search-one`, { data });
        },
    });

export const useCreateProductGroup = () => {
    const queryClient = useQueryClient();

    return useMutation<ProductGroupCreateResponse, FetchError, ProductGroupCreateParams>(
        data => apiClient.post('cms/product-groups', { data }),
        {
            onSuccess: () => queryClient.invalidateQueries('product-groups'),
        }
    );
};

export const useUpdateProductGroup = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ProductGroupSearchOneResponse,
        FetchError,
        ProductGroupCreateParams & {
            id: number;
        }
    >(data => apiClient.put(`cms/product-groups/${data.id}`, { data }), {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries('product-groups');
            queryClient.invalidateQueries(`product-group-${data.id}`);
        },
    });
};

export const useProductDetail = ({ id, include }: { id: string; include?: string }, enabled = true) =>
    useQuery<CommonResponse<ProductDetail>, FetchError>({
        queryKey: ['product', id, include],
        queryFn: () => apiClient.get(`${API_URL}/${id}${include ? `?include=${include}` : ''}`),
        enabled,
    });

export const useProductDetailUpdate = () =>
    useMutation<CommonResponse<ProductDetail>, FetchError, ProductDetailBase>(productData => {
        const { id, ...data } = productData;
        return apiClient.put(`${API_URL}/${id}`, { data });
    });

export const useProductDetailAttributesUpdate = () =>
    useMutation<CommonResponse<ProductDetail>, FetchError, { id: number; values: ProductAttributeValue[] }>(data => {
        const { id, values } = data;
        return apiClient.patch(`${API_URL}/${id}/attributes`, { data: { values } });
    });

export const useMutateProductDetailImageAdd = () =>
    useMutation<CommonResponse<ProductImage>, FetchError, { type: number; product_id: number }>(
        ({ type, product_id }) => apiClient.post(`${API_URL}/images`, { data: { type, product_id } })
    );

export const useMutateProductDetailImageUpload = () =>
    useMutation<CommonResponse<ProductImage>, FetchError, ProductsImageMutateParams>(({ id, file }) =>
        apiClient.post(`${API_URL}/images/${id}:upload-image`, { data: file })
    );

export const useMutateProductDetailImageDelete = () =>
    useMutation<CommonResponse<ProductImage>, FetchError, { id: number }>(({ id }) =>
        apiClient.delete(`${API_URL}/images/${id}`)
    );

export const useUploadProductGroupFile = () =>
    useMutation<
        CommonResponse<{
            url: string;
        }>,
        FetchError,
        {
            id: number;
            file: FormData;
        }
    >(({ id, file }) => apiClient.post(`cms/product-groups/${id}:upload-file`, { data: file }));

export const useDeleteProductGroupFile = () =>
    useMutation<
        CommonResponse<null>,
        FetchError,
        {
            id: number;
        }
    >(({ id }) => apiClient.post(`cms/product-groups/${id}:delete-file`));

export const useDeleteProductGroup = () => {
    const queryClient = useQueryClient();

    return useMutation<
        {
            data: null;
            errors?: ApiError[];
        },
        FetchError,
        {
            id: number;
        }
    >(({ id }) => apiClient.delete(`cms/product-groups/${id}`), {
        onSuccess: () => {
            queryClient.invalidateQueries('product-groups');
        },
    });
};
