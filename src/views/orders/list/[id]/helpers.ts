import { OrderStatus } from '@api/orders';
import { colors } from '@scripts/gds';

export const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.WAITING:
            return colors.warning;
        case OrderStatus.NEW:
            return colors.primary;
        case OrderStatus.CONFIRMED:
            return colors.success;
        case OrderStatus.FINISHED:
            return colors.grey900;
        case OrderStatus.CANCELED:
            return colors.danger;
        default:
            return colors.primary;
    }
};
