export interface StatusesFilter {
    filter?: object;
}
export interface NewStatus {
    name: string;
    active: boolean;
    default: boolean;
    channel: number[];
}
export interface Status extends NewStatus {
    id: number;
}
