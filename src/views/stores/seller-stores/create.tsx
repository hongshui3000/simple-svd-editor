import { useRouter } from 'next/router';
import * as Yup from 'yup';

import PageWrapper from '@components/PageWrapper';
import Form from '@components/controls/Form';

import { useCreateStore } from '@api/units';

import { ModalMessages, ErrorMessages } from '@scripts/constants';

import { useError, useSuccess } from '@context/modal';
import { DadataSuggestion } from '@api/dadata/types';

import EditStore from './edit/[id]/EditStore';

const SellerStoresCreate = () => {
    const { push } = useRouter();
    const initialValues = {
        seller_id: '',
        name: '',
        code: '',
        address: {},
        porch: '',
        floor: '',
        intercom: '',
        comment: '',
        active: true,
    };
    const createStore = useCreateStore();

    useError(createStore.error);
    useSuccess(createStore.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');

    return (
        <PageWrapper h1="Добавление склада продавца">
            {/* TODO provide right initialValues type */}
            <Form<any>
                initialValues={initialValues}
                onSubmit={async values => {
                    const {
                        data: {
                            country_iso_code,
                            postal_code,
                            region,
                            region_fias_id,
                            area,
                            area_fias_id,
                            city,
                            city_fias_id,
                            street,
                            house,
                            flat,
                            geo_lon,
                            geo_lat,
                            block,
                        },
                        value: address_string,
                    } = values.address.value as DadataSuggestion;

                    const createdStore = await createStore.mutateAsync({
                        seller_id: +values.seller_id.value,
                        name: values.name,
                        xml_id: values.code || undefined,
                        active: values.active,
                        address: {
                            address_string,
                            country_code: country_iso_code,
                            post_index: postal_code,
                            region,
                            region_guid: region_fias_id,
                            area,
                            area_guid: area_fias_id,
                            city,
                            city_guid: city_fias_id || '',
                            street,
                            house,
                            flat,
                            porch: values.porch ? +values.porch : null,
                            floor: values.floor ? +values.floor : null,
                            intercom: values.intercom,
                            geo_lat,
                            geo_lon,
                            block,
                            comment: values.comment,
                        },
                        timezone: values.timezone.value,
                    });

                    if (createdStore.data.id) {
                        push(`/stores/seller-stores/edit/${createdStore.data.id}`);
                    }
                }}
                validationSchema={Yup.object().shape({
                    seller_id: Yup.object().required(ErrorMessages.REQUIRED),
                    name: Yup.string().required(ErrorMessages.REQUIRED),
                    code: Yup.string().required(ErrorMessages.REQUIRED),
                    address: Yup.object().required(ErrorMessages.REQUIRED),
                    timezone: Yup.object().required(ErrorMessages.REQUIRED),
                })}
            >
                <EditStore initialValues={initialValues} />
            </Form>
        </PageWrapper>
    );
};

export default SellerStoresCreate;
