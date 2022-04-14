export interface UserFilter {
    id?: number | null;
    login?: string | null;
    active?: boolean | null;
}
export interface UserMutate {
    active: boolean;
    login: string;
    password: string;
}

export interface UserMutateWithId extends UserMutate {
    id: number;
}

export interface User extends UserMutateWithId {
    created_at: string;
    updated_at: string;
}

export type UserMutateOptional = Partial<UserMutate> & { id: number };
