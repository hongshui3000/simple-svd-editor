import { CommonResponse, CommonSearchParams } from '@api/common/types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient, FetchError } from '../index';
import { CountryData, CountryDataWithId, CountryFiltres, Country } from './types';

const COUNTRIES_BASE_URL = 'catalog/countries';
const COUNTRIES_KEY = 'countries';

const useGetCountries = (data: CommonSearchParams<CountryFiltres>) =>
    useQuery<CommonResponse<Country[]>, FetchError>({
        queryKey: [COUNTRIES_KEY, data],
        queryFn: () => apiClient.post(`${COUNTRIES_BASE_URL}:search`, { data }),
    });

const usePostCountry = () => {
    const queryClient = useQueryClient();
    return useMutation<CommonResponse<Country>, FetchError, CountryData>(
        data => apiClient.post(COUNTRIES_BASE_URL, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries(COUNTRIES_KEY),
        }
    );
};

const usePutCountry = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<Country>, FetchError, CountryDataWithId>(
        data => apiClient.put(`${COUNTRIES_BASE_URL}/${data.id}`, { data }),
        {
            onSuccess: () => queryClient.invalidateQueries(COUNTRIES_KEY),
        }
    );
};

const useRemoveCountry = () => {
    const queryClient = useQueryClient();

    return useMutation<CommonResponse<null>, FetchError, number | string>(
        id => apiClient.delete(`${COUNTRIES_BASE_URL}/${id}`),
        {
            onSuccess: () => queryClient.invalidateQueries(COUNTRIES_KEY),
        }
    );
};

export { useGetCountries, usePostCountry, usePutCountry, useRemoveCountry };
