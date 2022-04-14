import { useQuery, useMutation } from 'react-query';
import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { apiClient, FetchError } from '../index';
import { Theme, ThemesFilter, NewTheme } from './type';

export const useCommunicationsThemes = (data: CommonSearchParams<ThemesFilter> = {}) =>
    useQuery<CommonResponse<Theme[]>, FetchError>({
        queryKey: ['communications-themes-search', data],
        queryFn: () => apiClient.post('communication/themes:search', { data }),
    });

export const useCommunicationsCreateTheme = () =>
    useMutation<CommonResponse<Theme>, FetchError, NewTheme>(newTheme =>
        apiClient.post('communication/themes', { data: newTheme })
    );

export const useCommunicationsUpdateTheme = () =>
    useMutation<CommonResponse<Theme>, FetchError, Theme>(theme =>
        apiClient.patch(`communication/themes/${theme.id}`, { data: theme })
    );

export const useCommunicationsDeleteTheme = () =>
    useMutation<CommonResponse<Theme>, FetchError, number>(themeId =>
        apiClient.delete(`communication/themes/${themeId}`)
    );
