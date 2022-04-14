import { MILISECONDS_IN_SECOND } from '@scripts/constants';

export const AuthLocalStorageKeys = {
    TOKEN: 'auth-access-token',
    REFRESH_TOKEN: 'auth-refresh-token',
    EXPIRES_IN: 'auth-expires-in',
    EXPIRES_AT: 'auth-expires-at',
};

export interface LoginData {
    data: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    };
}

export const getAuthInfoFromLocalStorage = () => {
    const expires_at = localStorage.getItem(AuthLocalStorageKeys.EXPIRES_AT);
    const refresh_token = localStorage.getItem(AuthLocalStorageKeys.REFRESH_TOKEN) || '';
    const access_token = localStorage.getItem(AuthLocalStorageKeys.TOKEN) || '';
    return { expires_at, refresh_token, access_token };
};

export const updateAuthInfo = (data: LoginData) => {
    const { expires_in, refresh_token, access_token } = data.data;
    localStorage.setItem(
        AuthLocalStorageKeys.EXPIRES_AT,
        (Date.now() / MILISECONDS_IN_SECOND + +expires_in).toString()
    );
    localStorage.setItem(AuthLocalStorageKeys.REFRESH_TOKEN, refresh_token);
    localStorage.setItem(AuthLocalStorageKeys.TOKEN, access_token);
    localStorage.setItem(AuthLocalStorageKeys.EXPIRES_IN, expires_in.toString());
    return data;
};

export const removeAuthInfo = () => {
    localStorage.removeItem(AuthLocalStorageKeys.EXPIRES_AT);
    localStorage.removeItem(AuthLocalStorageKeys.REFRESH_TOKEN);
    localStorage.removeItem(AuthLocalStorageKeys.TOKEN);
    localStorage.removeItem(AuthLocalStorageKeys.EXPIRES_IN);
};
