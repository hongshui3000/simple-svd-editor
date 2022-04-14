import { HttpCode, MILISECONDS_IN_SECOND, TOKEN_TIME_DIFF_SECONDS } from '@scripts/constants';

import { LoginData, getAuthInfoFromLocalStorage, updateAuthInfo, removeAuthInfo } from './auth/helpers';

import { CommonResponse, FetchError, Config } from './common/types';

export class APIClient {
    baseURL: string;

    readonly authURL = 'auth';

    checkRequest: Promise<LoginData> | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    static checkAuthorization(response: Response) {
        if (response.status === HttpCode.UNAUTHORIZED) {
            removeAuthInfo();
            window.location.assign(window.location.href);
        }
    }

    static async returnJSON(response: Response) {
        APIClient.checkAuthorization(response);

        const json: CommonResponse<any> = await response.json();

        if (!response.ok) {
            let errorMessage = 'Request failed';
            let errorCode = '';
            /** we must throw errors to allow react-query catch them in hooks */
            if (json.errors && json.errors.length > 0) {
                errorMessage = json.errors.map(e => e.message).join(` \n`);
                errorCode = [...new Set(json.errors.map(e => e.code))].join(` & `);
            }
            throw new FetchError(errorMessage, response.status, errorCode);
        }
        return json;
    }

    static async returnBlob(response: Response) {
        APIClient.checkAuthorization(response);
        return response.blob();
    }

    protected async unauthorizedClient(
        endpoint: string,
        { data, token, timeout = 10000, headers: customHeaders = {}, params, ...customConfig }: Config = {}
    ) {
        const endpoinWithParams = `${endpoint}${params ? `?${new URLSearchParams(params)}` : ''}`;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const config = {
            method: data ? 'POST' : 'GET',
            // eslint-disable-next-line no-nested-ternary
            body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
            headers: {
                ...(data && !(data instanceof FormData) && { 'Content-Type': 'application/json' }),
                ...(token && { Authorization: `Bearer ${token}` }),
                ...customHeaders,
            },
            ...customConfig,
            signal: controller.signal,
        };

        const response = await fetch(`${this.baseURL}${endpoinWithParams}`, config);
        clearTimeout(timer);

        return response;
    }

    protected async refreshToken(access_token: string, refresh_token: string): Promise<LoginData> {
        return this.unauthorizedClient(`${this.authURL}/refresh`, {
            data: { refresh_token },
            token: access_token,
        })
            .then(APIClient.returnJSON)
            .then(updateAuthInfo);
    }

    protected async checkToken() {
        let token = '';
        try {
            const timeNow = Math.floor(Date.now() / MILISECONDS_IN_SECOND);
            const { expires_at, refresh_token, access_token } = getAuthInfoFromLocalStorage();

            if (expires_at && refresh_token && +expires_at < timeNow - TOKEN_TIME_DIFF_SECONDS) {
                if (!this.checkRequest) {
                    this.checkRequest = this.refreshToken(access_token, refresh_token);
                }

                const result = await this.checkRequest;

                if (result) {
                    updateAuthInfo(result);
                    token = result.data.access_token;
                }

                this.checkRequest = null;
            } else if (access_token) {
                token = access_token;
            }
        } catch (e) {
            console.error(`Unable to check token: ${e}`);
        }

        return token;
    }

    public async request(endpoint: string, config?: Config) {
        const token = await this.checkToken();
        return this.unauthorizedClient(endpoint, { ...config, token }).then(APIClient.returnJSON);
    }

    public async get(endpoint: string, config?: Omit<Config, 'data'>) {
        return this.request(endpoint, { ...config, method: 'GET' });
    }

    public async post(endpoint: string, config?: Config) {
        return this.request(endpoint, { ...config, method: 'POST' });
    }

    public async patch(endpoint: string, config?: Config) {
        return this.request(endpoint, { ...config, method: 'PATCH' });
    }

    public async put(endpoint: string, config?: Config) {
        return this.request(endpoint, { ...config, method: 'PUT' });
    }

    public async delete(endpoint: string, config?: Config) {
        return this.request(endpoint, { ...config, method: 'DELETE' });
    }

    public async downloadFile(endpoint: string, config?: Config) {
        const token = await this.checkToken();
        return this.unauthorizedClient(endpoint, { ...config, token, method: 'POST' }).then(APIClient.returnBlob);
    }

    public async logIn({ login, password }: { login: string; password: string }): Promise<LoginData> {
        return this.unauthorizedClient(`${this.authURL}/login`, {
            data: { login, password },
        })
            .then(APIClient.returnJSON)
            .then(updateAuthInfo);
    }

    public async logOut() {
        return this.request(`${this.authURL}/logout`).then(removeAuthInfo);
    }
}

export const apiClient = new APIClient('/api/v1/');

export { FetchError };
