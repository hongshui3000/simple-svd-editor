import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';
import {
    MenuSearchOneParams,
    MenuSearchOneResponse,
    MenuSearchParams,
    MenuSearchResponse,
    MenuUpdateTreeParams,
    MenuUpdateTreeResponse,
} from './types/menus';

const MENU_BASE_URL = 'cms/menus';

export const useMenus = (data: MenuSearchParams) =>
    useQuery<MenuSearchResponse, FetchError>({
        queryKey: ['cms-menus', data],
        queryFn: () => apiClient.post(`${MENU_BASE_URL}:search`, { data }),
    });

export const useMenu = (data: MenuSearchOneParams) =>
    useQuery<MenuSearchOneResponse | undefined, FetchError>({
        enabled: typeof data.filter?.id === 'number',
        queryKey: [`cms-menu`, data.filter?.id],
        queryFn: () => {
            if (!data.filter?.id) return new Promise(resolve => resolve(undefined));
            return apiClient.post(`${MENU_BASE_URL}:search-one`, { data });
        },
    });

export const useUpdateMenuTree = () => {
    const queryClient = useQueryClient();

    return useMutation<
        MenuUpdateTreeResponse,
        FetchError,
        MenuUpdateTreeParams & {
            id: number;
        }
    >(data => apiClient.put(`${MENU_BASE_URL}/${data.id}/trees`, { data }), {
        onSuccess: () => {
            queryClient.invalidateQueries('cms-menus');
            queryClient.invalidateQueries('cms-menu');
        },
    });
};
