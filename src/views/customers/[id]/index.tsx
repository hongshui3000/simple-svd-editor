import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import * as Yup from 'yup';
import { CSSObject } from '@emotion/core';

import { useCustomer, useUpdateCustomer, useUpdateUser } from '@api/customers';

import Tabs from '@components/controls/Tabs';
import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Mask from '@components/controls/Mask';
import Textarea from '@components/controls/Textarea';

import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';

import { maskPhone } from '@scripts/mask';
import { customerStatusValues } from '@scripts/enums';
import { Button, scale, useTheme, Layout } from '@scripts/gds';
import { ErrorMessages } from '@scripts/constants';
import { regPhone } from '@scripts/regex';
import { prepareForSelectFromObject } from '@scripts/helpers';
import { useTabs } from '@scripts/hooks';
import Addresses from './Addresses';
import Information from './Information';
import Favorites from './Favorites';

const Customer = () => {
    const { getTabsProps } = useTabs();
    const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
    const statuses = useMemo(() => prepareForSelectFromObject(customerStatusValues), []);
    const { query } = useRouter();
    const id = query.id?.toString() || '';
    const { data, isLoading, isIdle, refetch } = useCustomer(id);
    const customer = data?.data;
    const updateCustomer = useUpdateCustomer();
    const updateUser = useUpdateUser();

    const onStatusUpdate = async (vals: FormikValues) => {
        if (customer) {
            await updateCustomer.mutateAsync(
                { ...customer, id: +id, comment_status: vals?.comment },
                { onSuccess: () => refetch() }
            );
        }
        setIsChangeStatusOpen(false);
    };

    const onUpdateUser = async (values: FormikValues) => {
        if (customer?.user) {
            console.log(values);
            await updateUser.mutateAsync(
                {
                    id: customer.user.id,
                },
                { onSuccess: () => refetch() }
            );
        }
    };

    const { colors } = useTheme();

    const trStyles: CSSObject = {
        ':not(:last-of-type)': { borderBottom: `1px solid ${colors?.grey200}` },
    };

    const thStyles: CSSObject = {
        textAlign: 'left',
        padding: scale(1),
    };

    const tdStyles: CSSObject = {
        padding: scale(1),
    };

    return (
        <>
            <PageWrapper h1={`Клиент ${customer?.first_name || ''}`} isLoading={isLoading || isIdle}>
                <>
                    <Layout cols={2} gap={scale(2)} css={{ marginBottom: scale(2) }}>
                        <Layout.Item>
                            <Block>
                                <Block.Body css={{ display: 'flex' }}>
                                    <Form
                                        initialValues={{
                                            name: customer?.first_name,
                                            middleName: customer?.middle_name,
                                            lastName: customer?.last_name,
                                            email: customer?.email,
                                            phone: customer?.phone,
                                        }}
                                        validationSchema={Yup.object().shape({
                                            name: Yup.string().required(ErrorMessages.REQUIRED),
                                            middleName: Yup.string().required(ErrorMessages.REQUIRED),
                                            lastName: Yup.string().required(ErrorMessages.REQUIRED),
                                            email: Yup.string()
                                                .email(ErrorMessages.EMAIL)
                                                .required(ErrorMessages.REQUIRED),
                                            phone: Yup.string()
                                                .matches(regPhone, ErrorMessages.PHONE)
                                                .required(ErrorMessages.REQUIRED),
                                        })}
                                        css={{ width: '100%' }}
                                        onSubmit={onUpdateUser}
                                    >
                                        <table css={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr css={{ borderBottom: `1px solid ${colors?.grey200}` }}>
                                                    <th css={thStyles}>Инфопанель</th>
                                                    <td
                                                        colSpan={3}
                                                        css={{
                                                            textAlign: 'right',
                                                            button: { marginRight: scale(1) },
                                                            ...tdStyles,
                                                        }}
                                                    >
                                                        <Button onClick={() => setIsChangeStatusOpen(true)}>
                                                            Изменить статус
                                                        </Button>
                                                        <Form.Reset theme="outline">Отменить</Form.Reset>
                                                        <Button type="submit">Сохранить</Button>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr css={trStyles}>
                                                    <th css={thStyles}>ID</th>
                                                    <td css={tdStyles}>16</td>
                                                </tr>
                                                <tr css={trStyles}>
                                                    <th css={thStyles}>Статус</th>
                                                    <td css={tdStyles}>Активный</td>
                                                </tr>
                                                <tr css={trStyles}>
                                                    <th css={thStyles}>ФИО</th>
                                                    <td css={tdStyles}>
                                                        <Form.Field name="lastName" placeholder="Фамилия" />
                                                    </td>
                                                    <td css={tdStyles}>
                                                        <Form.Field name="name" placeholder="Имя" />
                                                    </td>
                                                    <td css={tdStyles}>
                                                        <Form.Field name="middleName" placeholder="Отчество" />
                                                    </td>
                                                </tr>

                                                <tr css={trStyles}>
                                                    <th css={thStyles}>E-mail</th>
                                                    <td css={tdStyles}>
                                                        <Form.Field name="email" />
                                                    </td>
                                                </tr>
                                                <tr css={trStyles}>
                                                    <th css={thStyles}>Телефон</th>
                                                    <td css={tdStyles}>
                                                        <Form.Field name="phone">
                                                            <Mask mask={maskPhone} />
                                                        </Form.Field>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Form>
                                </Block.Body>
                            </Block>
                        </Layout.Item>
                    </Layout>
                    <Tabs {...getTabsProps()}>
                        <Tabs.List>
                            <Tabs.Tab>Информация</Tabs.Tab>
                            <Tabs.Tab>Адреса</Tabs.Tab>
                            <Tabs.Tab>Избранное</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel>
                            <Information />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <Addresses />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <Favorites />
                        </Tabs.Panel>
                    </Tabs>
                </>
            </PageWrapper>
            <Popup
                isOpen={isChangeStatusOpen}
                onRequestClose={() => setIsChangeStatusOpen(false)}
                title="Изменить статус"
                popupCss={{ maxWidth: 'initial', width: scale(55) }}
            >
                <Form
                    onSubmit={onStatusUpdate}
                    initialValues={{ status: null, comment: '' }}
                    validationSchema={Yup.object().shape({
                        status: Yup.object().required(ErrorMessages.REQUIRED),
                        comment: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                >
                    <Form.Field name="status" label="Статус проверки" css={{ marginBottom: scale(2) }}>
                        <Select items={statuses} />
                    </Form.Field>
                    <Form.Field name="comment" label="Комментарий к статусу" css={{ marginBottom: scale(4) }}>
                        <Textarea rows={3} />
                    </Form.Field>
                    <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Form.Reset
                            theme="outline"
                            onClick={() => setIsChangeStatusOpen(false)}
                            css={{ marginRight: scale(2) }}
                        >
                            Отменить
                        </Form.Reset>
                        <Button type="submit" theme="primary">
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </Popup>
        </>
    );
};

export default Customer;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
