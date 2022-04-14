import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { Button, typography, scale, useTheme, Layout } from '@scripts/gds';
import { FormikValues } from 'formik';

import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import Form from '@components/controls/Form';
import Tabs from '@components/controls/Tabs';
import Select, { SelectItemProps } from '@components/controls/Select';

import { useTabs } from '@scripts/hooks';
import { useError, useSuccess } from '@context/modal';
import { ModalMessages } from '@scripts/constants';
import { useGetSellerStatuses, useGetSellerById, usePatchSeller, useAdminUsers, User, SellerData } from '@api/units';
import { toSelectItems } from '@scripts/helpers';

import Digest from './Digest';
import Information from './Information';
import Stores from './Stores';
import SellerTeam from './SellerTeam';
import Offers from './Offers';
import Marketing from './Marketing';

export interface SellerValues {
    legal_name: string;
    city: string;
    owner_name: string;
    email: string;
    phone: string;
    status: string | SelectItemProps;
    status_at: string;
    manager: string | SelectItemProps;
}

const SellerDetail = () => {
    const {
        query: { id },
    } = useRouter();
    const parsedId = +`${id}`;

    const { colors } = useTheme();
    const { getTabsProps } = useTabs();

    const getLayoutItemStyle = (cols: number | number[] = [1, 3], gap = scale(1, true)) => ({
        display: 'grid',
        gridGap: `${gap}px`,
        gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols.map(col => `${col}fr`).join(' '),
        padding: `${scale(3, true)}px 0`,
        ':not(:last-child)': { borderBottom: `1px solid ${colors?.grey200}` },
    });

    const {
        data: seller,
        refetch,
        error,
        isIdle,
        isLoading: isLoadingSeller,
    } = useGetSellerById(parsedId, 'owner,manager');

    const { data: statuses, error: errorStatuses } = useGetSellerStatuses();

    const { data: users, error: errorUsers } = useAdminUsers({});

    const patchSeller = usePatchSeller();

    useError(error || patchSeller.error || errorStatuses || errorUsers);

    useSuccess(patchSeller.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');

    const statusesList = useMemo(() => toSelectItems(statuses?.data), [statuses]);

    const usersList = useMemo(
        () =>
            users
                ? users.data.map((user: User) => ({
                      value: user.id,
                      label: user.full_name,
                  }))
                : [],
        [users]
    );

    const initialValues = useMemo(() => {
        if (seller?.data) {
            const sellerStatus = statusesList.find(
                status => status.value.toString() === seller.data.status?.toString()
            );

            const sellerManager = users?.data?.find((user: User) => user.id === seller.data.manager.id);
            return {
                legal_name: seller.data.legal_name,
                city: seller.data.city,
                owner_name: seller.data.owner.full_name,
                email: seller.data.owner.email,
                phone: seller.data.owner.phone,
                status: sellerStatus || '',
                status_at: seller.data.status_at,
                manager: sellerManager
                    ? {
                          value: sellerManager.id,
                          label: sellerManager.full_name,
                      }
                    : '',
            };
        }
        return {
            legal_name: '',
            city: '',
            owner_name: '',
            email: '',
            phone: '',
            status: '',
            status_at: '',
            manager: '',
        };
    }, [seller?.data, statusesList, users?.data]);

    const editSellerHandler = async (values: FormikValues) => {
        const body: SellerData = {
            legal_name: values.legal_name,
            city: values.city,
            manager_id: values.manager.value,
            status: values.status.value,
        };
        await patchSeller.mutateAsync(
            {
                id: parsedId,
                body,
            },
            { onSuccess: () => refetch() }
        );
    };

    return (
        <PageWrapper h1="Название продавца" isLoading={isLoadingSeller || isIdle}>
            <>
                <Block css={{ marginBottom: scale(3) }}>
                    <Form
                        initialValues={initialValues}
                        onSubmit={values => {
                            editSellerHandler(values);
                        }}
                    >
                        <Block.Body>
                            <Layout cols={1} gap={0} css={{ ...typography('bodyMd') }}>
                                <Layout.Item col={1} css={{ ...getLayoutItemStyle() }}>
                                    <span>
                                        <b>Название организации</b>
                                    </span>
                                    <Form.Field name="legal_name" />
                                </Layout.Item>
                                <Layout.Item col={1} css={{ ...getLayoutItemStyle() }}>
                                    <span>
                                        <b>Город</b>
                                    </span>
                                    <Form.Field name="city" />
                                </Layout.Item>
                                <Layout.Item col={1} css={{ ...getLayoutItemStyle() }}>
                                    <span>
                                        <b>ФИО</b>
                                    </span>
                                    <span>{initialValues.owner_name}</span>
                                </Layout.Item>
                                <Layout.Item col={1} css={{ ...getLayoutItemStyle(4, scale(2)) }}>
                                    <span>
                                        <b>E-mail</b>
                                    </span>
                                    <span>{initialValues.email}</span>
                                    <span>
                                        <b>Телефон</b>
                                    </span>
                                    <span>{initialValues.phone}</span>
                                </Layout.Item>
                                <Layout.Item col={1} css={{ ...getLayoutItemStyle(4, scale(2)) }}>
                                    <span>
                                        <b>Статус</b>
                                    </span>
                                    <Form.Field name="status">
                                        <Select items={statusesList} />
                                    </Form.Field>
                                    <span>
                                        <b>Дата получения статуса</b>
                                    </span>
                                    <span>{initialValues.status_at}</span>
                                </Layout.Item>
                                <Layout.Item col={1} css={{ ...getLayoutItemStyle(4, scale(2)) }}>
                                    <span>
                                        <b>Менеджер</b>
                                    </span>
                                    <Form.Field name="manager">
                                        <Select items={usersList} />
                                    </Form.Field>
                                </Layout.Item>
                            </Layout>
                        </Block.Body>
                        <Block.Footer css={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Form.Reset theme="secondary" type="button">
                                Сбросить
                            </Form.Reset>
                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Применить
                            </Button>
                        </Block.Footer>
                    </Form>
                </Block>
                {parsedId && (
                    <Tabs {...getTabsProps()}>
                        <Tabs.List>
                            <Tabs.Tab>Дайджест</Tabs.Tab>
                            <Tabs.Tab>Информация</Tabs.Tab>
                            <Tabs.Tab>Склады</Tabs.Tab>
                            <Tabs.Tab>Команда продавца</Tabs.Tab>
                            <Tabs.Tab>Заказы</Tabs.Tab>
                            <Tabs.Tab>Маркетинг</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel>
                            <Digest id={parsedId} />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            {seller?.data && <Information seller={seller.data} onSave={() => refetch()} />}
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <Stores id={parsedId} />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <SellerTeam id={parsedId} />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <Offers />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <Marketing id={parsedId} />
                        </Tabs.Panel>
                    </Tabs>
                )}
            </>
        </PageWrapper>
    );
};

export default SellerDetail;

export function getServerSideProps() {
    return { props: {} };
}
