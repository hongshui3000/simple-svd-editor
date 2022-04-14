import { useQuery, useMutation } from 'react-query';
import { CommonOption, CommonResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { SellerDataWithId, SellerData, SellerSearch, Seller, SellerDigest } from './types';

const SELLERS_BASE_URL = 'units/sellers';

const loadSellers = async (inputValue: string = '') => {
    try {
        const data: SellerSearch = { filter: { legal_name: inputValue } };
        const apiSellers: CommonResponse<Seller[]> = await apiClient.post(`${SELLERS_BASE_URL}:search`, { data });
        return apiSellers?.data.map(s => ({ value: s.id, label: s.legal_name || '' })) || [];
    } catch (e) {
        return [];
    }
};

const useGetSellers = (data: SellerSearch = {}) =>
    useQuery<CommonResponse<Seller[]>, FetchError>({
        queryKey: ['sellers', data],
        queryFn: () => apiClient.post(`${SELLERS_BASE_URL}:search`, { data }),
    });

const usePostSeller = () =>
    useMutation<CommonResponse<Seller>, FetchError, SellerData>(data => apiClient.post(SELLERS_BASE_URL, { data }));

const useGetSellerById = (id: number | string, include?: string) =>
    useQuery<CommonResponse<Seller>, FetchError>({
        queryKey: ['sellers', id],
        queryFn: () => apiClient.get(`${SELLERS_BASE_URL}/${id}`, include ? { params: { include } } : {}),
    });

const usePatchSeller = () =>
    useMutation<CommonResponse<Seller>, FetchError, SellerDataWithId>(data =>
        apiClient.patch(`${SELLERS_BASE_URL}/${data.id}`, { data: data.body })
    );

const usePutSeller = () =>
    useMutation<CommonResponse<Seller>, FetchError, SellerDataWithId>(data =>
        apiClient.put(`${SELLERS_BASE_URL}/${data.id}`, { data: data.body })
    );

const useGetSellerDigest = (id: number) =>
    useQuery<CommonResponse<SellerDigest>, FetchError>({
        queryKey: ['sellerDigest', id],
        queryFn: () => apiClient.get(`${SELLERS_BASE_URL}/${id}:digest`),
    });

const useGetSellerStatuses = () =>
    useQuery<CommonResponse<CommonOption[]>, FetchError>({
        queryKey: ['sellerStatuses'],
        queryFn: () => apiClient.get(`${SELLERS_BASE_URL}/statuses`),
    });

export {
    useGetSellers,
    usePostSeller,
    useGetSellerById,
    usePatchSeller,
    usePutSeller,
    useGetSellerDigest,
    useGetSellerStatuses,
    loadSellers,
};
