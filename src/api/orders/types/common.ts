export interface OMSSettingsMutate {
    id: number | string;
    value: string;
    name: string;
}

export interface OMSSettings extends OMSSettingsMutate {
    code: string;
    created_at: string | null;
    updated_at: string | null;
}
