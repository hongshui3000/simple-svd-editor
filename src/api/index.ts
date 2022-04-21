import { getHost } from '@scripts/helpers';

import { ApiError, CommonResponse, Config, FetchError } from './types';

export class APIClient {
    baseURL: string;

    readonly authURL = 'auth';

    // checkRequest: Promise<LoginData> | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    static async returnJSON(response: Response) {
        const json: CommonResponse<any, any> = await response.json();

        if (!response.ok) {
            let errorMessage = 'Request failed';
            let errorCode = '';
            /** we must throw errors to allow react-query catch them in hooks */
            if (json.errors && json.errors.length > 0) {
                errorMessage = json.errors?.map((e: ApiError) => e.message).join(` \n`);
                errorCode = [...new Set(json.errors?.map((e: ApiError) => e.code))].join(` & `);
            }
            throw new FetchError(errorMessage, response.status, errorCode);
        }
        return json;
    }

    static async returnBlob(response: Response) {
        return response.blob();
    }

    protected async unauthorizedClient(
        endpoint: string,
        { data, locale, token, headers: customHeaders = {}, params, ...customConfig }: Config = {}
    ) {
        const endpoinWithParams = `${endpoint}${params ? `?${new URLSearchParams(params)}` : ''}`;

        const config = {
            method: data ? 'POST' : 'GET',
            // eslint-disable-next-line no-nested-ternary
            body: data
                ? typeof window !== 'undefined' && data instanceof FormData
                    ? data
                    : JSON.stringify(data)
                : undefined,
            headers: {
                ...(data &&
                    !(typeof window !== 'undefined' && data instanceof FormData) && {
                        'Content-Type': 'application/json',
                    }),
                ...(token && { Authorization: `Bearer ${token}` }),
                'Accept-Language': locale || 'ru',
                ...customHeaders,
            },
            ...customConfig,
        };

        return fetch(`${this.baseURL}${endpoinWithParams}`, config);
    }

    public async request(endpoint: string, config?: Config) {
        // const token = await this.checkToken();
        return this.unauthorizedClient(endpoint, {
            ...config,
            // token
        }).then(APIClient.returnJSON);
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
        return this.unauthorizedClient(endpoint, {
            ...config,
            method: 'POST',
        }).then(APIClient.returnBlob);
    }
}

export const apiClient = new APIClient(`${getHost()}/api/v1/`);
export const apiFront = new APIClient('/api/api-front/');

export { FetchError };
