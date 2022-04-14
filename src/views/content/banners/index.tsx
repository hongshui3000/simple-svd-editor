import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormikContext } from 'formik';
import { scale, Button } from '@scripts/gds';
import * as Yup from 'yup';

import { BannerButtonType, BannerButtonLocation } from '@scripts/enums';

import { FileTypes } from '@scripts/constants';
import { prepareEnumForSelect } from '@scripts/helpers';

import PageWrapper from '@components/PageWrapper';
import FilePond from '@components/controls/FilePond';

import Block from '@components/Block';
import { FilePondProps } from '@components/controls/FilePond/index';

import Form from '@components/controls/Form';
import Select, { SelectItemProps } from '@components/controls/Select';
import Switcher from '@components/controls/Switcher';

import {
    useBannerTypes,
    useBanner,
    useCreateBanner,
    useUpdateBanner,
    useUploadBannerFile,
    useDeleteBannerFile,
} from '@api/content/banners';

export interface BannerValues {
    title: string;
    isActive: boolean;
    type: number[];
    link: string;
    hasBtn: boolean;
    btnText: string;
    btnType: string;
    btnPosition: string;
}

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
const preparedButtonTypes = prepareEnumForSelect(buttonTypeNames);
const preparedButtonLocations = prepareEnumForSelect(buttonLocationNames);

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
        if (!urls || urls.length === 0) return;
        Promise.all(urls.map(url => downloadImg(url))).then(_files => {
            setFiles(_files.filter(f => !!f) as Blob[]);
        });
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

const BannerPopupChildren = () => {
    const {
        values: { hasBtn, imagesUrls },
    } = useFormikContext<{ hasBtn: boolean; imagesUrls: string[] }>();

    const { data: apiTypes } = useBannerTypes({});

    const preparedTypes = useMemo(
        () =>
            apiTypes?.data.reduce<SelectItemProps[]>(
                (acc, type) => (type.active ? [...acc, { label: type.name, value: type.id }] : acc),
                []
            ) || [],
        [apiTypes]
    );

    return (
        <>
            <Form.FastField name="title" label="Наимeнование" css={{ marginBottom: scale(2) }} />
            <Form.FastField name="isActive" css={{ marginBottom: scale(2) }}>
                <Switcher>Активность</Switcher>
            </Form.FastField>
            <Form.Field
                label="Изображения: десктопное, планшетное, мобильное"
                name="images"
                css={{ marginBottom: scale(2) }}
            >
                <FilePondWrapper imageLayout maxFiles={3} fieldName="images" urls={imagesUrls} />
            </Form.Field>
            <Form.Field label="Тип" name="type" css={{ marginBottom: scale(2) }}>
                <Select items={preparedTypes} />
            </Form.Field>
            <Form.FastField name="hasBtn" css={{ marginBottom: scale(2) }}>
                <Switcher>С кнопкой</Switcher>
            </Form.FastField>
            {hasBtn ? (
                <>
                    <Form.FastField name="link" label="Ссылка" type="link" css={{ marginBottom: scale(2) }} />
                    <Form.FastField name="btnText" label="Текст кнопки" css={{ marginBottom: scale(2) }} />
                    <Form.FastField name="btnType" label="Тип кнопки" css={{ marginBottom: scale(2) }}>
                        <Select items={preparedButtonTypes} />
                    </Form.FastField>
                    <Form.FastField name="btnPosition" label="Местоположение кнопки" css={{ marginBottom: scale(2) }}>
                        <Select items={preparedButtonLocations} />
                    </Form.FastField>
                </>
            ) : null}
            <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Form.Reset theme="fill" css={{ marginRight: scale(2) }}>
                    Очистить
                </Form.Reset>
                <Button type="submit">Сохранить</Button>
            </div>
        </>
    );
};

