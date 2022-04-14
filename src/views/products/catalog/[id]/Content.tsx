import { useState } from 'react';
import * as Yup from 'yup';
import { Layout, scale, Button, typography } from '@scripts/gds';

import { ProductDetail } from '@api/catalog/types';
import {
    useProductDetailUpdate,
    useMutateProductDetailImageUpload,
    useMutateProductDetailImageAdd,
    useMutateProductDetailImageDelete,
} from '@api/catalog';

import ContentBlock from '@components/ContentBlock';
import FileInput from '@components/controls/FileInput';

import Popup from '@components/controls/Popup';
import Textarea from '@components/controls/Textarea';
import Legend from '@components/controls/Legend';
import Form from '@components/controls/Form';
import { useError, useSuccess } from '@context/modal';

import { ModalMessages, ErrorMessages } from '@scripts/constants';
import { ImageTypes, ActionType } from '@scripts/enums';
import { usePopupState } from '@scripts/hooks';

import PlusIcon from '@icons/small/plus.svg';

interface ContentProps {
    productData: ProductDetail;
    refetch: () => Promise<void>;
}

type State = {
    id?: number;
    file?: string;
    action?: ActionType;
    imageType?: ImageTypes;
    title?: string;
    open?: boolean;
};

const initialState = { file: '', action: ActionType.Close, open: false };

const imageData = [
    {
        title: 'Основное изображение',
        type: ImageTypes.BASE,
    },
    {
        title: 'Изображение для каталога',
        type: ImageTypes.CATALOG,
    },
];
const galleryImageData = {
    title: 'Изображение для галереи',
    type: ImageTypes.GALLERY,
};

const ContentWrapper = ({
    id,
    title,
    file,
    type,
    popupDispatch,
}: {
    id?: number;
    title: string;
    file?: string;
    type: ImageTypes;
    popupDispatch: (props: { type: ActionType; payload?: State }) => void;
}) => (
    <ContentBlock
        title={title}
        type="image"
        img={file}
        css={{ height: '100%', img: { display: 'block', maxHeight: scale(30), margin: '0 auto' } }}
        onEdit={() => {
            popupDispatch({
                type: ActionType.Edit,
                payload: { imageType: type, title },
            });
        }}
        onRemove={
            file && id
                ? () =>
                      popupDispatch({
                          type: ActionType.Delete,
                          payload: {
                              imageType: type,
                              title,
                              id,
                          },
                      })
                : undefined
        }
    />
);

