import Link from 'next/link';
import { Layout, scale } from '@scripts/gds';
import { useLinkCSS } from '@scripts/hooks';

import { Order } from '@api/orders';

import Form from '@components/controls/Form';
import Legend from '@components/controls/Legend';

import Block from '@components/Block';

import LinkIcon from '@icons/small/link.svg';
import Mask from '@components/controls/Mask';

import { maskPhone } from '@scripts/mask';

export const Customer = ({ order }: { order: Order | undefined }) => {
    const linkStyles = useLinkCSS();
    return (
        <Block css={{ padding: scale(3) }}>
            <Layout cols={1}>
                <Layout.Item col={1}>
                    <Form.FastField name="receiver_name" label="ФИО" />
                </Layout.Item>
                <Layout.Item col={1}>
                    <Form.FastField name="receiver_phone" label="Телефон" type="phone">
                        <Mask mask={maskPhone} />
                    </Form.FastField>
                </Layout.Item>
                <Layout.Item col={1}>
                    <Form.FastField name="receiver_email" label="E-mail" type="email" />
                </Layout.Item>
                {order?.customer?.id && (
                    <Layout.Item col={1} css={{ display: 'flex' }}>
                        <Legend label="Логин:" as="p" />
                        <Link passHref href={`/customer/${order?.customer?.id}`}>
                            <a css={{ ...linkStyles, marginLeft: scale(1) }}>
                                {order?.customer?.user?.login}
                                <LinkIcon css={{ marginLeft: scale(1, true) }} />
                            </a>
                        </Link>
                    </Layout.Item>
                )}
            </Layout>
        </Block>
    );
};
