import { useRouter } from 'next/router';
import { useMemo } from 'react';
import * as Yup from 'yup';

import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';

import { Form } from '@components/controls/Form';
import Mask from '@components/controls/Mask';
import Select from '@components/controls/Select';

import { CREATE_PARAM, ErrorMessages, DEFAULT_TIMEZONE } from '@scripts/constants';
import { Button, Layout, scale } from '@scripts/gds';
import { maskPhone } from '@scripts/mask';
import { regPhone } from '@scripts/regex';
import { useTimezones } from '@scripts/hooks';
import { cleanPhoneValue } from '@scripts/helpers';

import Password from '@components/controls/Password';
import Switcher from '@components/controls/Switcher';

import { usePostSellerUser, useSellerUser, loadSellers, useGetSellerById } from '@api/units';
import { useError, useSuccess } from '@context/modal';
import Autocomplete from '@components/controls/Autocomplete';

interface FormValues {
    seller_id?: { value: number | string; label: string | number | undefined };
    last_name?: string;
    middle_name?: string;
    first_name?: string;
    email?: string;
    phone?: string;
    login?: string;
    password?: string;
    repeatPassword?: string;
    timezone?: { label: string; value: string };
    active?: boolean;
}

const Operator = () => {
    const { query } = useRouter();
    const id = Array.isArray(query?.id) ? query.id[0] : query.id;
    const isCreationPage = id === CREATE_PARAM;
    const timezones = useTimezones();

    const { data, error } = useSellerUser(isCreationPage ? undefined : id);
    const user = useMemo(() => data?.data, [data?.data]);
    const sellerIDFromQuery = user?.seller_id || query.seller_id;
    const seller_id = (Array.isArray(sellerIDFromQuery) ? sellerIDFromQuery[0] : sellerIDFromQuery) || '';

    const createSeller = usePostSellerUser();
    const { data: sellerData, error: sellerError } = useGetSellerById(seller_id);
    const defaultSellerName = sellerData?.data?.legal_name || seller_id.toString();

    useError(createSeller.error || error || sellerError);
    useSuccess(createSeller.status === 'success' ? 'Пользователь создан успешно' : '');

    const initialValues: FormValues = useMemo(
        () => ({
            seller_id: defaultSellerName ? { value: seller_id, label: defaultSellerName } : undefined,
            last_name: user?.last_name || '',
            first_name: user?.first_name || '',
            middle_name: user?.middle_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            login: user?.login || '',
            password: user?.password || '',
            repeatPassword: user?.password || '',
            timezone: { label: user?.timezone || DEFAULT_TIMEZONE, value: user?.timezone || DEFAULT_TIMEZONE },
            active: user?.active || true,
        }),
        [
            defaultSellerName,
            seller_id,
            user?.active,
            user?.email,
            user?.first_name,
            user?.last_name,
            user?.login,
            user?.middle_name,
            user?.password,
            user?.phone,
            user?.timezone,
        ]
    );

    return (
        <PageWrapper h1={`${isCreationPage ? 'Создание' : 'Редактирование'} пользователя продавца`}>
            <Form
                initialValues={initialValues}
                onSubmit={(values: FormValues) => {
                    createSeller.mutate({
                        seller_id: values?.seller_id?.value ? +values?.seller_id?.value : undefined,
                        active: values?.active,
                        login: values?.login,
                        email: values?.email || '',
                        phone: cleanPhoneValue(values?.phone || ''),
                        first_name: values?.first_name || '',
                        middle_name: values?.middle_name || '',
                        last_name: values?.last_name || '',
                        password: values?.password || '',
                        timezone: values?.timezone?.value || '',
                    });
                }}
                validationSchema={Yup.object().shape({
                    seller_id: Yup.object().required(ErrorMessages.REQUIRED),
                    first_name: Yup.string().required(ErrorMessages.REQUIRED),
                    last_name: Yup.string().required(ErrorMessages.REQUIRED),
                    email: Yup.string().email(ErrorMessages.EMAIL).required(ErrorMessages.REQUIRED),
                    phone: Yup.string().matches(regPhone, ErrorMessages.PHONE).required(ErrorMessages.REQUIRED),
                    login: Yup.string().required(ErrorMessages.REQUIRED),
                    password: Yup.string().required(ErrorMessages.REQUIRED),
                    timezone: Yup.object().required(ErrorMessages.REQUIRED),
                    repeatPassword: Yup.string()
                        .required(ErrorMessages.REQUIRED)
                        .oneOf([Yup.ref('password'), ''], ErrorMessages.PASSWORD),
                    active: Yup.boolean(),
                })}
                enableReinitialize
            >
                <Block css={{ maxWidth: scale(128) }}>
                    <Block.Body>
                        <Layout cols={6}>
                            <Layout.Item col={6}>
                                <Layout cols={3}>
                                    <Layout.Item col={1}>
                                        <Form.FastField name="seller_id" label="Продавец" hint="Начните вводить">
                                            <Autocomplete searchAsyncFunc={loadSellers} />
                                        </Form.FastField>
                                    </Layout.Item>
                                </Layout>
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="last_name" label="Фамилия" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="first_name" label="Имя" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="middle_name" label="Отчество" />
                            </Layout.Item>

                            <Layout.Item col={2}>
                                <Form.FastField name="email" label="E-mail" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="phone" label="Телефон">
                                    <Mask mask={maskPhone} />
                                </Form.FastField>
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="login" label="Логин" />
                            </Layout.Item>

                            <Layout.Item col={2}>
                                <Form.FastField name="password" label="Пароль">
                                    <Password />
                                </Form.FastField>
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Form.FastField name="repeatPassword" label="Повторите пароль">
                                    <Password />
                                </Form.FastField>
                            </Layout.Item>
                            <Layout.Item col={2} align="start">
                                <Form.FastField name="active">
                                    <Switcher>Активен</Switcher>
                                </Form.FastField>
                            </Layout.Item>

                            <Layout.Item col={2}>
                                <Form.FastField name="timezone" label="Временная зона">
                                    <Select items={timezones} />
                                </Form.FastField>
                            </Layout.Item>
                        </Layout>
                    </Block.Body>
                    <Block.Footer css={{ justifyContent: 'flex-end' }}>
                        <Form.Reset theme="secondary" css={{ marginRight: scale(2) }}>
                            Отменить
                        </Form.Reset>
                        <Button type="submit">Создать</Button>
                    </Block.Footer>
                </Block>
            </Form>
        </PageWrapper>
    );
};

export default Operator;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
