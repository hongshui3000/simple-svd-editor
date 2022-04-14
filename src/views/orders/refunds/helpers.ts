import { RefundStatuses } from '@api/orders';
import { colors } from '@scripts/gds';

export const getRefundStatusColor = (status: RefundStatuses) => {
    switch (status) {
        case RefundStatuses.CANCELED:
            return colors.black;
        case RefundStatuses.CONFIRMED:
            return colors.success;
        case RefundStatuses.REJECTED:
            return colors.danger;
        case RefundStatuses.NEW:
        default:
            return colors.primary;
    }
};
