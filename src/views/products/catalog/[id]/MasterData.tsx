import { useState, useMemo, Fragment } from 'react';
import { Layout, scale, Button, typography } from '@scripts/gds';
import { FieldArray, useFormikContext } from 'formik';

import { ProductDetail } from '@api/catalog/types';
import { useProperties } from '@api/catalog/properties';
import { useProductDetailUpdate, useBrands, useCategories, useProductDetailAttributesUpdate } from '@api/catalog';

import Block from '@components/Block';
import Badge from '@components/controls/Badge';

import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import MultiSelect from '@components/controls/MultiSelect';
import Legend from '@components/controls/Legend';
import Textarea from '@components/controls/Textarea';
import CheckboxGroup from '@components/controls/CheckboxGroup';
import Checkbox from '@components/controls/Checkbox';
import LoadWrapper from '@components/controls/LoadWrapper';
import CalendarInput from '@components/controls/CalendarInput';
import { useError, useSuccess } from '@context/modal';

import { ModalMessages } from '@scripts/constants';
import { PropertyTypes } from '@scripts/enums';

import RemoveIcon from '@icons/small/trash.svg';
import PlusIcon from '@icons/small/plus.svg';
import EditIcon from '@icons/small/edit.svg';

interface MasterDataProp {
    productData: ProductDetail;
    refetch: () => Promise<void>;
}

