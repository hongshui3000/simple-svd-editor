export interface TypesFilter {
    filter?: object;
}
export interface NewType {
    name: string;
    active: boolean;
    channel: number[];
}
export interface Type extends NewType {
    id: number;
}
