import { FC } from 'react';
import Block from '@components/Block';
import CopyButton from '@components/CopyButton';
import { scale } from '@scripts/gds';
import { Refund, useRefundStatuses } from '@api/orders';
import { formatDate, getOptionName } from '@scripts/helpers';
import Circle from '@components/Circle';
import { getRefundStatusColor } from '../helpers';

export const Aside: FC<{ refund: Refund | undefined; className?: string }> = ({ refund, className }) => {
    const { data: statusData } = useRefundStatuses();

    return (
        <Block css={{ padding: scale(3), width: scale(35), flexShrink: 0 }} className={className}>
            <ul css={{ li: { marginBottom: scale(1) } }}>
                <li>
                    Статус:
                    <Circle
                        css={{
                            marginLeft: scale(1),
                            marginRight: scale(1, true),
                            background: getRefundStatusColor(refund?.status || 0),
                        }}
                    />
                    {getOptionName(statusData?.data, refund?.status)}
                </li>
                <li>
                    ID: <CopyButton>{`${refund?.id}`}</CopyButton>
                </li>
                <li>
                    Номер заказа: <CopyButton>{`${refund?.order?.number}`}</CopyButton>
                </li>
                <li>
                    Создано: {refund?.created_at && formatDate(new Date(refund?.created_at), 'dd MMMM yyyy, в HH:mm')}
                </li>
                <li>
                    Изменено: {refund?.updated_at && formatDate(new Date(refund?.updated_at), 'dd MMMM yyyy, в HH:mm')}
                </li>
            </ul>
        </Block>
    );
};
