export interface ManufacturerFormData {
    name: string;
    code: string;
}
export interface ManufacturerItemFormData extends ManufacturerFormData {
    id: number;
}

export type Manufacturer = {
    id: number;
    created_at: string;
    name: string;
    code: string;
};