const Content = ({ productData, refetch }: ContentProps) => {
    const [isOpenDescription, setIsOpenDescription] = useState(false);

    const [popupState, popupDispatch] = usePopupState<State>(initialState);

    const updateProduct = useProductDetailUpdate();
    const uploadImage = useMutateProductDetailImageUpload();
    const deleteImage = useMutateProductDetailImageDelete();
    const addImage = useMutateProductDetailImageAdd();

    const onEditImage = async ({ id, file }: { id: number; file?: File }) => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            await uploadImage.mutate(
                {
                    id,
                    file: formData,
                },
                {
                    onSuccess: async () => {
                        popupDispatch({ type: ActionType.Close });
                        await refetch();
                    },
                }
            );
        }
    };
    const onSaveImage = async ({ id, file }: { id: number; file: File }) => {
        if (!popupState.imageType) {
            return;
        }

        if (popupState.imageType !== galleryImageData.type) {
            const image = productData.images.find(({ type }) => type === popupState.imageType);
            if (image) {
                await onEditImage({ id: image.id, file });
                return;
            }
        }

        await addImage.mutate(
            {
                product_id: id,
                type: popupState.imageType,
            },
            {
                onSuccess: async ({ data }) => {
                    await onEditImage({ id: data.id, file });
                },
                onError: async () => {
                    await refetch();
                },
            }
        );
    };

    const descriptionImageData = productData.images.find(i => i.type === ImageTypes.DESCRIPTION);

    useError(updateProduct.error || uploadImage.error || deleteImage.error || addImage.error);

    useSuccess(
        updateProduct.status === 'success' ||
            uploadImage.status === 'success' ||
            deleteImage.status === 'success' ||
            addImage.status === 'success'
            ? ModalMessages.SUCCESS_UPDATE
            : ''
    );

    return (
        <>
            <h2 css={{ ...typography('h3'), marginBottom: scale(3) }}>Изображения</h2>
            <Layout type="flex">
                {imageData.map(image => {
                    const productImage = productData.images.find(i => i.type === image.type);
                    return (
                        <Layout.Item>
                            <ContentWrapper
                                id={productImage?.id}
                                title={image.title}
                                file={productImage?.file && productImage.file.toString()}
                                popupDispatch={popupDispatch}
                                type={image.type}
                            />
                        </Layout.Item>
                    );
                })}
                {productData.images
                    .filter(({ type }) => type === galleryImageData.type)
                    .map(galleryImage => (
                        <Layout.Item css={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <ContentWrapper
                                id={galleryImage.id}
                                title={galleryImageData.title}
                                file={galleryImage.file && String(galleryImage.file)}
                                popupDispatch={popupDispatch}
                                type={galleryImageData.type}
                            />
                        </Layout.Item>
                    ))}
                <Layout.Item css={{ display: 'flex', alignItems: 'center' }}>
                    {/* <div> */}
                    <Button
                        theme="fill"
                        onClick={() =>
                            popupDispatch({
                                type: ActionType.Edit,
                                payload: { imageType: galleryImageData.type, title: galleryImageData.title },
                            })
                        }
                        Icon={PlusIcon}
                    >
                        Добавить {galleryImageData.title.toLocaleLowerCase()}
                    </Button>
                    {/* </div> */}
                </Layout.Item>
            </Layout>

            {/* <hr css={{ margin: `${scale(3)}px 0` }} />

            <h2 css={{ ...typography('h3'), marginBottom: scale(3) }}>Особенности</h2>
            <div css={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <ul css={{ display: 'flex', flexWrap: 'wrap' }}>
                    {loadedPictures.map((i, index) => (
                        <li key={index} css={{ marginRight: scale(2) }}>
                            <ContentBlock
                                onEdit={() => setIsOpenFeatures(true)}
                                onRemove={() => null}
                                img={i}
                                type="image"
                            />
                        </li>
                    ))}
                </ul>
                <Button theme="fill"  onClick={() => setIsOpenFeatures(true)}>
                    Добавить
                </Button>
            </div> */}
            <hr css={{ margin: `${scale(3)}px 0` }} />

            <h2 css={{ ...typography('h3'), marginBottom: scale(3) }}>Описание</h2>
            <Layout cols={4}>
                <Layout.Item col={2}>
                    <ContentBlock
                        onEdit={() => setIsOpenDescription(true)}
                        type="text"
                        text={productData.description}
                    />
                </Layout.Item>
                {/* <Layout.Item col={1}>
                    <ContentBlock
                        title="Видео"
                        type="video"
                        onEdit={() => setIsOpenVideo(true)}
                        onRemove={() => null}
                    />
                </Layout.Item> */}
                <Layout.Item col={1}>
                    <ContentWrapper
                        id={descriptionImageData?.id}
                        title="Изображение для описания"
                        file={descriptionImageData?.file && String(descriptionImageData.file)}
                        popupDispatch={popupDispatch}
                        type={ImageTypes.DESCRIPTION}
                    />
                </Layout.Item>
            </Layout>
            {/* <hr css={{ margin: `${scale(3)}px 0` }} />

            <h2 css={{ ...typography('h3'), marginBottom: scale(3) }}>How to</h2>
            <Layout cols={4}>
                <Layout.Item col={2}>
                    <ContentBlock
                        title="Текст"
                        type="list"
                        textPlaceholder="Способ применения не указан"
                        text="первое|второе|третье"
                        onEdit={() => setIsOpenDescriptionHowTo(true)}
                        onRemove={() => null}
                        css={{ marginBottom: scale(2) }}
                    />
                    <ContentBlock
                        title="Инструкция"
                        css={{ marginBottom: scale(2) }}
                        onEdit={() => setIsOpenLoad(true)}
                        onRemove={() => null}
                        type="text"
                        textPlaceholder="Ничего еще не загружено"
                    >
                        <div css={{ display: 'flex', flexWrap: 'wrap', marginTop: scale(2) }}>
                            <Button  css={{ marginRight: scale(2) }} Icon={ExportIcon}>
                                Скачать
                            </Button>
                        </div>
                    </ContentBlock>
                </Layout.Item>
                <Layout.Item col={1}>
                    <ContentBlock
                        title="Видео"
                        type="video"
                        onEdit={() => setIsOpenVideo(true)}
                        onRemove={() => null}
                    />
                </Layout.Item>
                <Layout.Item col={1}>
                    <ContentBlock
                        title="Изображение"
                        type="image"
                        onEdit={() => setIsOpenLoad(true)}
                        onRemove={() => null}
                    />
                </Layout.Item>
            </Layout> */}
            <Popup
                isOpen={Boolean(popupState.open && popupState.action === ActionType.Edit)}
                onRequestClose={() => popupDispatch({ type: ActionType.Close })}
                title="Загрузка файла"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                {/* TODO provide right type for values */}
                <Form<any>
                    onSubmit={async values => {
                        onSaveImage({ id: productData.id, file: values.file });
                    }}
                    initialValues={{
                        file: null,
                    }}
                    id="file-upload"
                    validationSchema={Yup.object({}).shape({
                        file: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                >
                    <Form.Field name="file" type="file" label={popupState.title} css={{ marginBottom: scale(2) }}>
                        <FileInput accept="image/jpg,image/webp,image/png,image/svg+xml" />
                    </Form.Field>
                    <div css={{ display: 'flex' }}>
                        <Form.Reset
                            theme="outline"
                            onClick={() => popupDispatch({ type: ActionType.Close })}
                            css={{ marginRight: scale(2) }}
                            type="reset"
                        >
                            Отменить
                        </Form.Reset>
                        <Button type="submit" theme="primary">
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </Popup>
            {/* <Popup
                isOpen={isOpenFeatures}
                onRequestClose={() => setIsOpenFeatures(false)}
                title="Добавление особенностей"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                <Form
                    onSubmit={values => {
                        console.log(values);
                    }}
                    initialValues={{
                        title: '',
                    }}
                    id="file-upload"
                >
                    <Form.Field label="Название" name="title" css={{ marginBottom: scale(2) }} />
                    <input type="file" name="file" css={{ marginBottom: scale(2) }} required />
                    <div css={{ display: 'flex' }}>
                        <Form.Reset

                            theme="outline"
                            onClick={() => setIsOpenFeatures(false)}
                            css={{ marginRight: scale(2) }}
                            type="reset"
                        >
                            Отменить
                        </Form.Reset>
                        <Button type="submit"  theme="primary">
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </Popup> */}
            <Popup
                isOpen={isOpenDescription}
                onRequestClose={() => setIsOpenDescription(false)}
                title="Редактирование описания товара"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                <Form
                    onSubmit={async values => {
                        await updateProduct.mutate(
                            {
                                ...productData,
                                description: values.description,
                            },
                            { onSuccess: () => refetch() }
                        );
                        setIsOpenDescription(false);
                    }}
                    initialValues={{
                        description: productData.description,
                    }}
                    validationSchema={Yup.object().shape({
                        description: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                >
                    <Form.Field name="description" css={{ marginBottom: scale(2) }}>
                        <Legend label="Текст описания" />
                        <Textarea css={{ width: '100%' }} />
                    </Form.Field>
                    <div css={{ display: 'flex' }}>
                        <Form.Reset
                            theme="outline"
                            onClick={() => setIsOpenDescription(false)}
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
            {/* <Popup
                isOpen={isOpenDescriptionHowTo}
                onRequestClose={() => setIsOpenDescriptionHowTo(false)}
                title="Редактирование How To товара"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                <Form
                    onSubmit={values => {
                        console.log(values);
                    }}
                    initialValues={{
                        descrition: '',
                    }}
                    validationSchema={Yup.object().shape({
                        descrition: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                >
                    <Form.Field name="descrition" css={{ marginBottom: scale(2) }}>
                        <Legend
                            label="Используйте разделитель | для описания пунктов способов применения"
                            hint="Пример: Нанести|Подождать 5 минут|Смыть"
                        />
                        <Textarea css={{ width: '100%' }} />
                    </Form.Field>
                    <div css={{ display: 'flex' }}>
                        <Form.Reset

                            theme="outline"
                            onClick={() => setIsOpenDescriptionHowTo(false)}
                            css={{ marginRight: scale(2) }}
                        >
                            Отменить
                        </Form.Reset>
                        <Button type="submit"  theme="primary">
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </Popup>
            <Popup
                isOpen={isOpenVideo}
                onRequestClose={() => setIsOpenVideo(false)}
                title="Редактирование товара"
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                <Form
                    onSubmit={values => {
                        console.log(values);
                        // используй urlParser для получения кода видео ютуб
                    }}
                    initialValues={{
                        videoUrl: '',
                    }}
                    validationSchema={Yup.object().shape({
                        videoUrl: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                    id="file-upload"
                >
                    <Form.Field name="videoUrl" css={{ marginBottom: scale(2) }} label="Ссылка на видео на YouTube" />
                    <div css={{ display: 'flex' }}>
                        <Form.Reset

                            theme="outline"
                            onClick={() => setIsOpenVideo(false)}
                            css={{ marginRight: scale(2) }}
                        >
                            Отменить
                        </Form.Reset>
                        <Button type="submit"  theme="primary">
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </Popup> */}
            <Popup
                isOpen={Boolean(popupState.open && popupState.action === ActionType.Delete)}
                onRequestClose={() => popupDispatch({ type: ActionType.Close })}
                title={`Вы хотите удалить ${popupState.title?.toLocaleLowerCase()}`}
                popupCss={{ maxWidth: 'initial', width: scale(70) }}
            >
                <div css={{ display: 'flex' }}>
                    <Button
                        theme="outline"
                        onClick={() => popupDispatch({ type: ActionType.Close })}
                        css={{ marginRight: scale(2) }}
                    >
                        Отменить
                    </Button>
                    <Button
                        type="submit"
                        theme="primary"
                        onClick={async () => {
                            if (popupState.id) {
                                await deleteImage.mutate(
                                    {
                                        id: popupState.id,
                                    },
                                    {
                                        onSuccess: async () => {
                                            popupDispatch({ type: ActionType.Close });
                                            await refetch();
                                        },
                                    }
                                );
                            }
                        }}
                    >
                        Удалить
                    </Button>
                </div>
            </Popup>
        </>
    );
};

export default Content;
