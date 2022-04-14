import { FileType } from '@api/common/types';

export interface ProductImage {
    id: number;
    product_id: number;
    file: FileType;
    type: number;
}
