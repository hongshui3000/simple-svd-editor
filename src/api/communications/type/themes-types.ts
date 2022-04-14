export interface ThemesFilter {
    filter?: object;
}
export interface NewTheme {
    name: string;
    active: boolean;
    channel: number[];
}
export interface Theme extends NewTheme {
    id: number;
}
