import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { FieldArray, useFormikContext } from 'formik';

import { Button, scale, Layout } from '@scripts/gds';
import { ErrorMessages, ModalMessages } from '@scripts/constants';
import { ObjectType } from '@scripts/enums';

import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import Form from '@components/controls/Form';
import Checkbox from '@components/controls/Checkbox';
import MultiSelect from '@components/controls/MultiSelect';
import Select from '@components/controls/Select';
import CalendarRange from '@components/controls/CalendarRange';

import { toISOString } from '@scripts/helpers';

import { useError, useSuccess } from '@context/modal';

import {
    useDiscount,
    useDiscountCreate,
    useDiscountEdit,
    useDiscountStatuses,
    useDiscountTypes,
    useDiscountConditionTypes,
    useDiscountConditionTypeProps,
} from '@api/marketing';
import { useDeliveryMethods } from '@api/logistic';
import { useBrands, useCategories } from '@api/catalog';
import { usePaymentMethods } from '@api/orders';
import { DiscountConditionType, DiscountConditionTypeProp } from '@api/marketing/types';
import { DeliveryMethod } from '@api/logistic/types';
import { CommonOption } from '@api/common/types';
import { prepareValuesForSelect } from '../helpers';

interface condition {
    type: number;
    minPrice?: number;
    brands?: number[];
    categories?: number[];
    offer?: number;
    count?: number;
    deliveryMethods?: number[];
    paymentMethods?: number[];
}

