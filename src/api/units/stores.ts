import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CommonResponse } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import {
    StoreListData,
    Store,
    StoreMutate,
    StoreMutateWithId,
    StoreWorking,
    StoreWorkingMutate,
    PickupTime,
    PickupTimeMutate,
    StoreContact,
    StoreContactMutate,
} from './types';

const API_URL = 'units/stores';

export const useStores = (data: StoreListData = {}) =>
    useQuery<CommonResponse<Store[]>, FetchError>({
        queryKey: ['stores', data],
        queryFn: () => apiClient.post(`${API_URL}:search`, { data }),
    });

export const useCreateStore = () => {
    const { invalidateQueries } = useQueryClient();
    return useMutation<CommonResponse<Store>, FetchError, StoreMutate>(data => apiClient.post(API_URL, { data }), {
        onSuccess: () => invalidateQueries('stores'),
    });
};

export const useStore = (id: number | string | null | undefined, include?: string) =>
    useQuery<CommonResponse<Store>, FetchError>({
        queryKey: ['store', id],
        queryFn: () => apiClient.get(`${API_URL}/${id}`, include ? { params: { include } } : {}),
        enabled: !!id,
    });

export const usePatchStore = () => {
    const { invalidateQueries } = useQueryClient();
    return useMutation<CommonResponse<Store>, FetchError, Partial<StoreMutate> & { id: number }>(
        data => apiClient.patch(`${API_URL}/${data.id}`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const useUpdateStore = () => {
    const { invalidateQueries } = useQueryClient();
    return useMutation<CommonResponse<Store>, FetchError, StoreMutateWithId>(
        data => apiClient.put(`${API_URL}/${data.id}`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const useCreateStoreWorkings = () => {
    const { invalidateQueries } = useQueryClient();

    return useMutation<CommonResponse<StoreWorking>, FetchError, StoreWorkingMutate>(
        data => apiClient.post(`${API_URL}-workings`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const usePatchStoreWorkings = () => {
    const { invalidateQueries } = useQueryClient();
    return useMutation<CommonResponse<StoreWorking>, FetchError, Partial<StoreWorkingMutate> & { id: number | string }>(
        data => apiClient.patch(`${API_URL}-workings/${data.id}`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const useUpdateStoreWorkings = () => {
    const { invalidateQueries } = useQueryClient();
    return useMutation<CommonResponse<StoreWorking>, FetchError, StoreWorkingMutate & { id: number | string }>(
        data => apiClient.put(`${API_URL}-workings/${data.id}`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const useCreatePickupTimes = () => {
    const { invalidateQueries } = useQueryClient();

    return useMutation<CommonResponse<PickupTime>, FetchError, PickupTimeMutate>(
        data => apiClient.post(`${API_URL}-pickup-times`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const usePatchPickupTimes = () => {
    const { invalidateQueries } = useQueryClient();

    return useMutation<CommonResponse<PickupTime>, FetchError, Partial<PickupTimeMutate> & { id: number | string }>(
        data => apiClient.patch(`${API_URL}-pickup-times/${data.id}`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const useUpdatePickupTimes = () => {
    const { invalidateQueries } = useQueryClient();

    return useMutation<CommonResponse<PickupTime>, FetchError, PickupTimeMutate & { id: number | string }>(
        data => apiClient.put(`${API_URL}-pickup-times/${data.id}`, { data, method: 'PUT' }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const useCreateStoreContact = () => {
    const { invalidateQueries } = useQueryClient();

    return useMutation<CommonResponse<StoreContact>, FetchError, StoreContactMutate>(
        data => apiClient.post(`${API_URL}-contacts`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const usePatchStoreContact = () => {
    const { invalidateQueries } = useQueryClient();

    return useMutation<CommonResponse<StoreContact>, FetchError, Partial<StoreContactMutate> & { id: number | string }>(
        data => apiClient.patch(`${API_URL}-contacts/${data.id}`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const useUpdateStoreContact = () => {
    const { invalidateQueries } = useQueryClient();

    return useMutation<CommonResponse<StoreContact>, FetchError, StoreContactMutate & { id: number | string }>(
        data => apiClient.put(`${API_URL}-contacts/${data.id}`, { data }),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};

export const useDeleteStoreContact = () => {
    const { invalidateQueries } = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number | string>(
        id => apiClient.delete(`${API_URL}-contacts/${id}`),
        {
            onSuccess: () => {
                invalidateQueries('stores');
                invalidateQueries('store');
            },
        }
    );
};
