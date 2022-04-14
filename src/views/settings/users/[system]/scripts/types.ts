import { UseMutationResult } from 'react-query';
import { User, UserMutateOptional } from '@api/customers';
import { AdminUser, SellerUser, SellerUserMutateWithId, AdminUserMutateWithId } from '@api/units';
import { ActionType } from '@scripts/enums';
import { CommonResponse } from '@api/common/types';

export enum FORM_FIELDS {
    ID = 'id',
    FULL_NAME = 'full_name',
    EMAIL = 'email',
    PHONE = 'phone',
    LOGIN = 'login',
    STATUS = 'status',
    ACTIVE = 'active',
    SELLER_ID = 'seller_id',
    FIRST_NAME = 'first_name',
    LAST_NAME = 'last_name',
    MIDDLE_NAME = 'middle_name',
    PASSWORD = 'password',
    PASSWORD_CONFIRM = 'password_confirm',

    SHORT_NAME = 'short_name',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
    TIMEZONE = 'timezone',
    ROLE = 'role',
}

export enum SYSTEMS {
    ADMIN = 'admin',
    CUSTOMERS = 'customers',
    SELLERS = 'sellers',
}

export type State = {
    tableData?: (AdminUser | SellerUser | User)[];
    roleId?: number;
    action?: ActionType;
    open?: boolean;
};

export enum FIELD_TYPES {
    BOOL = 'boolean',
    TEXT = 'text',
    NUM = 'number',
    SELECT = 'select',
    PASSWORD = 'password',
    PHONE = 'phone',
    DATE = 'date',
    EMAIL = 'email',
}

export type ApiResponseData = SellerUser | AdminUser | User;

export type FormValue = string | boolean | number | null | undefined;

export type SellerUpdate = UseMutationResult<CommonResponse<SellerUser>, Error, SellerUserMutateWithId, unknown>;
export type CustomerUpdate = UseMutationResult<CommonResponse<User>, Error, UserMutateOptional, unknown>;
export type AdminUpdate = UseMutationResult<CommonResponse<AdminUser>, Error, AdminUserMutateWithId, unknown>;