const ConditionsBlock = ({
    brands,
    categories,
    conditionsTypes,
    conditionTypeProps,
    deliveryMethods,
    paymentMethods,
}: {
    brands: { value: number; label: string }[];
    categories: { value: number; label: string }[];
    conditionsTypes: DiscountConditionType[];
    conditionTypeProps: DiscountConditionTypeProp[];
    deliveryMethods: DeliveryMethod[];
    paymentMethods: CommonOption[];
}) => {
    const {
        values: { conditions },
    } =
        useFormikContext<{
            conditions: condition[];
        }>();

    const [selectedConditions, setSelectedConditions] = useState<number[]>([]);

    useEffect(() => {
        if (selectedConditions.length === 0 && conditions[0]?.type) {
            setSelectedConditions(conditions.map(i => i.type));
        }
    }, [conditions, selectedConditions, setSelectedConditions]);

    const preparedDiscountConditionTypes = useMemo(
        () => (conditionsTypes ? prepareValuesForSelect(conditionsTypes) : []),
        [conditionsTypes]
    );
    const filteredDiscountConditionTypes = useMemo(
        () =>
            preparedDiscountConditionTypes
                ? preparedDiscountConditionTypes.filter(i => !selectedConditions.includes(+i.value))
                : [],
        [preparedDiscountConditionTypes, selectedConditions]
    );

    const deliveryMethodsOptions = useMemo(
        () => deliveryMethods.map(({ name, id }) => ({ label: name, value: id })) || [],
        [deliveryMethods]
    );

    const paymentMethodsOptions = useMemo(
        () => paymentMethods.map(({ name, id }) => ({ label: name, value: id })) || [],
        [paymentMethods]
    );

    const getLabel = (id: string) => conditionTypeProps.find(i => i.id === id)?.name;
    const isRequired = (index: number, prop: string) =>
        conditionsTypes.find(i => i.id === selectedConditions[index])?.props?.includes(prop);

    return (
        <FieldArray
            name="conditions"
            render={({ push, remove }) =>
                conditions.map((c, index) => {
                    const isLastItem = index === conditions.length - 1;
                    return (
                        <Layout cols={4} key={index} css={{ marginBottom: scale(3) }}>
                            <Layout.Item col={2}>
                                <Form.Field name={`conditions[${index}][type]`} label="Условия предоставления скидки">
                                    <Select
                                        selectedItem={preparedDiscountConditionTypes.find(
                                            i => +i.value === selectedConditions[index]
                                        )}
                                        onChange={val => {
                                            if (val.selectedItem?.value) {
                                                let selected = [...selectedConditions];
                                                const type = +val.selectedItem?.value;

                                                if (selected.length > 0) {
                                                    if (selected[index]) {
                                                        selected[index] = type;
                                                    } else {
                                                        selected.splice(index, 0, type);
                                                    }
                                                } else {
                                                    selected = [type];
                                                }

                                                setSelectedConditions(selected);
                                            }
                                        }}
                                        items={filteredDiscountConditionTypes}
                                    />
                                </Form.Field>
                            </Layout.Item>
                            {isRequired(index, 'minPrice') && (
                                <Layout.Item col={1}>
                                    <Form.Field
                                        name={`conditions[${index}].minPrice`}
                                        type="number"
                                        label={getLabel('minPrice')}
                                    />
                                </Layout.Item>
                            )}
                            {isRequired(index, 'brands') && (
                                <Layout.Item col={1}>
                                    <Form.Field name={`conditions[${index}].brands`} label={getLabel('brands')}>
                                        <MultiSelect items={brands} />
                                    </Form.Field>
                                </Layout.Item>
                            )}
                            {isRequired(index, 'categories') && (
                                <Layout.Item col={1}>
                                    <Form.Field name={`conditions[${index}].categories`} label={getLabel('categories')}>
                                        <MultiSelect items={categories} />
                                    </Form.Field>
                                </Layout.Item>
                            )}
                            {isRequired(index, 'offer') && (
                                <Layout.Item col={1}>
                                    <Form.Field
                                        name={`conditions[${index}].offer`}
                                        type="number"
                                        label={getLabel('offer')}
                                    />
                                </Layout.Item>
                            )}
                            {isRequired(index, 'count') && (
                                <Layout.Item col={1}>
                                    <Form.Field
                                        name={`conditions[${index}].count`}
                                        type="number"
                                        label={getLabel('count')}
                                    />
                                </Layout.Item>
                            )}
                            {isRequired(index, 'deliveryMethods') && (
                                <Layout.Item col={1}>
                                    <Form.Field
                                        name={`conditions[${index}].deliveryMethods`}
                                        label={getLabel('deliveryMethods')}
                                    >
                                        <MultiSelect items={deliveryMethodsOptions} />
                                    </Form.Field>
                                </Layout.Item>
                            )}
                            {isRequired(index, 'paymentMethods') && (
                                <Layout.Item col={1}>
                                    <Form.Field
                                        name={`conditions[${index}].paymentMethods`}
                                        label={getLabel('paymentMethods')}
                                    >
                                        <MultiSelect items={paymentMethodsOptions} />
                                    </Form.Field>
                                </Layout.Item>
                            )}
                            <Layout.Item col={4} align="end">
                                {isLastItem && filteredDiscountConditionTypes.length > 0 ? (
                                    <Button
                                        onClick={() =>
                                            push({
                                                type: undefined,
                                                minPrice: undefined,
                                                brands: [],
                                                categories: [],
                                                offer: undefined,
                                                count: undefined,
                                                deliveryMethods: [],
                                                paymentMethods: [],
                                            })
                                        }
                                    >
                                        Добавить условие
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            const selected = [...selectedConditions];
                                            selected.splice(index, 1);
                                            setSelectedConditions(selected);
                                            remove(index);
                                        }}
                                    >
                                        Удалить условие
                                    </Button>
                                )}
                            </Layout.Item>
                        </Layout>
                    );
                })
            }
        />
    );
};

