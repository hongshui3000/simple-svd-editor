export interface Country {
    id?: number;
    created_at?: string;
    name: string;
    code: string;
}
export interface CountryData {
    name: string;
    code: string;
}
export interface CountryDataWithId extends CountryData {
    id: number;
}
export interface CountryFiltres {
    id: number[];
    name: string;
    code: string[];
}
