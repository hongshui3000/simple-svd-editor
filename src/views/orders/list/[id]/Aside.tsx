import { FC } from 'react';
import Block from '@components/Block';
import Circle from '@components/Circle';
import CopyButton from '@components/CopyButton';
import { scale } from '@scripts/gds';
import { OrderStatus, Order, useOrderStatuses } from '@api/orders';
import { formatDate, getOptionName } from '@scripts/helpers';

import { getStatusColor } from './helpers';

export const Aside: FC<{ order: Order | undefined; className?: string }> = ({ order, className }) => {
    const { data: statuses } = useOrderStatuses();
    return (
        <Block css={{ padding: scale(3), width: scale(35), flexShrink: 0 }} className={className}>
            <ul css={{ li: { marginBottom: scale(1) } }}>
                <li>
                    Статус:
                    <Circle
                        css={{
                            marginRight: scale(1, true),
                            marginLeft: scale(1),
                            background: getStatusColor(order?.status as OrderStatus),
                        }}
                    />
                    {getOptionName(statuses?.data, order?.status)}
                </li>
                <li>
                    ID: <CopyButton>{`${order?.id}`}</CopyButton>
                </li>
                <li>
                    Номер заказа: <CopyButton>{`${order?.number}`}</CopyButton>
                </li>
                <li>
                    Создано: {order?.created_at && formatDate(new Date(order?.created_at), 'dd MMMM yyyy, в HH:mm')}
                </li>
                <li>
                    Изменено: {order?.updated_at && formatDate(new Date(order?.updated_at), 'dd MMMM yyyy, в HH:mm')}
                </li>
            </ul>
        </Block>
    );
};
