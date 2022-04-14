import { PromoCodeType, PromoCodeStatus } from '@scripts/enums';

export interface PromocodeMutate {
    type: PromoCodeType;
    creator_id?: number;
    owner_id?: number | null;
    seller_id?: number | null;
    status: PromoCodeStatus;
    name: string;
    code: string;
    counter?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    discount_id?: number | null;
}

export interface Promocode extends PromocodeMutate {
    id: number;
}

export interface PromocodeFilter extends Omit<Partial<Promocode>, 'name' | 'counter'> {}
