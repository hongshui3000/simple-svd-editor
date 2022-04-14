import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useField } from 'formik';

import PageWrapper from '@components/PageWrapper';
import OldTable from '@components/OldTable';
import Block from '@components/Block';

import Form, { NuberFieldValue } from '@components/controls/Form';
import Pagination from '@components/controls/Pagination';
import Select from '@components/controls/Select';
import Popup from '@components/controls/Popup';
import Mask from '@components/controls/Mask';
import Password from '@components/controls/Password';

import { useCustomers, useUserSearchOne, useCreateUser, useCreateCustomer } from '@api/customers';

import { Button, scale, Layout, typography } from '@scripts/gds';
import { getTotalPages, getTotal, prepareForSelectFromObject, declOfNum, cleanPhoneValue } from '@scripts/helpers';
import { customerStatusValues, CELL_TYPES } from '@scripts/enums';
import { useTimezones, useFiltersHelper } from '@scripts/hooks';
import { ErrorMessages, LIMIT_PAGE } from '@scripts/constants';
import { maskPhone } from '@scripts/mask';
import { regPhone } from '@scripts/regex';
import Switcher from '@components/controls/Switcher';
import { useError } from '@context/modal';

const COLUMNS = [
    {
        Header: 'ID клиента',
        accessor: 'id',
        getProps: () => ({ type: CELL_TYPES.LINKED_ID }),
    },
    {
        Header: 'Дата регистрации',
        accessor: 'date',
        getProps: () => ({ type: CELL_TYPES.DATE }),
    },
    {
        Header: 'ФИО',
        accessor: 'name',
    },
    {
        Header: 'Телефон',
        accessor: 'phone',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
];

const FormFields = {
    PHONE: 'phone',
    STATUS: 'status',
    ACTIVE: 'active',
    LOGIN: 'login',
    EMAIL: 'email',
    TIMEZONE: 'timezone',
    PASSWORD: 'password',
    PASSWORD_REPEAT: 'passwordRepeat',
};

const emptyInitialValues = {
    status: '',
    customerId: '',
    userId: '',
};

const PHONE_LENGTH = 12;

const FormChildren = ({ close, statuses, setPhone, userId }: any) => {
    const [field, meta] = useField('phone');
    const timezonesForSelect = useTimezones();

    useEffect(() => {
        const phone = cleanPhoneValue(field.value);
        if (!meta?.error && phone.length === PHONE_LENGTH) {
            setPhone(phone);
        }
    }, [field.value, meta?.error, setPhone]);

    return (
        <>
            <Form.Field name={FormFields.PHONE} label="Телефон" css={{ marginBottom: scale(2) }}>
                <Mask mask={maskPhone} />
            </Form.Field>
            <Form.FastField name={FormFields.STATUS} label="Статус" css={{ marginBottom: scale(4) }}>
                <Select items={statuses} />
            </Form.FastField>
            {userId ? null : (
                <>
                    <Form.FastField name={FormFields.ACTIVE} css={{ marginBottom: scale(2) }}>
                        <Switcher>Активен</Switcher>
                    </Form.FastField>
                    <Form.FastField name={FormFields.LOGIN} label="Логин" css={{ marginBottom: scale(2) }} />
                    <Form.FastField name={FormFields.EMAIL} label="Email" css={{ marginBottom: scale(2) }} />
                    <Form.FastField name={FormFields.TIMEZONE} label="Временная зона" css={{ marginBottom: scale(2) }}>
                        <Select items={timezonesForSelect} />
                    </Form.FastField>
                    <Form.FastField name={FormFields.PASSWORD} label="Введите пароль" css={{ marginBottom: scale(2) }}>
                        <Password />
                    </Form.FastField>
                    <Form.FastField
                        name={FormFields.PASSWORD_REPEAT}
                        label="Повторите пароль"
                        css={{ marginBottom: scale(2) }}
                    >
                        <Password />
                    </Form.FastField>
                </>
            )}

            <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Form.Reset theme="outline" onClick={close} css={{ marginRight: scale(2) }}>
                    Отменить
                </Form.Reset>
                <Button type="submit" theme="primary">
                    Сохранить
                </Button>
            </div>
        </>
    );
};

type Values = {
    customerId: NuberFieldValue;
    userId: NuberFieldValue;
    status: { value: NuberFieldValue; label: string };
};

const Customers = () => {
    const [phone, setPhone] = useState('');
    const { push, pathname, query } = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const { initialValues: values, URLHelper } = useFiltersHelper<Values>(emptyInitialValues);
    const activePage = +(query?.page || 1);
    const {
        data: res,
        isLoading,
        isIdle,
        error,
    } = useCustomers({
        filter: {
            id: +values.customerId || undefined,
            user_id: +values?.userId || undefined,
            status: +values.status?.value || undefined,
        },
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });

    const totalPages = getTotalPages(res);
    const total = getTotal(res);
    const tableData = useMemo(
        () =>
            res?.data?.map(c => ({
                id: c.id,
                data: c.user?.created_at ? new Date(c.user?.created_at) : null,
                // name: c.full_name || '',
                email: c.email || '',
            })) || [],
        [res?.data]
    );

    const { data: userData, error: userError } = useUserSearchOne({ filter: {}, enabled: Boolean(phone) });
    const userId = userData?.data?.id;
    const hasUserId = Boolean(userId);
    const isRequired = () => (hasUserId ? '' : ErrorMessages.REQUIRED);

    const statuses = useMemo(() => prepareForSelectFromObject(customerStatusValues), []);

    const createUser = useCreateUser();
    const createCustomer = useCreateCustomer();

    useError(error || createUser.error || createCustomer.error || userError);

    return (
        <PageWrapper h1="Клиентская база" isLoading={isLoading || isIdle}>
            <Block css={{ marginBottom: scale(3) }}>
                <Form initialValues={values} onSubmit={URLHelper} onReset={() => push(pathname)}>
                    <Block.Body>
                        <Layout cols={12}>
                            <Layout.Item col={3}>
                                <Form.Field name="status" label="Статус">
                                    <Select items={statuses} />
                                </Form.Field>
                            </Layout.Item>
                            <Layout.Item col={3}>
                                <Form.Field name="customerId" label="ID клиента" type="number" />
                            </Layout.Item>
                            <Layout.Item col={3}>
                                <Form.Field name="userId" label="ID пользователя" type="number" />
                            </Layout.Item>
                        </Layout>
                    </Block.Body>
                    <Block.Footer>
                        <div css={typography('bodySm')}>
                            {total
                                ? `Найдено ${declOfNum(total, ['клиент', 'клиента', 'клиентов'])}`
                                : 'Ничего не найдено'}
                        </div>
                        <div>
                            <Form.Reset theme="secondary" type="button">
                                Сбросить
                            </Form.Reset>
                            <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                                Применить
                            </Button>
                        </div>
                    </Block.Footer>
                </Form>
            </Block>
            <div css={{ marginBottom: scale(3) }}>
                <Button onClick={() => setIsOpen(true)}>Создать клиента</Button>
            </div>
            <Block>
                <Block.Body>
                    {tableData.length > 0 ? (
                        <OldTable
                            columns={COLUMNS}
                            data={tableData}
                            needSettingsColumn={false}
                            needCheckboxesCol={false}
                        />
                    ) : (
                        <p css={typography('bodyMd')}>Ни одного клиента не найдено.</p>
                    )}
                    <Pagination pages={totalPages} css={{ marginTop: scale(2) }} />
                </Block.Body>
            </Block>
            <Popup
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                title="Создание клиента"
                popupCss={{ minWidth: scale(60) }}
            >
                <Form
                    onSubmit={async vals => {
                        let user_id = userId;
                        if (!user_id) {
                            const user = await createUser.mutateAsync({
                                active: !!vals.active,
                                login: vals.login as string,
                                // email: vals.email,
                                // phone: cleanPhoneValue(vals.phone),
                                // timezone: vals.timezone.value,
                                password: vals.password as string,
                            });
                            user_id = user.data.id;
                        }
                        if (user_id) {
                            // const customer = await createCustomer.mutateAsync({
                            // user_id,
                            // status: vals.status.value,
                            // });
                            // router.push(`${pathname}/${customer.data.id}`);
                        }
                    }}
                    validationSchema={Yup.object().shape({
                        [FormFields.PHONE]: Yup.string()
                            .matches(regPhone, ErrorMessages.PHONE)
                            .required(ErrorMessages.REQUIRED),
                        [FormFields.STATUS]: Yup.object().required(isRequired),
                        [FormFields.LOGIN]: Yup.string().required(isRequired),
                        [FormFields.EMAIL]: Yup.string().email(ErrorMessages.EMAIL).required(isRequired),
                        [FormFields.TIMEZONE]: Yup.object().required(isRequired),
                        [FormFields.PASSWORD]: Yup.string().required(isRequired),
                        [FormFields.PASSWORD_REPEAT]: Yup.string()
                            .required(isRequired)
                            .oneOf([Yup.ref('password'), ''], ErrorMessages.PASSWORD),
                    })}
                    initialValues={{
                        [FormFields.PHONE]: '',
                        [FormFields.STATUS]: '',
                        [FormFields.ACTIVE]: true,
                        [FormFields.LOGIN]: '',
                        [FormFields.EMAIL]: '',
                        [FormFields.TIMEZONE]: '',
                        [FormFields.PASSWORD]: '',
                        [FormFields.PASSWORD_REPEAT]: '',
                    }}
                >
                    <FormChildren close={() => setIsOpen(false)} statuses={statuses} setPhone={setPhone} />
                </Form>
            </Popup>
        </PageWrapper>
    );
};

export default Customers;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
