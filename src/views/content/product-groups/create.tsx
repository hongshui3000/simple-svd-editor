import { useMemo, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { FormikValues, useFormikContext } from 'formik';
import { useDebounce, useFieldCSS } from '@scripts/hooks';

import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';
import FilePond from '@components/controls/FilePond';

import { FilePondProps } from '@components/controls/FilePond/index';

import LoadingSkeleton from '@components/controls/LoadingSkeleton';
import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Switcher from '@components/controls/Switcher';
import Popup from '@components/controls/Popup';

import { scale, Button, useTheme, typography } from '@scripts/gds';
import { prepareEnumForSelect } from '@scripts/helpers';
import SearchIcon from '@icons/small/search.svg';
import ReorderIcon from '@icons/small/reorder.svg';
// import PlusIcon from '@icons/small/trash.svg';
// import TrashIcon from '@icons/small/trash.svg';
import {
    useCategories,
    useCreateProductGroup,
    useProducts,
    Product,
    useUpdateProductGroup,
    ProductGroupCreateParams,
    useUploadProductGroupFile,
    useDeleteProductGroupFile,
    useProductGroupFilters,
} from '@api/catalog';
import { FileTypes, LIMIT_PAGE, ErrorMessages } from '@scripts/constants';
import { Banner, BannerCreateParams } from '@api/catalog/types/banners';
import { BannerButtonLocation, BannerButtonType } from '@scripts/enums';
import {
    useCreateProductGroupBanner,
    useDeleteProductGroupBanner,
    useDeleteProductGroupBannerFile,
    useUpdateProductGroupBanner,
    useUploadProductGroupBannerFile,
} from '@api/catalog/banners';
import { useProductTypesSelectable } from '@scripts/hooks/useProductTypesSelectable';
import { useRouter } from 'next/router';
import { CSSObject } from '@emotion/core';
import MultiSelect from '@components/controls/MultiSelect';

const buttonTypeNames: {
    [key in BannerButtonType]: string;
} = {
    [BannerButtonType.BLACK]: 'Черная',
    [BannerButtonType.OUTLINE_BLACK]: 'Черная обводка',
    [BannerButtonType.OUTLINE_WHITE]: 'Белая обводка',
    [BannerButtonType.WHITE]: 'Белая',
};

const buttonLocationNames: {
    [key in BannerButtonLocation]: string;
} = {
    [BannerButtonLocation.BOTTOM]: 'Снизу',
    [BannerButtonLocation.BOTTOM_LEFT]: 'Снизу слева',
    [BannerButtonLocation.BOTTOM_RIGHT]: 'Снизу справа',
    [BannerButtonLocation.LEFT]: 'Слева',
    [BannerButtonLocation.RIGHT]: 'Справа',
    [BannerButtonLocation.TOP]: 'Сверху',
    [BannerButtonLocation.TOP_LEFT]: 'Сверху слева',
    [BannerButtonLocation.TOP_RIGHT]: 'Сверху справа',
};

const bannerImageTypes = ['desktop', 'tablet', 'mobile'];

export interface BannerValues {
    name: string;
    banner_active: boolean;
    type_id: string;
    hasBtn: boolean;
    btnUrl: string;
    btnText: string;
    btnType: string;
    btnLocation: string;
    id: number | null;
    images: File[];
    imagesUrls: (string | null)[];
}

export interface ProductGroupValues {
    name: string;
    code: string;
    active: boolean;
    is_shown: boolean;
    type_id: string;
    category_id: number | null;
    category_code: string;
    products: number[];
    preview_image: string;
    preview_images: File[];
    filters: {
        code: string;
        value: string;
    }[];
}

const preparedButtonTypes = prepareEnumForSelect(buttonTypeNames);
const preparedButtonLocations = prepareEnumForSelect(buttonLocationNames);

const Categories = ({
    initialCode,
    onSelect,
    setCategoryId,
}: {
    initialCode: string;
    onSelect: (cat_id: number) => void;
    setCategoryId: (cat_id: number) => void;
}) => {
    const [search /* setSearch */] = useState('');
    const debouncedSearch = useDebounce<string>(search, 500);
    // const { basicFieldCSS } = useFieldCSS();

    const { data: categoriesData } = useCategories({
        ...(debouncedSearch
            ? {
                  filter: {
                      id: [],
                      name: debouncedSearch,
                      code: [],
                  },
              }
            : {}),
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: LIMIT_PAGE * 0 },
    });

    const categoryOptions = useMemo(
        () =>
            categoriesData?.data.map(({ name, id }) =>
                // Важно, в опции передается именно id: number
                ({
                    label: name,
                    value: id,
                })
            ) || [],
        [categoriesData?.data]
    );

    const { setFieldValue } = useFormikContext();

    useEffect(() => {
        if (!categoriesData?.data.length) return;

        // API деталки отдает нам только код, а нам нужен id.

        const found = categoriesData?.data?.find(e => e.code === initialCode);

        if (!found) return;

        setCategoryId(found.id);
    }, [categoriesData?.data, initialCode, setCategoryId]);

    return (
        <Form.Field name="category_id" label="Категория" css={{ marginBottom: scale(2) }}>
            <Select
                defaultIndex={0}
                items={[{ value: '', label: 'Не выбрано' }, ...categoryOptions]}
                onChange={changes => {
                    // Для работы селекта и фильтров нужен category_id,
                    // для деталки - category_code.
                    const id = changes.selectedItem?.value as number;
                    const code = categoriesData?.data.find(cat => cat.id === id)?.code;

                    setFieldValue('category_code', code);
                    onSelect(id);
                }}
            />
        </Form.Field>
    );
};