const FieldArrayBlock = ({ name }: { name: string }) => {
    const { values } = useFormikContext<any>();
    const fieldValue = values[name];
    return (
        <FieldArray
            name={name}
            render={({ push, remove }) => (
                <>
                    <Layout.Item col={2}>
                        <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {name}
                            <Button hidden theme="outline" Icon={PlusIcon} onClick={() => push('')}>
                                добавить
                            </Button>
                        </div>
                    </Layout.Item>
                    <Layout.Item col={3}>
                        <ul>
                            {fieldValue.map((i: any, index: number) => (
                                <li key={name} css={{ display: 'flex', alignItems: 'center', marginBottom: scale(1) }}>
                                    <Form.Field name={`${name}[${index}]`} css={{ marginRight: scale(1) }} />
                                    <Button theme="outline" hidden Icon={RemoveIcon} onClick={() => remove(index)}>
                                        удалить
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </Layout.Item>
                </>
            )}
        />
    );
};

const MasterData = ({ productData, refetch }: MasterDataProp) => {
    const [isChangeCharsOpen, setIsChangeCharsOpen] = useState(false);
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
    const [isBadgeOpen, setIsBadgeOpen] = useState(false);

    const { attributes, brand, category } = productData;

    const { data: apiDataProperties } = useProperties(
        {
            filter: { id: attributes?.map(({ property_id }) => property_id) },
            include: ['directory'],
            pagination: {
                limit: -1,
                offset: 0,
                type: 'offset',
            },
        },
        Boolean(attributes?.length)
    );
    const { data: apiDataBrands, error: apiErrorBrands } = useBrands({
        pagination: {
            limit: -1,
            offset: 0,
            type: 'offset',
        },
    });
    const { data: apiDataCategories, error: apiErrorCategories } = useCategories({
        pagination: {
            limit: -1,
            offset: 0,
            type: 'offset',
        },
    });

    const updateProduct = useProductDetailUpdate();

    const updateAttributes = useProductDetailAttributesUpdate();

    const properties = useMemo(() => apiDataProperties?.data, [apiDataProperties]);

    const selectedProperties = useMemo(
        () =>
            properties?.map(p => {
                const attribute = attributes?.find(({ property_id }) => property_id === p.id);
                return { ...p, value: attribute?.value };
            }),
        [properties, attributes]
    );

    useError(apiErrorBrands || apiErrorCategories || updateProduct.error || updateAttributes.error);

    useSuccess(
        updateProduct.status === 'success' || updateAttributes.status === 'success' ? ModalMessages.SUCCESS_UPDATE : ''
    );

    return (
        <>
            <Button theme="outline">Убрать в архив</Button>
            <Layout cols={4} css={{ marginTop: scale(2) }}>
                <Layout.Item col={1}>
                    <Block>
                        <Block.Header>
                            <p css={typography('h3')}>Характеристики</p>
                            <Button
                                Icon={EditIcon}
                                type="button"
                                theme="ghost"
                                hidden
                                onClick={() => setIsChangeCharsOpen(true)}
                            >
                                редактировать
                            </Button>
                        </Block.Header>
                        {selectedProperties && (
                            <Block.Body>
                                <table width="100%">
                                    <tbody>
                                        {selectedProperties.map(property => (
                                            <tr>
                                                <th
                                                    css={{
                                                        textAlign: 'left',
                                                        verticalAlign: 'top',
                                                        paddingRight: scale(2),
                                                    }}
                                                >
                                                    {property.display_name}
                                                </th>
                                                <td css={{ textAlign: 'right' }}>
                                                    {property.type === PropertyTypes.DIRECTORY
                                                        ? property.directory
                                                              ?.reduce((acc, p) => {
                                                                  if (property.value?.indexOf(`${p.id}`) !== -1) {
                                                                      acc.push(p.name);
                                                                  }
                                                                  return acc;
                                                              }, [] as string[])
                                                              .join(', ')
                                                        : property.value?.join(', ')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Block.Body>
                        )}
                    </Block>
                </Layout.Item>
                <Layout.Item col={1}>
                    <Block>
                        <Block.Header>
                            <p css={typography('h3')}>Состав</p>
                            <Button
                                Icon={EditIcon}
                                type="button"
                                theme="ghost"
                                hidden
                                onClick={() => setIsContentOpen(true)}
                            >
                                редактировать
                            </Button>
                        </Block.Header>
                        <Block.Body>{productData.ingredients || 'Заполните состав'}</Block.Body>
                    </Block>
                </Layout.Item>
                <Layout.Item col={1}>
                    <Block>
                        <Block.Header>
                            <p css={typography('h3')}>Свойства товара</p>
                            <Button
                                Icon={EditIcon}
                                type="button"
                                theme="ghost"
                                hidden
                                onClick={() => setIsPropertiesOpen(true)}
                            >
                                редактировать
                            </Button>
                        </Block.Header>
                        <Block.Body>
                            <table width="100%">
                                <tbody>
                                    {category && (
                                        <tr>
                                            <th css={{ textAlign: 'left', paddingRight: scale(2) }}>Категория</th>
                                            <td css={{ textAlign: 'right' }}>{category.name}</td>
                                        </tr>
                                    )}
                                    {brand && (
                                        <tr>
                                            <th css={{ textAlign: 'left', paddingRight: scale(2) }}>Бренд</th>
                                            <td css={{ textAlign: 'right' }}>{brand.name}</td>
                                        </tr>
                                    )}
                                    {productData.length ? (
                                        <tr>
                                            <th css={{ textAlign: 'left', paddingRight: scale(2) }}>Длинна</th>
                                            <td css={{ textAlign: 'right' }}>{productData.length}</td>
                                        </tr>
                                    ) : null}
                                    {productData.width ? (
                                        <tr>
                                            <th css={{ textAlign: 'left', paddingRight: scale(2) }}>Ширина</th>
                                            <td css={{ textAlign: 'right' }}>{productData.width}</td>
                                        </tr>
                                    ) : null}
                                    {productData.height ? (
                                        <tr>
                                            <th css={{ textAlign: 'left', paddingRight: scale(2) }}>Высота</th>
                                            <td css={{ textAlign: 'right' }}>{productData.height}</td>
                                        </tr>
                                    ) : null}
                                    {productData.weight ? (
                                        <tr>
                                            <th css={{ textAlign: 'left', paddingRight: scale(2) }}>Вес</th>
                                            <td css={{ textAlign: 'right' }}>{productData.weight}</td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </Block.Body>
                    </Block>
                </Layout.Item>
                <Layout.Item col={1}>
                    <Block>
                        <Block.Header>
                            <p css={typography('h3')}>Шильдики на товаре</p>
                            <Button
                                Icon={EditIcon}
                                type="button"
                                theme="ghost"
                                hidden
                                onClick={() => setIsBadgeOpen(true)}
                            >
                                редактировать
                            </Button>
                        </Block.Header>
                        <Block.Body>
                            <ul
                                css={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    li: { marginRight: scale(1) },
                                }}
                            >
                                {productData.is_new && (
                                    <li>
                                        <Badge text="Новинки" />
                                    </li>
                                )}
                            </ul>
                        </Block.Body>
                    </Block>
                </Layout.Item>
            </Layout>
            <Popup
                isOpen={isChangeCharsOpen}
                onRequestClose={() => setIsChangeCharsOpen(false)}
                title="Редактирование характеристик товара"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                {/* TODO provide right type for values */}
                <Form<any>
                    onSubmit={async data => {
                        const values = Object.entries(data).map(([id, valueField]: any) => ({
                            property_id: Number(id),
                            value: Array.isArray(valueField)
                                ? valueField.map(v => v?.value || v)
                                : valueField?.value || valueField,
                        }));
                        await updateAttributes.mutate({ id: productData.id, values }, { onSuccess: () => refetch() });
                        setIsChangeCharsOpen(false);
                    }}
                    initialValues={{
                        ...selectedProperties?.reduce((values, p) => {
                            if (p.type === PropertyTypes.DIRECTORY) {
                                values[p.id] = p.directory
                                    .filter(({ id }) => p.value?.indexOf(`${id}`) !== -1)
                                    .map(({ id, name }) => ({ value: id, label: name }));
                                return values;
                            }
                            values[p.id] = p.is_multiple ? p.value : p.value && p.value[0];
                            return values;
                        }, {} as any),
                    }}
                >
                    <Layout cols={5} css={{ marginBottom: scale(2) }}>
                        <Layout.Item col={2} css={typography('smallBold')}>
                            Характеристика
                        </Layout.Item>
                        <Layout.Item col={3} css={typography('smallBold')}>
                            Значение
                        </Layout.Item>
                        {selectedProperties?.map(property => (
                            <Fragment key={`edit-property-${property.id}`}>
                                <Layout.Item col={2}>{property.display_name}</Layout.Item>
                                <Layout.Item col={3}>
                                    {property.type === PropertyTypes.DIRECTORY && (
                                        <Form.Field name={String(property.id)}>
                                            {property.is_multiple ? (
                                                <MultiSelect
                                                    items={property.directory.map(d => ({
                                                        value: d.id,
                                                        label: d.name,
                                                    }))}
                                                />
                                            ) : (
                                                <Select
                                                    items={property.directory.map(d => ({
                                                        value: d.id,
                                                        label: d.name,
                                                    }))}
                                                />
                                            )}
                                        </Form.Field>
                                    )}
                                    {property.type !== PropertyTypes.DIRECTORY && property.is_multiple && (
                                        <>
                                            <FieldArrayBlock name={String(property.id)} />
                                        </>
                                    )}
                                    {property.type !== PropertyTypes.DIRECTORY && !property.is_multiple && (
                                        <Form.Field name={String(property.id)} />
                                    )}
                                    {property.type === PropertyTypes.DATETIME && !property.is_multiple && (
                                        <>
                                            <Form.Field name={String(property.id)}>
                                                <CalendarInput />
                                            </Form.Field>
                                        </>
                                    )}
                                    {property.type === PropertyTypes.BOOLEAN && !property.is_multiple && (
                                        <>
                                            <Form.Field name={String(property.id)}>
                                                <Checkbox>Да</Checkbox>
                                            </Form.Field>
                                        </>
                                    )}
                                </Layout.Item>
                            </Fragment>
                        ))}
                    </Layout>
                    <div css={{ display: 'flex' }}>
                        <Form.Reset
                            theme="outline"
                            onClick={() => setIsChangeCharsOpen(false)}
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
            <Popup
                isOpen={isContentOpen}
                onRequestClose={() => setIsContentOpen(false)}
                title="Редактирование состава товара"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                <LoadWrapper
                    isLoading={updateProduct.isLoading}
                    error={updateProduct?.error ? JSON.stringify(updateProduct.error) : undefined}
                >
                    <Form
                        onSubmit={async values => {
                            await updateProduct.mutate(
                                { ...productData, ingredients: values.content },
                                { onSuccess: () => refetch() }
                            );
                            setIsContentOpen(false);
                        }}
                        initialValues={{ content: productData.ingredients || '' }}
                    >
                        <Form.Field name="content">
                            <Legend label="Введите состав" />
                            <Textarea css={{ width: '100%', marginBottom: scale(2) }} />
                        </Form.Field>
                        <div css={{ display: 'flex' }}>
                            <Form.Reset
                                theme="outline"
                                onClick={() => setIsContentOpen(false)}
                                css={{ marginRight: scale(2) }}
                            >
                                Отменить
                            </Form.Reset>
                            <Button type="submit" theme="primary">
                                Сохранить
                            </Button>
                        </div>
                    </Form>
                </LoadWrapper>
            </Popup>
            <Popup
                isOpen={isPropertiesOpen}
                onRequestClose={() => setIsPropertiesOpen(false)}
                title="Редактирование товара"
                id="-product-edit"
                scrollInside
                popupCss={{
                    maxWidth: 'initial',
                    width: scale(70),
                }}
            >
                {/* TODO provide right type for values */}
                <Form<any>
                    onSubmit={async values => {
                        const { name, vendorCode, brandId, categoryId, width, height, length, weight } = values;
                        await updateProduct.mutate(
                            {
                                ...productData,
                                name,
                                brand_id: brandId,
                                external_id: vendorCode,
                                category_id: categoryId,
                                width,
                                height,
                                weight,
                                length,
                            },
                            { onSuccess: () => refetch() }
                        );
                        setIsPropertiesOpen(false);
                    }}
                    initialValues={{
                        name: productData.name,
                        vendorCode: productData.external_id,
                        brand: productData.brand_id,
                        category: productData.category_id,
                        width: productData.width,
                        height: productData.height,
                        weight: productData.weight,
                        length: productData.length,
                    }}
                >
                    <Layout cols={2} css={{ marginBottom: scale(4) }}>
                        <Layout.Item col={2}>
                            <Form.Field name="name" label="Название товара" />
                        </Layout.Item>
                        <Layout.Item col={2}>
                            <Form.Field name="vendorCode" label="Артикул" />
                        </Layout.Item>
                        <Layout.Item col={2}>
                            <hr />
                        </Layout.Item>
                        {apiDataBrands && (
                            <Layout.Item col={2}>
                                <Form.Field name="brandId" label="Бренд">
                                    <Select
                                        items={apiDataBrands.data.map(({ id, name }) => ({ label: name, value: id }))}
                                    />
                                </Form.Field>
                            </Layout.Item>
                        )}
                        {apiDataCategories && (
                            <Layout.Item col={2}>
                                <Form.Field name="categoryId" label="Категория">
                                    <Select
                                        items={apiDataCategories.data.map(({ id, name }) => ({
                                            label: name,
                                            value: id,
                                        }))}
                                    />
                                </Form.Field>
                            </Layout.Item>
                        )}
                        <Layout.Item col={2}>
                            <hr />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field type="number" name="depth" label="Длина, мм" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field type="number" name="width" label="Ширина, мм" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field type="number" name="height" label="Высота, мм" />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field type="number" name="weight" label="Вес, гр" />
                        </Layout.Item>
                    </Layout>
                    <div css={{ display: 'flex' }}>
                        <Form.Reset
                            theme="outline"
                            onClick={() => setIsPropertiesOpen(false)}
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
            <Popup
                isOpen={isBadgeOpen}
                onRequestClose={() => setIsBadgeOpen(false)}
                title="Редактирование шильдиков товара"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                <Form
                    onSubmit={async values => {
                        const { badges } = values;
                        await updateProduct.mutate(
                            {
                                ...productData,
                                is_new: badges.indexOf('new') !== -1,
                            },
                            { onSuccess: () => refetch() }
                        );
                        setIsBadgeOpen(false);
                    }}
                    initialValues={{
                        badges: [productData.is_new ? 'new' : ''],
                    }}
                >
                    <Form.Field name="badges" css={{ marginBottom: scale(2) }}>
                        <CheckboxGroup label="Шильдики">
                            <Checkbox value="new">Новинки</Checkbox>
                        </CheckboxGroup>
                    </Form.Field>

                    <div css={{ display: 'flex' }}>
                        <Form.Reset
                            theme="outline"
                            onClick={() => setIsBadgeOpen(false)}
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

export default MasterData;
