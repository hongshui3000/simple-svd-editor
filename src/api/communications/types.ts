import { useQuery, useMutation } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { Type, NewType, TypesFilter } from './type';

export const useCommunicationsTypes = (data: CommonSearchParams<TypesFilter> = {}) =>
    useQuery<CommonResponse<Type[]>, FetchError>({
        queryKey: ['communications-types-search', data],
        queryFn: () => apiClient.post('communication/types:search', { data }),
    });

export const useCommunicationsCreateType = () =>
    useMutation<CommonResponse<Type>, FetchError, NewType>(newType =>
        apiClient.post('communication/types', { data: newType })
    );

export const useCommunicationsUpdateType = () =>
    useMutation<CommonResponse<Type>, FetchError, Type>(type =>
        apiClient.patch(`communication/types/${type.id}`, { data: type })
    );

export const useCommunicationsDeleteType = () =>
    useMutation<CommonResponse<Type>, FetchError, number>(typeId => apiClient.delete(`communication/types/${typeId}`));