const Products = () => {
    const [productCode, setProductCode] = useState('');
    const debouncedCode = useDebounce<string>(productCode, 500);

    const {
        data: apiProducts,
        refetch,
        isFetching,
        isLoading,
    } = useProducts(
        {
            filter: {
                external_id: [debouncedCode],
                code: [debouncedCode],
            },
        },
        !!debouncedCode.length
    );

    const {
        values: { products: productsSelected },
        setFieldValue,
    } =
        useFormikContext<{
            products: Product[];
        }>();

    useEffect(() => {
        if (!productsSelected) return;

        const toAdd = apiProducts?.data.filter(e => !productsSelected.find(j => j.id === e.id)) || [];

        productsSelected.push(...toAdd);

        setFieldValue('products', productsSelected);
    }, [apiProducts?.data, productsSelected, setFieldValue]);

    const { basicFieldCSS } = useFieldCSS();

    const { colors } = useTheme();

    const productBlockCSS: CSSObject = useMemo<CSSObject>(
        () => ({
            width: '100%',
            padding: `${scale(1, true)}px ${scale(1)}px`,
            border: `1px solid ${colors?.grey400}`,
            borderRadius: 2,
            ...typography('bodySm'),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }),
        [colors?.grey400]
    );

    const productBlockText: CSSObject = {
        display: 'inline-block',
    };

    const Icon = isFetching || isLoading ? ReorderIcon : SearchIcon;

    return (
        <>
            <Form.Field
                name="productsField"
                label={`Товары${productsSelected.length ? ` (${productsSelected.length})` : ''}`}
                css={{ marginBottom: scale(1) }}
            >
                <div css={{ display: 'flex', position: 'relative' }}>
                    <Icon
                        css={{
                            position: 'absolute',
                            left: scale(1),
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    />
                    <input
                        value={productCode}
                        onInput={e => setProductCode((e.target as HTMLInputElement).value)}
                        type="text"
                        css={{
                            ...basicFieldCSS,
                            paddingLeft: scale(4),
                            borderTopRightRadius: '0px',
                            borderBottomRightRadius: '0px',
                        }}
                        placeholder="Введите артикул..."
                    />
                    <Button
                        type="button"
                        css={{
                            borderTopLeftRadius: '0px!important',
                            borderBottomLeftRadius: '0px!important',
                        }}
                        onClick={() => {
                            refetch();
                        }}
                    >
                        Обновить
                    </Button>
                </div>
            </Form.Field>
            <ul css={{ marginBottom: scale(1) }}>
                {productsSelected.length
                    ? productsSelected.map((e, i) => (
                          <li key={e.name} css={{ ...productBlockCSS, marginBottom: scale(1) }}>
                              <div css={productBlockText}>
                                  <h4>{e.name}</h4>
                                  <small>Артикул: {e.external_id}</small>
                              </div>
                              <div css={productBlockText}>
                                  <Button
                                      type="button"
                                      theme="outline"
                                      onClick={() => {
                                          productsSelected.splice(i, 1);
                                          setFieldValue('products', productsSelected);
                                      }}
                                  >
                                      Удалить
                                  </Button>
                              </div>
                          </li>
                      ))
                    : ''}
            </ul>
        </>
    );
};

const downloadImg = async (fileUrl: string) => {
    if (!fileUrl || !fileUrl.length) return;

    try {
        const res = await fetch(fileUrl);
        const file = await res.blob();
        return file;
    } catch (e) {
        console.error(e);
    }
};

const FilePondWrapper = ({
    maxFiles,
    fieldName,
    urls,
}: FilePondProps & {
    urls?: string[];
    fieldName: string;
}) => {
    const { setFieldValue } = useFormikContext();

    const [files, setFiles] = useState<Blob[]>([]);

    useEffect(() => {
        let isMounted = true;

        if (urls && isMounted) {
            Promise.all(urls.map(url => downloadImg(url))).then(_files => {
                if (isMounted) {
                    setFiles(_files.filter(f => !!f) as Blob[]);
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, [urls]);

    return (
        <FilePond
            imageLayout
            files={files}
            onUpdateFiles={newFiles => {
                setFiles(newFiles);
                setFieldValue(fieldName, newFiles);
            }}
            acceptedFileTypes={FileTypes.IMAGES}
            maxFiles={maxFiles}
        />
    );
};

const BannerPopupChildren = ({ onDelete }: { onDelete: () => void }) => {
    const {
        values: { hasBtn, imagesUrls, id },
    } =
        useFormikContext<{
            hasBtn: boolean;
            imagesUrls: string[];
            id?: number;
        }>();

    const preparedTypes = useProductTypesSelectable();
    const deleteProductGroupBanner = useDeleteProductGroupBanner();

    return (
        <>
            <Form.FastField name="name" label="Наимeнование" css={{ marginBottom: scale(2) }} />
            <Form.FastField name="banner_active" css={{ marginBottom: scale(2) }}>
                <Switcher>Активность</Switcher>
            </Form.FastField>
            <Form.Field label="Тип" name="type_id" css={{ marginBottom: scale(2) }}>
                <Select items={preparedTypes} />
            </Form.Field>
            <p css={{ marginBottom: scale(1) }}>Изображения: десктопное, планшетное, мобильное</p>
            <Form.Field label="Тип" name="images" css={{ marginBottom: scale(2) }}>
                <FilePondWrapper maxFiles={3} fieldName="images" urls={imagesUrls} />
            </Form.Field>
            <Form.FastField name="hasBtn" css={{ marginBottom: scale(2) }}>
                <Switcher>С кнопкой</Switcher>
            </Form.FastField>
            {hasBtn ? (
                <>
                    <Form.FastField name="btnUrl" label="Ссылка" type="link" css={{ marginBottom: scale(2) }} />
                    <Form.FastField name="btnText" label="Текст кнопки" css={{ marginBottom: scale(2) }}>
                        {/* <Types/> */}
                    </Form.FastField>
                    <Form.FastField name="btnType" label="Тип кнопки" css={{ marginBottom: scale(2) }}>
                        <Select items={preparedButtonTypes} />
                    </Form.FastField>
                    <Form.FastField name="btnLocation" label="Местоположение кнопки" css={{ marginBottom: scale(2) }}>
                        <Select items={preparedButtonLocations} />
                    </Form.FastField>
                </>
            ) : null}
            <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Form.Reset theme="fill" css={{ marginRight: scale(2) }}>
                    Очистить
                </Form.Reset>
                {typeof id === 'number' ? (
                    <Button
                        type="button"
                        theme="outline"
                        css={{ marginRight: scale(2) }}
                        onClick={() => {
                            deleteProductGroupBanner.mutate(id);
                            onDelete();
                        }}
                    >
                        Удалить
                    </Button>
                ) : (
                    ''
                )}
                <Button type="submit">Сохранить</Button>
            </div>
        </>
    );
};

export const Filters = ({ category, isFilterable = true }: { category: number | null; isFilterable?: boolean }) => {
    const { data: filters } = useProductGroupFilters({
        category,
        filter: {
            is_filterable: isFilterable,
        },
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: LIMIT_PAGE * 0 },
    });

    const filterOptions = useMemo(
        () => filters?.data.map(({ name, code }) => ({ label: name, value: code })) || [],
        [filters?.data]
    );

    return (
        <>
            <Form.Field name="filters" label="Фильтры" css={{ marginBottom: scale(2) }}>
                <MultiSelect
                    items={filterOptions}
                    disabled={!filterOptions.length}
                    placeholder={
                        filterOptions.length
                            ? `Выберите фильтр из ${filterOptions.length}`
                            : 'Сначала выберите категорию'
                    }
                />
            </Form.Field>
        </>
    );
};

export const ContentProductGroups = ({
    isError,
    emptyBannerValues,
    initialValues,
    isEditing,
    isLoading,
    id,
    initialBanner,
}: {
    isError: boolean;
    emptyBannerValues: BannerValues;
    initialValues: ProductGroupValues;
    isEditing: boolean;
    isLoading?: boolean;
    id: number;
    initialBanner?: Banner;
}) => {
    const { push, back } = useRouter();

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [banner, setBanner] = useState<Banner | undefined>(initialBanner);
    const [bannerInitialValues, setBannerInitialValues] = useState<FormikValues>(emptyBannerValues);

    const preparedTypes = useProductTypesSelectable();
    const createProductGroup = useCreateProductGroup();
    const updateProductGroup = useUpdateProductGroup();
    const updateProductGroupBanner = useUpdateProductGroupBanner();
    const createProductGroupBanner = useCreateProductGroupBanner();

    const uploadProductGroupFile = useUploadProductGroupFile();
    const deleteProductGroupFile = useDeleteProductGroupFile();

    const uploadProductGroupBannerFile = useUploadProductGroupBannerFile();
    const deleteProductGroupBannerFile = useDeleteProductGroupBannerFile();

    const title = isEditing ? 'Редактирование подборки товара' : 'Создание подборки товара';

    if (isLoading || isError) {
        return (
            <PageWrapper h1={title}>
                <Block>
                    <Block.Body>
                        {isError ? (
                            <>
                                <h4>Произошла ошибка:</h4>
                                <p css={{ marginBottom: scale(2) }}>
                                    Подборки с номером <b>{id}</b> не существует в базе
                                </p>

                                <Form
                                    initialValues={{}}
                                    onSubmit={() => {
                                        back();
                                    }}
                                >
                                    <Button type="submit" theme="outline">
                                        Вернуться назад
                                    </Button>
                                </Form>
                            </>
                        ) : (
                            ''
                        )}
                        {[...Array(isError ? 0 : 10)].map((_: any, i: number) => (
                            <div key={i} css={{ marginBottom: scale(2), maxWidth: '75%' }}>
                                <LoadingSkeleton height={50} />
                            </div>
                        ))}
                    </Block.Body>
                </Block>
            </PageWrapper>
        );
    }

    const onGroupSubmit = async (val: FormikValues) => {
        const data: ProductGroupCreateParams = {
            name: val.name,
            code: val.code,
            active: val.active,
            is_shown: val.is_shown,
            type_id: +val.type_id,
            category_code: val.category_code,
            banner_id: banner?.id || null,
            filters: [],
            products: val.products.map((e: Product) => ({
                sort: 100,
                product_id: e.id,
            })),
        };
        await (isEditing
            ? updateProductGroup.mutateAsync({
                  ...data,
                  id,
              })
            : createProductGroup.mutateAsync(data));

        if (val.preview_images.length) {
            const formData = new FormData();
            formData.append('file', val.preview_images[0]);
            await uploadProductGroupFile.mutateAsync({
                file: formData,
                id,
            });
        } else {
            await deleteProductGroupFile.mutateAsync({
                id,
            });
        }

        push('/content/product-groups');
    };

    const onBannerSubmit = async (val: BannerValues) => {
        const data: BannerCreateParams = {
            active: val.banner_active,
            name: val.name,
            button: val.hasBtn
                ? {
                      location: val.btnLocation,
                      text: val.btnText,
                      type: val.btnType,
                      url: val.btnUrl,
                  }
                : undefined,
            button_id: null,
            type_id: +val.type_id,
        };

        const res = await (banner
            ? updateProductGroupBanner.mutateAsync({
                  ...data,
                  id: banner.id,
              })
            : createProductGroupBanner.mutateAsync(data));

        setBanner(res.data);
        setBannerInitialValues({
            ...val,
            id: res.data.id,
        });
        setIsOpen(false);

        if (banner && val.images.length === 3) {
            const urls = (
                await Promise.all(
                    val.images.map((e: File, i: number) => {
                        const formData = new FormData();
                        formData.append('type', bannerImageTypes[i]);
                        formData.append('file', e);

                        return uploadProductGroupBannerFile.mutateAsync({
                            id: banner.id,
                            formData,
                        });
                    })
                )
            ).map(e => e.data.url);

            setBannerInitialValues({
                ...val,
                id: res.data.id,
                imagesUrls: urls,
            });
        } else if (val.imagesUrls.length === 3) {
            try {
                await Promise.all(
                    bannerImageTypes.map(e => {
                        const formData = new FormData();
                        formData.append('type', e);

                        return deleteProductGroupBannerFile.mutateAsync({
                            id,
                            formData,
                        });
                    })
                );
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <PageWrapper h1={title}>
            <Block>
                <Block.Body>
                    <Form
                        onSubmit={val => {
                            onGroupSubmit(val);
                        }}
                        enableReinitialize
                        initialValues={initialValues}
                        css={{ maxWidth: '75%' }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required(ErrorMessages.REQUIRED),
                            code: Yup.string().required(ErrorMessages.REQUIRED),
                            type_id: Yup.number().required(ErrorMessages.REQUIRED),
                            category_code: Yup.string().required(ErrorMessages.REQUIRED),
                        })}
                    >
                        <Form.FastField name="name" label="Наименование" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="code" label="Символьный код" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="active" css={{ marginBottom: scale(2) }}>
                            <Switcher>Активность</Switcher>
                        </Form.FastField>
                        <Form.FastField name="is_shown" css={{ marginBottom: scale(2) }}>
                            <Switcher>Наличие в списках</Switcher>
                        </Form.FastField>
                        <Form.Field name="preview_images" label="Изображение">
                            <FilePondWrapper
                                maxFileSize="10MB"
                                maxTotalFileSize="100MB"
                                maxFiles={1}
                                fieldName="preview_images"
                                urls={[initialValues.preview_image]}
                            />
                        </Form.Field>
                        <p css={{ marginBottom: scale(1) }}>Баннер</p>
                        <Button css={{ marginBottom: scale(2) }} onClick={() => setIsOpen(true)}>
                            {typeof banner?.id === 'number' ? 'Редактировать баннер' : 'Создать баннер'}
                        </Button>
                        <Form.Field label="Тип" name="type_id" css={{ marginBottom: scale(2) }}>
                            <Select items={preparedTypes} />
                        </Form.Field>
                        <Categories
                            initialCode={initialValues.category_code}
                            onSelect={cat => setSelectedCategory(cat)}
                            setCategoryId={cat_id => {
                                initialValues.category_id = cat_id;
                                setSelectedCategory(cat_id);
                            }}
                        />
                        <Products />
                        <Filters category={selectedCategory} />
                        <Form.Reset css={{ marginRight: scale(2) }} theme="fill" size="sm">
                            Очистить
                        </Form.Reset>
                        <Button type="submit">Сохранить</Button>
                    </Form>
                </Block.Body>
            </Block>
            <Popup
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                title="Создание баннера"
                popupCss={{ minWidth: scale(75) }}
                scrollInside
            >
                <Form
                    enableReinitialize
                    onSubmit={val => {
                        onBannerSubmit(val as BannerValues);
                    }}
                    initialValues={bannerInitialValues}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required(ErrorMessages.REQUIRED),
                        type_id: Yup.number().required(ErrorMessages.REQUIRED),
                    })}
                >
                    <BannerPopupChildren
                        onDelete={() => {
                            setIsOpen(false);
                            setBanner(undefined);
                            setBannerInitialValues(emptyBannerValues);
                        }}
                    />
                </Form>
            </Popup>
        </PageWrapper>
    );
};

const ContentProductGroupsCreate = () =>
    ContentProductGroups({
        id: 0,
        isError: false,
        isEditing: false,
        emptyBannerValues: {
            name: '',
            banner_active: true,
            type_id: '',
            hasBtn: false,
            btnUrl: '',
            btnText: '',
            btnType: '',
            btnLocation: '',
            id: null,
            images: [],
            imagesUrls: [],
        },
        initialValues: {
            name: '',
            code: '',
            active: false,
            is_shown: false,
            type_id: '',
            category_id: null,
            category_code: '',
            products: [],
            preview_image: '',
            preview_images: [],
            filters: [],
        },
    });

export default ContentProductGroupsCreate;