const MarketingDiscounts = () => {
    const { query } = useRouter();

    const discountId = (query?.id && +query.id) || 0;

    const { data: apiDiscount } = useDiscount(discountId, 'offers, brands, categories, conditions');
    const discount = useMemo(() => apiDiscount?.data, [apiDiscount]);

    const { data: apiBrands, error: errorBrands } = useBrands();
    const brandOptions = useMemo(
        () => apiBrands?.data.map(({ name, id }) => ({ label: name, value: id })) || [],
        [apiBrands?.data]
    );
    const { data: apiCategories, error: errorCategories } = useCategories({});
    const categoryOptions = useMemo(
        () => apiCategories?.data.map(({ name, id }) => ({ label: name, value: id })) || [],
        [apiCategories?.data]
    );
    const [valueType, setValueType] = useState('');
    const [object, setObject] = useState('');

    const valueTypes = [
        { label: 'Проценты', value: '1' },
        { label: 'Рубли', value: '2' },
    ];

    const { data: apiStatuses, error: errorStatuses } = useDiscountStatuses();
    const discountStatuses = useMemo(
        () => (apiStatuses?.data ? prepareValuesForSelect(apiStatuses.data) : []),
        [apiStatuses]
    );

    const { data: apiTypes, error: errorTypes } = useDiscountTypes();
    const discountTypes = useMemo(() => (apiTypes?.data ? prepareValuesForSelect(apiTypes.data) : []), [apiTypes]);

    const { data: apiConditionTypes, error: errorConditionTypes } = useDiscountConditionTypes();
    const discountConditionTypes = useMemo(() => apiConditionTypes?.data || [], [apiConditionTypes]);

    const { data: apiConditionTypeProps, error: errorConditionTypeProps } = useDiscountConditionTypeProps();
    const discountConditionTypeProps = useMemo(() => apiConditionTypeProps?.data || [], [apiConditionTypeProps]);

    const { data: apiDeliveryMethods, error: errorDeliveryMethods } = useDeliveryMethods();
    const deliveryMethods = useMemo(() => apiDeliveryMethods?.data || [], [apiDeliveryMethods?.data]);

    const { data: apiPaymentMethods, error: errorPaymentMethods } = usePaymentMethods();
    const paymentMethods = useMemo(() => apiPaymentMethods?.data || [], [apiPaymentMethods?.data]);

    const createDiscount = useDiscountCreate();
    const editDiscount = useDiscountEdit();

    useError(
        errorBrands ||
            errorCategories ||
            errorStatuses ||
            errorTypes ||
            errorConditionTypes ||
            errorConditionTypeProps ||
            errorDeliveryMethods ||
            errorPaymentMethods ||
            createDiscount.error ||
            editDiscount.error
    );

    useSuccess(createDiscount.isSuccess || editDiscount.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');

    const isCreate = query.id === 'create';

    const formValues = useMemo(() => {
        const currentType = discount ? discountTypes.find(i => +i.value === discount.type)?.value : '';
        if (currentType) setObject(currentType);

        const prepareCondition = (condition: {} | undefined) => {
            let preparedCondition = { ...condition };

            if (preparedCondition && Object.values(preparedCondition).some(i => Array.isArray(i))) {
                preparedCondition = Object.fromEntries(
                    Object.entries(preparedCondition).map(c => {
                        if (Array.isArray(c[1])) {
                            const getLabel = (id: number) => {
                                if (c[0] === 'brands') {
                                    return brandOptions.find(item => +item.value === id)?.label;
                                }
                                if (c[0] === 'categories') {
                                    return categoryOptions.find(item => +item.value === id)?.label;
                                }
                                if (c[0] === 'deliveryMethods') {
                                    return deliveryMethods.find(item => +item.id === id)?.name;
                                }
                                if (c[0] === 'paymentMethods') {
                                    return paymentMethods.find(item => +item.id === id)?.name;
                                }
                                return '';
                            };

                            return [c[0], c[1].map(id => ({ value: id, label: getLabel(id) }))];
                        }
                        return c;
                    })
                );
            }

            return preparedCondition;
        };

        return {
            name: discount ? discount.name : '',
            discountObject: currentType,
            valueType: discount ? `${discount.value_type}` : '',
            value: discount ? `${discount.value}` : '',
            activePeriodDate: discount
                ? [
                      discount.start_date ? new Date(discount.start_date) : null,
                      discount.end_date ? new Date(discount.end_date) : null,
                  ]
                : null,
            status: discount ? `${discount.status}` : '',
            discountPromocodesOnly: discount ? discount.promo_code_only : false,
            discountCondition: '',
            // Условные поля "Скидка на"
            discountOffers: discount?.offers
                ? discount.offers
                      .filter(i => !i.except)
                      .map(i => i.offer_id)
                      .join(', ')
                : '',
            discountBrands: discount?.brands
                ? discount.brands
                      .filter(i => !i.except)
                      .map(i => ({
                          value: i.brand_id,
                          label: brandOptions.find(b => +b.value === +i.brand_id)?.label,
                      }))
                : '',
            discountOffersException: discount?.offers
                ? discount.offers
                      .filter(i => i.except)
                      .map(i => i.offer_id)
                      .join(', ')
                : '',
            discountCategories: discount?.categories
                ? discount.categories.map(i => ({
                      value: i.category_id,
                      label: categoryOptions.find(c => +c.value === +i.category_id)?.label,
                  }))
                : '',
            discountBrandsException: discount?.brands
                ? discount.brands
                      .filter(i => i.except)
                      .map(i => ({
                          value: i.brand_id,
                          label: brandOptions.find(b => +b.value === +i.brand_id)?.label,
                      }))
                : '',
            // Условные поля "Условия предоставления скидки"
            conditions: discount?.conditions
                ? discount.conditions.map(c => ({ type: c.type, ...prepareCondition(c.condition) }))
                : [
                      {
                          type: '',
                          minPrice: '',
                          brands: [],
                          categories: [],
                          offer: '',
                          count: '',
                          deliveryMethods: [],
                          paymentMethods: [],
                      },
                  ],
        };
    }, [discount, discountTypes, brandOptions, categoryOptions, deliveryMethods, paymentMethods]);

    const isRequiredProp = (type: number, name: string) =>
        discountConditionTypes.find(c => c.id === type)?.props.includes(name);

    return (
        <PageWrapper h1={isCreate ? 'Создание скидки' : `Редактировать скидку ${discountId}`}>
            <>
                <Block css={{ marginBottom: scale(3) }}>
                    {/* TODO provide right type for values */}
                    <Form<any>
                        enableReinitialize
                        initialValues={formValues}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required(ErrorMessages.REQUIRED),
                            discountObject: Yup.string().required(ErrorMessages.REQUIRED),
                            valueType: Yup.string().required(ErrorMessages.REQUIRED),
                            status: Yup.string().required(ErrorMessages.REQUIRED),
                            value: Yup.number()
                                .when('valueType', {
                                    is: (obj: string) => +obj === +valueTypes[0].value,
                                    then: Yup.number()
                                        .min(0, `${ErrorMessages.GREATER_OR_EQUAL} 0`)
                                        .max(100, `${ErrorMessages.LESS_OR_EQUAL} 100`),
                                })
                                .required(ErrorMessages.REQUIRED),
                            // Условная валидация при изменении поля "Скидка на"
                            discountOffers: Yup.string().when('discountObject', {
                                is: (obj: string) => +obj === ObjectType.Offer,
                                then: Yup.string().nullable().required(ErrorMessages.REQUIRED),
                            }),
                            discountBrands: Yup.array().when('discountObject', {
                                is: (obj: string) => +obj === ObjectType.ProductBrand,
                                then: Yup.array().nullable().required(ErrorMessages.REQUIRED),
                            }),
                            discountCategories: Yup.array().when('discountObject', {
                                is: (obj: string) => +obj === ObjectType.ProductCategory,
                                then: Yup.array().nullable().required(ErrorMessages.REQUIRED),
                            }),
                            // Условная валидация при изменении поля "Условия предоставления скидки"
                            conditions: Yup.array()
                                .nullable()
                                .of(
                                    Yup.object().shape({
                                        type: Yup.number(),
                                        minPrice: Yup.number().when('type', {
                                            is: (values: any) => isRequiredProp(values, 'minPrice'),
                                            then: Yup.number().required(ErrorMessages.REQUIRED),
                                        }),
                                        brands: Yup.array().when('type', {
                                            is: (values: any) => isRequiredProp(values, 'brands'),
                                            then: Yup.array().min(1, ErrorMessages.REQUIRED),
                                        }),
                                        categories: Yup.array().when('type', {
                                            is: (values: any) => isRequiredProp(values, 'categories'),
                                            then: Yup.array().min(1, ErrorMessages.REQUIRED),
                                        }),
                                        offer: Yup.number().when('type', {
                                            is: (values: any) => isRequiredProp(values, 'offer'),
                                            then: Yup.number().required(ErrorMessages.REQUIRED),
                                        }),
                                        count: Yup.number().when('type', {
                                            is: (values: any) => isRequiredProp(values, 'count'),
                                            then: Yup.number().required(ErrorMessages.REQUIRED),
                                        }),
                                        deliveryMethods: Yup.array().when('type', {
                                            is: (values: any) => isRequiredProp(values, 'deliveryMethods'),
                                            then: Yup.array().min(1, ErrorMessages.REQUIRED),
                                        }),
                                        paymentMethods: Yup.array().when('type', {
                                            is: (values: any) => isRequiredProp(values, 'paymentMethods'),
                                            then: Yup.array().min(1, ErrorMessages.REQUIRED),
                                        }),
                                    })
                                ),
                        })}
                        onSubmit={values => {
                            const discountType = +values.discountObject;

                            const prepareDataByType = (type: number) => {
                                switch (type) {
                                    case ObjectType.Offer: {
                                        const data = {
                                            offers: values.discountOffers.split(',').map((i: string) => ({
                                                offer_id: +i,
                                                except: false,
                                                ...(!isCreate && { discount_id: discountId }),
                                            })),
                                        };
                                        return data;
                                    }
                                    case ObjectType.ProductBrand: {
                                        const data = {
                                            offers: values.discountOffersException.split(',').map((i: string) => ({
                                                offer_id: +i,
                                                except: true,
                                                ...(!isCreate && { discount_id: discountId }),
                                            })),
                                            brands: values.discountBrands.map(
                                                (i: { label: string; value: number }) => ({
                                                    brand_id: i.value,
                                                    except: false,
                                                    ...(!isCreate && { discount_id: discountId }),
                                                })
                                            ),
                                        };

                                        return data;
                                    }
                                    case ObjectType.ProductCategory: {
                                        const data = {
                                            offers: values.discountOffersException.split(',').map((i: string) => ({
                                                offer_id: +i,
                                                except: true,
                                                ...(!isCreate && { discount_id: discountId }),
                                            })),
                                            brands: values.discountBrandsException.map(
                                                (i: { label: string; value: number }) => ({
                                                    brand_id: i.value,
                                                    except: true,
                                                    ...(!isCreate && { discount_id: discountId }),
                                                })
                                            ),
                                            categories: values.discountCategories.map(
                                                (i: { label: string; value: number }) => ({
                                                    category_id: i.value,
                                                    except: false,
                                                    ...(!isCreate && { discount_id: discountId }),
                                                })
                                            ),
                                        };

                                        return data;
                                    }
                                    default: {
                                        return null;
                                    }
                                }
                            };
                            const prepareConditions = () =>
                                values.conditions.some((item: condition) => item.type) && {
                                    conditions: values.conditions.map((i: condition) => {
                                        const currentProps = discountConditionTypes.find(c => +c.id === +i.type)?.props;

                                        return {
                                            type: i.type,
                                            condition: Object.fromEntries(
                                                Object.entries(i)
                                                    .filter(c => currentProps?.includes(c[0]))
                                                    ?.map(c =>
                                                        Array.isArray(c[1]) ? [c[0], c[1].map(d => d.value)] : c
                                                    )
                                            ),
                                        };
                                    }),
                                };

                            const data = {
                                name: values.name,
                                value_type: +values.valueType,
                                value: values.value,
                                status: +values.status,
                                promo_code_only: values.discountPromocodesOnly,
                                start_date: values.start_date && toISOString(values.start_date),
                                end_date: values.end_date && toISOString(values.end_date),
                                ...prepareDataByType(discountType),
                                ...(isCreate ? { type: discountType } : { id: discountId }),
                                ...prepareConditions(),
                            };

                            if (isCreate) {
                                createDiscount.mutate(data);
                            } else {
                                editDiscount.mutate(data);
                            }
                        }}
                    >
                        <Block.Body>
                            <Layout cols={4}>
                                <Layout.Item col={4}>
                                    <Form.Field name="name" label="Название" />
                                </Layout.Item>
                                <Layout.Item col={4}>
                                    <Layout cols={4}>
                                        <Layout.Item col={1}>
                                            <Form.Field name="discountObject" label="Скидка на">
                                                <Select
                                                    items={discountTypes}
                                                    disabled={!isCreate}
                                                    onChange={val => {
                                                        if (val.selectedItem?.value) {
                                                            setObject(`${val.selectedItem.value}`);
                                                        }
                                                    }}
                                                />
                                            </Form.Field>
                                        </Layout.Item>
                                        {object === `${ObjectType.Offer}` && (
                                            <Layout.Item col={3}>
                                                <Form.Field
                                                    name="discountOffers"
                                                    label="Офферы"
                                                    hint="ID офферов через запятую"
                                                />
                                            </Layout.Item>
                                        )}
                                        {object === `${ObjectType.ProductBrand}` && (
                                            <>
                                                <Layout.Item col={3}>
                                                    <Form.Field name="discountBrands" label="Бренды">
                                                        <MultiSelect items={brandOptions} />
                                                    </Form.Field>
                                                </Layout.Item>
                                                <Layout.Item css={{ gridColumnStart: 2, gridColumnEnd: 5 }}>
                                                    <Form.Field
                                                        name="discountOffersException"
                                                        label="За исключением офферов"
                                                        hint="ID офферов через запятую"
                                                    />
                                                </Layout.Item>
                                            </>
                                        )}

                                        {object === `${ObjectType.ProductCategory}` && (
                                            <>
                                                <Layout.Item col={3}>
                                                    <Form.Field name="discountCategories" label="Категории">
                                                        <MultiSelect items={categoryOptions} />
                                                    </Form.Field>
                                                </Layout.Item>
                                                <Layout.Item css={{ gridColumnStart: 2, gridColumnEnd: 5 }}>
                                                    <Form.Field
                                                        name="discountBrandsException"
                                                        label="За исключением брендов"
                                                    >
                                                        <MultiSelect items={brandOptions} />
                                                    </Form.Field>
                                                </Layout.Item>
                                                <Layout.Item css={{ gridColumnStart: 2, gridColumnEnd: 5 }}>
                                                    <Form.Field
                                                        name="discountOffersException"
                                                        label="За исключением офферов"
                                                        hint="ID офферов через запятую"
                                                    />
                                                </Layout.Item>
                                            </>
                                        )}
                                    </Layout>
                                </Layout.Item>
                                <Layout.Item col={4}>
                                    <Layout cols={4}>
                                        <Layout.Item col={1}>
                                            <Form.Field name="valueType" label="Тип значения">
                                                <Select
                                                    items={valueTypes}
                                                    onChange={val => {
                                                        if (val.selectedItem?.value) {
                                                            setValueType(`${val.selectedItem.value}`);
                                                        }
                                                    }}
                                                />
                                            </Form.Field>
                                        </Layout.Item>
                                        <Layout.Item col={1}>
                                            <Form.Field
                                                name="value"
                                                label={valueType === '1' ? 'Значение в процентах' : 'Значение в рублях'}
                                                type="number"
                                                hint="Значение от 0 до 100"
                                            />
                                        </Layout.Item>
                                    </Layout>
                                </Layout.Item>
                                <Layout.Item col={4}>
                                    <Layout cols={4}>
                                        <Layout.Item col={2}>
                                            <CalendarRange
                                                label="Период действия скидки"
                                                nameFrom="start_date"
                                                nameTo="end_date"
                                            />
                                        </Layout.Item>
                                    </Layout>
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.Field name="status" label="Статус">
                                        <Select items={discountStatuses} />
                                    </Form.Field>
                                </Layout.Item>
                                <Layout.Item col={4}>
                                    <Form.Field name="discountPromocodesOnly">
                                        <Checkbox value="true">Скидка действительна только по промокоду</Checkbox>
                                    </Form.Field>
                                </Layout.Item>
                            </Layout>
                        </Block.Body>
                        <Block.Body>
                            <ConditionsBlock
                                brands={brandOptions}
                                categories={categoryOptions}
                                conditionsTypes={discountConditionTypes}
                                conditionTypeProps={discountConditionTypeProps}
                                paymentMethods={paymentMethods}
                                deliveryMethods={deliveryMethods}
                            />
                        </Block.Body>
                        <Button theme="primary" css={{ margin: `${scale(5)}px ${scale(3)}px` }} type="submit">
                            Cохранить
                        </Button>
                    </Form>
                </Block>
            </>
        </PageWrapper>
    );
};

export default MarketingDiscounts;
