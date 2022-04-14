import { useMemo } from 'react';
import { Button, scale, Layout } from '@scripts/gds';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useField } from 'formik';
import * as Yup from 'yup';

import {
    usePromocodeCreate,
    useUpdatePromocode,
    usePromocode,
    DISCOUNTS_BASE_URL,
    DiscountsData,
    useDiscount,
    Discount,
} from '@api/marketing';

import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import Select from '@components/controls/Select';
import Form from '@components/controls/Form';
import CalendarRange from '@components/controls/CalendarRange';

import { prepareForSelectFromObject, toISOString } from '@scripts/helpers';
import { PromoCodeTypeValue, PromoCodeStatusValues, PromoCodeType } from '@scripts/enums';
import { ErrorMessages } from '@scripts/constants';
import { apiClient } from '@api/index';
import { CommonResponse } from '@api/common/types';
import Autocomplete from '@components/controls/Autocomplete';

const PROMOCODES_URL = '/marketing/promocodes';
const statuses = prepareForSelectFromObject(PromoCodeStatusValues);
const types = prepareForSelectFromObject(PromoCodeTypeValue);
const CREATE_PAGE_PARAM = 'create';

const emptyValues = { name: '', code: '', type: '', status: '', start_date: '', finish_date: '', counter: null };

const GenerateCodeBtn = () => {
    const [, , helpers] = useField('code');
    return (
        <>
            <Button block onClick={() => helpers.setValue(nanoid(10).toUpperCase())}>
                Сгенерировать&nbsp;случаный&nbsp;промокод
            </Button>
        </>
    );
};

const DiscountField = ({ defaultValue }: { defaultValue?: string }) => {
    const [field] = useField('type');
    const loadSuggestions = async (text?: string) => {
        const settings: DiscountsData = {
            filter: { name: text },
            pagination: { type: 'offset', limit: -1, offset: 0 },
        };
        const data: CommonResponse<Discount[]> = await apiClient.post(`${DISCOUNTS_BASE_URL}:search`, {
            data: settings,
        });
        return data?.data.map(i => ({ label: i.name, value: i.id })) || [];
    };

    return field.value === PromoCodeType.DISCOUNT ? (
        <Layout.Item col={1}>
            <Form.Field name="discountId" label="Название скидки">
                <Autocomplete searchAsyncFunc={loadSuggestions} defaultInputValue={defaultValue} />
            </Form.Field>
        </Layout.Item>
    ) : null;
};

const PromocodeCreate = () => {
    const { query, push } = useRouter();

    const promoId = Array.isArray(query.id) ? undefined : query.id;
    const isCreationPage = promoId === CREATE_PAGE_PARAM;

    const { data, isLoading } = usePromocode({ id: promoId, enabled: !isCreationPage });
    const promo = data?.data;
    const { data: discount } = useDiscount(promo?.discount_id);

    const initialValues = useMemo(() => {
        if (promo)
            return {
                ...emptyValues,
                ...promo,
                discountId: promo.discount_id,
            };
        return emptyValues;
    }, [promo]);

    const createPromocode = usePromocodeCreate();
    const updatePromocode = useUpdatePromocode();

    return (
        <PageWrapper
            h1={isCreationPage ? `Создание промокода` : `Редактирование промокода #${promoId}`}
            error={createPromocode.error || updatePromocode.error ? 'Произошла ошибка' : ''}
            isLoading={createPromocode.isLoading || updatePromocode.isLoading || isLoading}
        >
            <Block css={{ marginBottom: scale(3), width: '60%' }}>
                {/* TODO provide right type for values */}
                <Form<any>
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required(ErrorMessages.REQUIRED),
                        code: Yup.string().required(ErrorMessages.REQUIRED),
                        type: Yup.number().required(ErrorMessages.REQUIRED),
                        status: Yup.number().required(ErrorMessages.REQUIRED),
                        discountId: Yup.object().when('type', {
                            is: PromoCodeType.DISCOUNT,
                            then: Yup.object().required(ErrorMessages.REQUIRED),
                            otherwise: Yup.object().nullable(),
                        }),
                    })}
                    enableReinitialize
                    onSubmit={async values => {
                        const newData = {
                            type: values.type,
                            creator_id: 1, // TODO когда поправят на бэке, нужно удалить
                            discount_id: values.type === PromoCodeType.FREE_DELIVERY ? null : +values.discountId.value, // null, если доставка и id, если скидка
                            status: values.status,
                            name: values.name,
                            code: values.code,
                            counter: values.counter,
                            start_date: (values.start_date && toISOString(values.start_date)) || undefined,
                            end_date: (values.end_date && toISOString(values.end_date)) || undefined,
                        };
                        if (!isCreationPage && promoId) {
                            await updatePromocode.mutateAsync({ id: +promoId, ...newData });
                        } else {
                            await createPromocode.mutateAsync(newData);
                        }
                        push(PROMOCODES_URL);
                    }}
                >
                    <Block.Body>
                        <Layout cols={2} gap={scale(2)}>
                            <Layout.Item col={2}>
                                <Form.Field name="name" label="Название" />
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <Layout cols={2}>
                                    <Layout.Item col={1}>
                                        <Form.Field name="code" label="Код" hint="Код должен быть уникальным" />
                                    </Layout.Item>
                                    <Layout.Item col={1} align="end">
                                        <GenerateCodeBtn />
                                    </Layout.Item>
                                </Layout>
                            </Layout.Item>
                            <Layout.Item col={1}>
                                <Form.Field name="type" label="Тип промокода">
                                    <Select items={types} />
                                </Form.Field>
                            </Layout.Item>
                            <DiscountField defaultValue={discount?.data.name} />
                            <Layout.Item col={1}>
                                <Form.Field name="status" label="Статус">
                                    <Select items={statuses} />
                                </Form.Field>
                            </Layout.Item>
                            <Layout.Item col={2}>
                                <CalendarRange label="Введите дату" nameFrom="start_date" nameTo="finishDate" />
                            </Layout.Item>
                            <Layout.Item col={1}>
                                <Form.Field
                                    name="counter"
                                    label="Максимальное количество применений"
                                    hint="Не более N раз"
                                    type="number"
                                />
                            </Layout.Item>
                            <Layout.Item col={2} css={{ marginTop: scale(3) }} justify="end">
                                <Form.Reset theme="secondary" css={{ marginRight: scale(2) }} type="button">
                                    Отменить
                                </Form.Reset>
                                <Button theme="primary" type="submit">
                                    Сохранить
                                </Button>
                            </Layout.Item>
                        </Layout>
                    </Block.Body>
                </Form>
            </Block>
        </PageWrapper>
    );
};

export default PromocodeCreate;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
