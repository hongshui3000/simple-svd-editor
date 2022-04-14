import { Button, Layout } from '@scripts/gds';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

import { prepareForSelect } from '@scripts/helpers';
import { maskPhone } from '@scripts/mask';

import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Checkbox from '@components/controls/Checkbox';
import Password from '@components/controls/Password';
import Textarea from '@components/controls/Textarea';
import Mask from '@components/controls/Mask';

import { usePostSeller, usePostSellerUser, SellerData, SellerUserMutate } from '@api/units';

import { FormikValues } from 'formik';
import { ErrorMessages } from '@scripts/constants';

const CreateSeller = () => {
    const { push } = useRouter();
    const initialValues = {
        legal_name: '',
        inn: '',
        kpp: '',
        legal_address: '',
        fact_address: '',
        payment_account: '',
        bankName: '',
        bank_bik: '',
        correspondent_account: '',
        bank_address: '',
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        phone: '',
        connectionWay: '',
        password: '',
        repeatPassword: '',
        storage_address: '',
        site: '',
        can_integration: false,
        sale_info: '',
    };

    const validationSchema = Yup.object({
        legal_name: Yup.string().required(ErrorMessages.REQUIRED),
        inn: Yup.string().required(ErrorMessages.REQUIRED),
        kpp: Yup.string().required(ErrorMessages.REQUIRED),
        legal_address: Yup.string().required(ErrorMessages.REQUIRED),
        fact_address: Yup.string().required(ErrorMessages.REQUIRED),
        payment_account: Yup.string().required(ErrorMessages.REQUIRED),
        bankName: Yup.string().required(ErrorMessages.REQUIRED),
        bank_bik: Yup.string().required(ErrorMessages.REQUIRED),
        correspondent_account: Yup.string().required(ErrorMessages.REQUIRED),
        bank_address: Yup.string().required(ErrorMessages.REQUIRED),
        last_name: Yup.string().required(ErrorMessages.REQUIRED),
        first_name: Yup.string().required(ErrorMessages.REQUIRED),
        middle_name: Yup.string().required(ErrorMessages.REQUIRED),
        email: Yup.string().required(ErrorMessages.REQUIRED).email(ErrorMessages.PHONE),
        phone: Yup.string().required(ErrorMessages.REQUIRED),
        connectionWay: Yup.string().required(ErrorMessages.REQUIRED),
        password: Yup.string().required(ErrorMessages.REQUIRED),
        repeatPassword: Yup.string()
            .required(ErrorMessages.REQUIRED)
            .oneOf([Yup.ref('password'), ''], ErrorMessages.PASSWORD),
        storage_address: Yup.string().required(ErrorMessages.REQUIRED),
        site: Yup.string().required(ErrorMessages.REQUIRED).url(ErrorMessages.SITE),
        sale_info: Yup.string().required(ErrorMessages.REQUIRED),
    });

    const { mutate: mutatePostSeller, isLoading: isLoadingPostSeller } = usePostSeller();

    const { mutate: mutatePostUser, isLoading: isLoadingUser } = usePostSellerUser();

    const handlerSaveSeller = (val: FormikValues) => {
        const user: SellerUserMutate = {
            last_name: val.last_name,
            first_name: val.first_name,
            middle_name: val.middle_name,
            email: val.email,
            phone: val.phone,
            password: val.password,
        };
        const seller: SellerData = {
            legal_name: val.legal_name,
            inn: val.inn,
            kpp: val.kpp,
            legal_address: val.legal_address,
            fact_address: val.fact_address,
            payment_account: val.payment_account,
            bank: val.bank,
            bank_address: val.bank_address,
            bank_bik: val.bank_bik,
            correspondent_account: val.correspondent_account,
            storage_address: val.storage_address,
            site: val.site,
            can_integration: val.can_integration,
            sale_info: val.sale_info,
        };

        mutatePostUser(user, {
            onSuccess: async data => {
                seller.manager_id = data.data.id;
                mutatePostSeller(seller);
            },
            onSettled: async () => {
                push('/sellers/list');
            },
        });
    };

    return (
        <PageWrapper h1="Создание продавца" isLoading={isLoadingPostSeller || isLoadingUser}>
            <Form
                onSubmit={values => handlerSaveSeller(values)}
                initialValues={initialValues}
                validationSchema={validationSchema}
            >
                <Layout cols={{ xxxl: 3, lg: 2 }}>
                    <Layout.Item col={2}>
                        <Block>
                            <Block.Body>
                                <Layout cols={6}>
                                    <Layout.Item col={6}>
                                        <Form.FastField
                                            name="legal_name"
                                            label="Юридическое наименование организации"
                                        />
                                    </Layout.Item>
                                    <Layout.Item col={3}>
                                        <Form.FastField name="inn" label="ИНН" />
                                    </Layout.Item>
                                    <Layout.Item col={3}>
                                        <Form.FastField name="kpp" label="КПП" />
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <Form.FastField name="legal_address" label="Юридический адрес" />
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <Form.FastField name="fact_address" label="Фактический адрес" />
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <hr />
                                    </Layout.Item>
                                    <Layout.Item col={3}>
                                        <Form.FastField
                                            name="payment_account"
                                            label="Номер банковского счета"
                                            type="number"
                                            min={0}
                                        />
                                    </Layout.Item>
                                    <Layout.Item col={3}>
                                        <Form.FastField
                                            name="correspondent_account"
                                            label="Номер корреспондентского счета"
                                        />
                                    </Layout.Item>
                                    <Layout.Item col={3}>
                                        <Form.FastField name="bankName" label="Наименование банка" />
                                    </Layout.Item>
                                    <Layout.Item col={3}>
                                        <Form.FastField name="bank_bik" label="БИК банка" />
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <Form.FastField name="bank_address" label="Юридический адрес банка" />
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <hr />
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
                                        <Form.FastField name="email" label="Email" />
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <Form.FastField name="phone" label="Телефон">
                                            <Mask mask={maskPhone} />
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={2}>
                                        <Form.FastField name="connectionWay" label="Способ связи">
                                            <Select items={prepareForSelect(['Email', 'Телефон'])} />
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={3}>
                                        <Form.FastField name="password" label="Пароль">
                                            <Password />
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={3}>
                                        <Form.FastField name="repeatPassword" label="Повтор пароля">
                                            <Password />
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <hr />
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <Form.FastField name="storage_address" label="Адреса складов отгрузки">
                                            <Textarea />
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <Form.FastField name="site" label="Сайт компании" type="url" />
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <Form.FastField name="can_integration">
                                            <Checkbox>
                                                Подтверждение о возможности работы с Платформой с использованием
                                                автоматических механизмов интеграции
                                            </Checkbox>
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <Form.FastField
                                            name="sale_info"
                                            label="Бренды и товарные категории, которыми вы торгуете"
                                        >
                                            <Textarea />
                                        </Form.FastField>
                                    </Layout.Item>
                                    <Layout.Item col={6}>
                                        <Button type="submit" theme="primary">
                                            Сохранить
                                        </Button>
                                    </Layout.Item>
                                </Layout>
                            </Block.Body>
                        </Block>
                    </Layout.Item>
                </Layout>
            </Form>
        </PageWrapper>
    );
};
export default CreateSeller;
