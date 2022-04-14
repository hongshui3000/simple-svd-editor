import { useProductGroup } from '@api/catalog';
import { Banner } from '@api/catalog/types/banners';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BannerValues, ContentProductGroups, ProductGroupValues } from './create';

const ContentProductGroupsCreate = () => {
    const {
        query: { id },
    } = useRouter();

    const parsedId = +`${id}`;

    const {
        data: apiProductGroup,
        isError,
        isLoadingError,
        isRefetchError,
        isLoading,
        isIdle,
    } = useProductGroup({
        sort: ['id'],
        include: ['banner'],
        pagination: {
            limit: 10,
            offset: 0,
            type: 'offset',
        },
        filter: {
            id: parsedId,
        }
    });

    const [initialValues, setInitialValues] = useState<ProductGroupValues>({
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
    });

    const [emptyBannerValues, setEmptyBannerValues] = useState<BannerValues>({
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
    });

    const [initialBanner, setInitialBanner] = useState<Banner>();

    useEffect(
        () => {
            if(apiProductGroup?.data) {
                const {
                    active,
                    category_code,
                    code,
                    is_shown,
                    name,
                    type_id,
                    preview_photo,
                    filters,
                    products,
                } = apiProductGroup.data;

                setInitialValues({
                    active,
                    category_id: null,
                    category_code,
                    code,
                    is_shown,
                    name,
                    type_id: type_id.toString(),
                    products: products?.map(e => e.product_id) || [],
                    preview_images: initialValues.preview_images,
                    preview_image: preview_photo || '',
                    filters: filters || [],
                });
            }

            if (apiProductGroup?.data.banner) {
                setInitialBanner(apiProductGroup.data.banner);

                // TODO: проверить что объект button содержится, пнуть бэкеров
                // console.log(apiProductGroup?.data.banner);

                const {
                    name,
                    active,
                    type_id,
                    button,
                    desktop_image,
                    tablet_image,
                    mobile_image,
                } = apiProductGroup.data.banner;

                setEmptyBannerValues({
                    name,
                    banner_active: active,
                    type_id: type_id.toString(),
                    hasBtn: !!button,
                    btnUrl: button?.url || '',
                    btnText: button?.text || '',
                    btnType: button?.type || '',
                    btnLocation: button?.location || '',
                    images: [],
                    imagesUrls: [desktop_image, tablet_image, mobile_image],
                    id: apiProductGroup.data.banner?.id,
                });
            }
        },
        [apiProductGroup?.data, initialValues.preview_images]
    );

    const anyError = isError || isLoadingError || isRefetchError;

    return <ContentProductGroups
        isLoading={isLoading || isIdle}
        isError={anyError}
        isEditing
        id={parsedId}
        emptyBannerValues={emptyBannerValues}
        initialValues={initialValues}
        initialBanner={initialBanner}
    />;
}

export default ContentProductGroupsCreate;
