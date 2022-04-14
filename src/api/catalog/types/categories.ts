export interface CategoriesFilter {
    id: number[];
    name: string;
    code: string[];
}

export interface Category {
    id: number;
    name: string;
    code: string;
    parent_id: number | null;
}
export interface CategoryFormData {
    name: string;
    code: string;
    parent_id: number | null;
}

export interface CategoryItemFormData extends CategoryFormData {
    id: number;
}
