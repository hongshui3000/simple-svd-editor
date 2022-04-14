import { DadataSuggestion } from './types';

export const getSuggestions = (query = '') => {
    const url = `/api/addresses?query=${encodeURIComponent(query)}`;
    return fetch(url).then(res => res.json());
};

export const loadAddresses = async (inputValue: string) => {
    const res: DadataSuggestion[] = await getSuggestions(inputValue);
    return res?.map(suggestion => ({ label: suggestion.value, value: suggestion })) || [];
};