const ContentBanners = () => {
    const {
        query: { id },
        push,
    } = useRouter();

    const parsedId = +`${id}`;
    const isNewBanner = id === 'create';

    const createBanner = useCreateBanner();
    const updateBanner = useUpdateBanner();
    const uploadBannerFile = useUploadBannerFile();
    const deleteBannerFile = useDeleteBannerFile();

    const bannerObj = useBanner({
        sort: ['id'],
        include: ['button'],
        pagination: {
            limit: 10,
            offset: 0,
            type: 'offset',
        },
        filter: {
            id: parsedId,
        },
    });

    const banner = bannerObj?.data?.data;

    const initialValues = useMemo(() => {
        if (!banner) {
            return {
                title: '',
                isActive: true,
                type: '',
                link: '',
                imagesUrls: [],
                images: [],
                hasBtn: false,
                btnText: '',
                btnType: '',
                btnPosition: '',
            };
        }

        return {
            title: banner.name,
            isActive: banner.active,
            type: banner.type_id,
            link: banner?.button?.url || '',
            imagesUrls: [banner?.desktop_image, banner?.tablet_image, banner?.mobile_image],
            hasBtn: !!banner?.button,
            btnText: banner?.button?.text || '',
            btnType: banner?.button?.type || '',
            btnPosition: banner?.button?.location || '',
        };
    }, [banner]);

    return (
        <PageWrapper
            h1={isNewBanner ? 'Создать баннер' : `Редактировать баннер ${id}`}
            isLoading={
                bannerObj.isLoading ||
                createBanner.isLoading ||
                updateBanner.isLoading ||
                uploadBannerFile.isLoading ||
                deleteBannerFile.isLoading
            }
        >
            <Block css={{ marginBottom: scale(2), maxWidth: '75%' }}>
                <Block.Body>
                    {/* TODO заменить any на реальны тип */}
                    <Form<any>
                        onSubmit={async values => {
                            let createdId: number;
                            const newData = {
                                name: values.title,
                                active: values.isActive,
                                type_id: values.type,
                                ...(values.hasBtn && {
                                    button: {
                                        url: values.link,
                                        text: values.btnText,
                                        location: values.btnPosition,
                                        type: values.btnType,
                                    },
                                }),
                            };

                            if (isNewBanner) {
                                createdId = (await createBanner.mutateAsync(newData)).data.id;
                            } else if (typeof id === 'number') {
                                await updateBanner.mutateAsync({ id, ...newData });

                                if (values.imagesUrls.length > values.images.length) {
                                    await Promise.all(
                                        bannerImageTypes
                                            .filter((type, index) => index + 1 > values.imgaes.length)
                                            .map(type => {
                                                const formData = new FormData();
                                                formData.append('type', type);
                                                return deleteBannerFile.mutate({
                                                    id: +id,
                                                    formData,
                                                });
                                            })
                                    );
                                }
                            }

                            if (values.images.length > 0 && typeof id === 'number') {
                                await Promise.all(
                                    values.images.map((e: File, i: number) => {
                                        const formData = new FormData();
                                        formData.append('type', bannerImageTypes[i]);
                                        formData.append('file', e);

                                        return uploadBannerFile.mutateAsync({
                                            formData,
                                            id: +createdId || +id,
                                        });
                                    })
                                );
                            }

                            push('/content/banners');
                        }}
                        initialValues={initialValues}
                        validationSchema={Yup.object().shape({
                            title: Yup.string().required('Обязательное поле'),
                            type: Yup.string().required('Обязательное поле'),
                            link: Yup.string().when('hasBtn', {
                                is: true,
                                then: Yup.string().required('Обязательное поле'),
                                otherwise: Yup.string(),
                            }),
                            btnText: Yup.string().when('hasBtn', {
                                is: true,
                                then: Yup.string().required('Обязательное поле'),
                                otherwise: Yup.string(),
                            }),
                            btnType: Yup.string().when('hasBtn', {
                                is: true,
                                then: Yup.string().required('Обязательное поле'),
                                otherwise: Yup.string(),
                            }),
                            btnPosition: Yup.string().when('hasBtn', {
                                is: true,
                                then: Yup.string().required('Обязательное поле'),
                                otherwise: Yup.string(),
                            }),
                        })}
                        enableReinitialize
                    >
                        <BannerPopupChildren />
                    </Form>
                </Block.Body>
            </Block>
        </PageWrapper>
    );
};

export default ContentBanners;
