import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import PageWrapper from '@components/PageWrapper';
import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import LoadWrapper from '@components/controls/LoadWrapper';

import {
    useProperty,
    usePropertyChange,
    usePropertyRemove,
    usePropertyDirectoryCreate,
    usePropertyDirectoryChange,
    usePropertyDirectoryRemove,
} from '@api/catalog';
import { scale, Button } from '@scripts/gds';

import {
    propertiesLink,
    generateEmptyValueForAttribute,
    getValidationProperties,
    dataToAttrProps,
    ATTR_PROPS,
    DirectoryValueItem,
} from '../../../scripts';
import FormChildren from './FormChildren';

const ProductPropertyChange = () => {
    const { query, push } = useRouter();
    const { id } = query;
    const propertyId = useMemo(() => (id ? +id : undefined), [id]);
    const { data: apiData, isLoading, error } = useProperty(propertyId);
    const { mutateAsync: changeProperty, isLoading: isLoadingChange, error: changeError } = usePropertyChange();
    const { mutateAsync: removeProperty, isLoading: isLoadingRemove, error: removeError } = usePropertyRemove();

    const {
        mutateAsync: addDirectory,
        isLoading: isLoadingDirectoryAdd,
        error: addDirectoryError,
    } = usePropertyDirectoryCreate();
    const {
        mutateAsync: changeDirectory,
        isLoading: isLoadingDirectoryChange,
        error: changeDirectoryError,
    } = usePropertyDirectoryChange();
    const {
        mutateAsync: removePropertyDirectory,
        isLoading: isLoadinDirectorygRemove,
        error: removeDirectoryError,
    } = usePropertyDirectoryRemove();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const propertyData = useMemo(() => (apiData ? apiData.data : null), [apiData]);
    const errors = useMemo(() => {
        const errs =
            error || changeError || addDirectoryError || removeError || changeDirectoryError || removeDirectoryError;
        return errs ? JSON.stringify(errs) : undefined;
    }, [error, changeError, addDirectoryError, removeError, changeDirectoryError, removeDirectoryError]);

    const pushToPropertiesList = () => {
        push(propertiesLink);
    };

    return (
        <PageWrapper
            h1="Редактирование товарного атрибута"
            isLoading={
                isLoading ||
                isLoadingChange ||
                isLoadingDirectoryChange ||
                isLoadingDirectoryAdd ||
                isLoadinDirectorygRemove
            }
            error={errors}
        >
            {propertyId && propertyData ? (
                <Form
                    onSubmit={async values => {
                        const { productNameForAdmin, productNameForPublic, attrType, attrProps, additionalAttributes } =
                            values;

                        const addPropertyValues = {
                            id: propertyId,
                            name: productNameForAdmin,
                            display_name: productNameForPublic,
                            type: attrType,
                            is_multiple: attrProps.includes(ATTR_PROPS.FEW_VALUES),
                            is_filterable: attrProps.includes(ATTR_PROPS.FILTER),
                            is_color: attrProps.includes(ATTR_PROPS.COLOR),
                        };

                        const directoryPromises: Promise<any>[] = [];
                        const additionalAttributesWithValues: DirectoryValueItem[] = additionalAttributes.filter(
                            ({ value }: DirectoryValueItem) => value
                        );

                        if (additionalAttributesWithValues.length) {
                            additionalAttributesWithValues.forEach(({ value, name, code }: DirectoryValueItem) => {
                                const attr = propertyData.directory?.find(directoryItem => directoryItem.code === name);

                                if (attr && (attr.name !== value || attr.code !== code)) {
                                    directoryPromises.push(
                                        changeDirectory({
                                            directoryId: attr.id,
                                            name: value,
                                            ...(code ? { code } : {}),
                                        })
                                    );
                                } else if (!attr) {
                                    directoryPromises.push(
                                        addDirectory({ propertyId, name: value, ...(code ? { code } : {}) })
                                    );
                                }
                            });

                            const attributesNameList = additionalAttributesWithValues.map(({ name }) => name);
                            const deletedValues =
                                propertyData.directory?.filter(value => !attributesNameList.includes(value.code)) || [];

                            deletedValues.forEach(value => {
                                directoryPromises.push(removePropertyDirectory(value.id));
                            });
                            await Promise.all(directoryPromises);
                        }

                        await changeProperty(addPropertyValues);
                        pushToPropertiesList();
                    }}
                    initialValues={{
                        attrType: propertyData.type,
                        attrProps: dataToAttrProps(propertyData) || [],
                        productNameForAdmin: propertyData.name,
                        productNameForPublic: propertyData.display_name,
                        additionalAttributes: propertyData.directory?.length
                            ? propertyData.directory.map(({ name, code }) => ({ value: name, name: code, code }))
                            : generateEmptyValueForAttribute(),
                    }}
                    validationSchema={getValidationProperties()}
                >
                    <FormChildren removeAttribute={() => setIsPopupOpen(true)} />
                </Form>
            ) : null}
            <Popup
                isOpen={isPopupOpen}
                onRequestClose={() => setIsPopupOpen(false)}
                title="Вы уверены, что хотите удалить атрибут?"
                popupCss={{ minWidth: scale(50) }}
            >
                <LoadWrapper isLoading={isLoadingRemove}>
                    <Button
                        type="button"
                        onClick={async () => {
                            if (propertyId) {
                                await removeProperty(propertyId);
                                pushToPropertiesList();
                            }
                        }}
                    >
                        Удалить
                    </Button>
                </LoadWrapper>
            </Popup>
        </PageWrapper>
    );
};

export default ProductPropertyChange;
