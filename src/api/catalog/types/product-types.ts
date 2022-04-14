export interface ProductTypesFormData {
    name: string;
    code: string;
}
export interface ProductTypesItemFormData extends ProductTypesFormData {
    id: number;
}

export type ProductType = {
    id: number;
    created_at: string;
    name: string;
    code: string;
};
