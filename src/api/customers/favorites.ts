import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { Favorite, FavoriteMutate, FavoriteFilter } from './types';
import { apiClient, FetchError } from '..';

const FAVORITE_URL = 'crm/favorites';
const QUERY_KEY = 'favorites';

export const useFavorites = (data: CommonSearchParams<FavoriteFilter> & { enabled?: boolean } = { enabled: true }) =>
    useQuery<CommonResponse<Favorite[]>, FetchError>({
        queryKey: [QUERY_KEY, data],
        queryFn: () => apiClient.post(`${FAVORITE_URL}:search`, { data }),
        enabled: data.enabled,
    });

export const useCreateFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Favorite>, FetchError, FavoriteMutate>(
        data => apiClient.post(FAVORITE_URL, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
        }
    );
};

export const useDeleteFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<null>, FetchError, FavoriteMutate>(
        data => apiClient.post(`${FAVORITE_URL}:delete-product`, { data }),
        { onSuccess: () => queryClient.invalidateQueries(QUERY_KEY) }
    );
};

export const useDeleteAllFavorites = () =>
    useMutation<CommonResponse<null>, FetchError, FavoriteMutate>(() => apiClient.post(`${FAVORITE_URL}:clear`));
