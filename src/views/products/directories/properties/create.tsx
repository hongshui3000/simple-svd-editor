import { useRouter } from 'next/router';
import PageWrapper from '@components/PageWrapper';
import Form from '@components/controls/Form';
import FormChildren from '@views/products/directories/properties/[id]/FormChildren';

import { usePropertyCreate, usePropertyDirectoryCreate } from '@api/catalog';
import { ATTR_PROPS, DirectoryValueItem, generateEmptyValueForAttribute, getValidationProperties } from '../../scripts';

const ProductPropertyCreate = () => {
    const { push } = useRouter();

    const { mutateAsync: addProperty, isLoading: isLoadingAdd, error: addError } = usePropertyCreate();
    const {
        mutateAsync: addDirectory,
        isLoading: isLoadingDirectoryAdd,
        error: addDirectoryError,
    } = usePropertyDirectoryCreate();

    return (
        <PageWrapper
            h1="Создание товарного атрибута"
            isLoading={isLoadingAdd || isLoadingDirectoryAdd}
            error={addError || addDirectoryError ? JSON.stringify(addError || addDirectoryError) : undefined}
        >
            {/* TODO provide right type for values */}
            <Form<any>
                onSubmit={async values => {
                    const addPropertyValues = {
                        name: values.productNameForAdmin,
                        display_name: values.productNameForPublic,
                        type: values.attrType,
                        is_multiple: values.attrProps.includes(ATTR_PROPS.FEW_VALUES),
                        is_filterable: values.attrProps.includes(ATTR_PROPS.FILTER),
                        is_color: values.attrProps.includes(ATTR_PROPS.COLOR),
                    };
                    const { data: property } = await addProperty(addPropertyValues);

                    const promisesForAdd: Promise<any>[] = [];
                    values.additionalAttributes.forEach(({ value, code }: DirectoryValueItem) => {
                        if (value) {
                            promisesForAdd.push(
                                addDirectory({ propertyId: property.id, name: value, ...(code ? { code } : {}) })
                            );
                        }
                    });
                    await Promise.all(promisesForAdd);
                    push(`/products/directories/properties/${property.id}`);
                }}
                initialValues={{
                    attrType: '',
                    attrProps: [],
                    productNameForAdmin: '',
                    productNameForPublic: '',
                    additionalAttributes: generateEmptyValueForAttribute(),
                }}
                validationSchema={getValidationProperties()}
            >
                <FormChildren forCreate />
            </Form>
        </PageWrapper>
    );
};

export default ProductPropertyCreate;
