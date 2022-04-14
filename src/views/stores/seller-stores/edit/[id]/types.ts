import { Days } from '@scripts/enums';

export interface WorkingItem {
    id?: string | number;
    working_start_time: string;
    working_end_time: string;
    day: Days;
    active: boolean;
}
