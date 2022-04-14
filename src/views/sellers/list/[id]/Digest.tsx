import { useListCSS } from '@scripts/hooks/useListCSS';
import { useMemo } from 'react';
import Block from '@components/Block';

import { useGetSellerDigest } from '@api/units';

const Digest = ({ id }: { id: number }) => {
    const { dlBaseStyles, dtBaseStyles, ddBaseStyles } = useListCSS();
    const defaultDigest = {
        products_count: 0,
        accepted_orders_count: 0,
        delivered_orders_count: 0,
        sold_orders_count: 0,
    };

    const date = new Date().toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
    });

    const { data: digestData } = useGetSellerDigest(id);

    const digest = useMemo(() => digestData?.data || defaultDigest, [digestData]);

    return (
        <Block>
            <Block.Header>
                <h2>Текущий отчетный период {date}</h2>
            </Block.Header>

            <Block.Body>
                <dl css={{ ...dlBaseStyles, gridTemplateColumns: '200px 1fr' }}>
                    <dt css={dtBaseStyles}>Товаров на витрине</dt>
                    <dd css={ddBaseStyles}>{digest.products_count}</dd>
                    <dt css={dtBaseStyles}>Приянто заказов</dt>
                    <dd css={ddBaseStyles}>{digest.accepted_orders_count}</dd>
                    <dt css={dtBaseStyles}>Доставлено заказов</dt>
                    <dd css={ddBaseStyles}>{digest.delivered_orders_count}</dd>
                    <dt css={dtBaseStyles}>Продано заказов</dt>
                    <dd css={ddBaseStyles}>{digest.sold_orders_count}</dd>
                </dl>
            </Block.Body>
        </Block>
    );
};

export default Digest;
