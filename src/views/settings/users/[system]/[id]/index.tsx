import { useMemo, useState, Fragment } from 'react';
import * as Yup from 'yup';
import { Button, scale, Layout } from '@scripts/gds';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import { format } from 'date-fns';

import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import LoadWrapper from '@components/controls/LoadWrapper';

import { getTextValueByBoolean } from '@scripts/helpers';

import EditIcon from '@icons/small/edit.svg';
import TrashIcon from '@icons/small/trash.svg';
import { useLinkCSS } from '@scripts/hooks';
import { AdminUser, AdminUserMutateWithId, SellerUser, SellerUserMutateWithId } from '@api/units';
import { UserMutate } from '@api/customers';

import AddOrChangeUserPopup from '../AddOrChangeUserPopup';
import UserRolesContainer from './UserRoles';

import {
    FIELD_TYPES,
    infoForFieldMap,
    SYSTEMS,
    userPageFields,
    emptyInitialChangeUserValues,
    validationForChangeUser,
    getInitialValues,
    formValuesToApiFormat,
    ApiResponseData,
} from '../scripts';
import { useGetRequests, useTableStyles } from '../scripts/hooks';

const User = () => {
    const { query } = useRouter();

    const id = Number(query.id);
    const system = query.system as SYSTEMS;

    const { h3Styles, blockBodyStyles, dlStyles, dtStyles, ddStyles } = useTableStyles();
    const linkStyles = useLinkCSS();

    const { useUser, useUpdateUser, useDeleteUser } = useGetRequests(system);
    const { data: apiData, isLoading, error } = useUser(id);
    const { mutateAsync: changeUser, isLoading: isLoadingUserChange, error: changeUserError } = useUpdateUser();
    const { mutateAsync: removeUser, isLoading: isLoadingUserRemove, error: removeUserError } = useDeleteUser();

    const userData = useMemo(() => (apiData ? apiData.data : null), [apiData]);

    const initialValuesForChange = useMemo(
        () => getInitialValues(emptyInitialChangeUserValues[system], userData),
        [userData, system]
    );

    const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false);
    const [isRemoveUserOpen, setIsRemoveUserOpen] = useState<boolean>(false);

    const pageTitle = `Пользователь № ${id}`;

    const onSubmitChange = async (values: FormikValues) => {
        const apiValues = formValuesToApiFormat({
            id,
            ...values,
        }) as SellerUserMutateWithId &
            Partial<UserMutate> & {
                id: number;
            } & AdminUserMutateWithId;
        await changeUser(apiValues);
        setIsEditUserOpen(false);
    };

    const onSubmitRemove = async () => {
        await removeUser(id);
    };

    return (
        <PageWrapper
            title={pageTitle}
            h1={pageTitle}
            isLoading={isLoading}
            error={error ? JSON.stringify(error) : undefined}
        >
            <main css={{ flexGrow: 1, flexShrink: 1 }}>
                {userData && (
                    <Layout cols={{ xxxl: 2, sm: 1 }}>
                        <Layout.Item cols={1}>
                            <Block>
                                <Block.Body css={blockBodyStyles}>
                                    <h3 css={h3Styles}>Основная информация</h3>
                                    <div css={{ display: 'flex' }}>
                                        <Button
                                            Icon={EditIcon}
                                            type="button"
                                            theme="ghost"
                                            hidden
                                            onClick={() => {
                                                setIsEditUserOpen(true);
                                            }}
                                        >
                                            редактировать
                                        </Button>
                                        <Button
                                            Icon={TrashIcon}
                                            type="button"
                                            theme="ghost"
                                            hidden
                                            onClick={() => {
                                                setIsRemoveUserOpen(true);
                                            }}
                                        >
                                            удалить
                                        </Button>
                                    </div>
                                    <dl css={{ ...dlStyles, gridTemplateColumns: 'auto auto' }}>
                                        {userPageFields[system].map(field => {
                                            const infoForField = infoForFieldMap.get(field);
                                            const { type = FIELD_TYPES.TEXT, label } = infoForField || {};
                                            const value = userData[field as keyof ApiResponseData] || null;

                                            const renderField = (
                                                fieldType: FIELD_TYPES,
                                                fieldValue: string | null | boolean | number
                                            ) => {
                                                switch (fieldType) {
                                                    case FIELD_TYPES.BOOL:
                                                        return (
                                                            typeof fieldValue === 'boolean' &&
                                                            getTextValueByBoolean(fieldValue)
                                                        );
                                                    case FIELD_TYPES.DATE:
                                                        return (
                                                            typeof fieldValue === 'string' &&
                                                            format(new Date(fieldValue), 'dd.MM.yyyy')
                                                        );
                                                    case FIELD_TYPES.EMAIL:
                                                        return (
                                                            <a css={linkStyles} href={`mailto:${fieldValue}`}>
                                                                {fieldValue}
                                                            </a>
                                                        );
                                                    case FIELD_TYPES.PHONE:
                                                        return (
                                                            <a css={linkStyles} href={`tel:${fieldValue}`}>
                                                                {fieldValue}
                                                            </a>
                                                        );
                                                    default:
                                                        return value;
                                                }
                                            };

                                            return (
                                                <Fragment key={field}>
                                                    <dt css={dtStyles}>{label}</dt>
                                                    <dd css={ddStyles}>{renderField(type, value)}</dd>
                                                </Fragment>
                                            );
                                        })}
                                    </dl>
                                </Block.Body>
                            </Block>
                        </Layout.Item>

                        {[SYSTEMS.ADMIN, SYSTEMS.SELLERS].includes(system) && (
                            <UserRolesContainer
                                userId={+id}
                                userRoles={(userData as AdminUser | SellerUser).roles || []}
                                system={system}
                            />
                        )}
                    </Layout>
                )}
            </main>
            <AddOrChangeUserPopup
                isChangeUser
                isLoading={isLoadingUserChange}
                isOpen={isEditUserOpen}
                error={changeUserError ? JSON.stringify(changeUserError) : undefined}
                onSubmit={onSubmitChange}
                closePopup={() => setIsEditUserOpen(false)}
                initialValues={initialValuesForChange}
                validation={Yup.object().shape(validationForChangeUser[system])}
            />
            <Popup
                isOpen={isRemoveUserOpen}
                onRequestClose={() => setIsRemoveUserOpen(false)}
                title="Вы уверены, что хотите удалить пользователя?"
                popupCss={{ minWidth: scale(60) }}
            >
                <LoadWrapper
                    isLoading={isLoadingUserRemove}
                    error={removeUserError ? JSON.stringify(removeUserError) : undefined}
                >
                    <Form onSubmit={onSubmitRemove} initialValues={{}}>
                        <Button type="submit">Удалить</Button>
                    </Form>
                </LoadWrapper>
            </Popup>
        </PageWrapper>
    );
};

export default User;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
