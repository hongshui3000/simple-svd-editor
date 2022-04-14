import { useMemo, useState, Fragment } from 'react';
import { FormikValues } from 'formik';
import { Button, scale, Layout } from '@scripts/gds';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Select from '@components/controls/Select';
import LoadWrapper from '@components/controls/LoadWrapper';
import Block from '@components/Block';
import CalendarInput from '@components/controls/CalendarInput';

import { ActionType } from '@scripts/enums';
import { formatDate } from '@scripts/helpers';
import { usePopupState } from '@scripts/hooks';
import { Role } from '@api/units';

import TrashIcon from '@icons/small/trash.svg';
import PlusIcon from '@icons/small/plus.svg';
import { State, SYSTEMS, useGetRolesRequests, useTableStyles } from '../scripts';

interface UserRolesContainerProps {
    userId: number;
    userRoles: Role[];
    system: SYSTEMS;
}

const initialState = { action: ActionType.Close, open: false };

const UserRolesContainer = ({ userId, userRoles, system }: UserRolesContainerProps) => {
    const [isAddUserRoleOpen, setIsAddUserRoleOpen] = useState<boolean>(false);
    const [removePopup, removePopupDispatch] = usePopupState<State>(initialState);

    const { h3Styles, blockBodyStyles, dlStyles, dtStyles, ddStyles } = useTableStyles();
    const { useRoles, useAddRole, useDeleteRole } = useGetRolesRequests(system);
    const { data: rolesApiData, isLoading, error } = useRoles(isAddUserRoleOpen);

    const rolesData = useMemo(
        () => (rolesApiData ? rolesApiData.data.map(role => ({ label: role.title, value: role.id })) : undefined),
        [rolesApiData]
    );
    const { mutateAsync: addRole, isLoading: isLoadingAddRole, error: addRoleError } = useAddRole();
    const { mutateAsync: removeRole, isLoading: isLoadingRoleRemove, error: removeRoleError } = useDeleteRole();

    const addRoleForUserSubmit = async (values: FormikValues) => {
        await addRole({ id: userId, roles: [Number(values.role.value)], expires: values.expires });
    };

    const removeRoleForUserSubmit = async (roleId?: number) => {
        if (roleId) await removeRole({ id: userId, role_id: roleId });
    };

    return (
        <>
            <Layout.Item cols={1}>
                <Block>
                    <Block.Body css={blockBodyStyles}>
                        <h3 css={h3Styles}>Роли пользователя</h3>
                        <Button
                            Icon={PlusIcon}
                            type="button"
                            theme="ghost"
                            hidden
                            onClick={() => {
                                setIsAddUserRoleOpen(true);
                            }}
                        >
                            редактировать
                        </Button>

                        <dl css={{ ...dlStyles, gridTemplateColumns: 'auto auto' }}>
                            {userRoles?.map(role => (
                                <Fragment key={role.id}>
                                    <dt css={{ ...dtStyles, display: 'flex', alignItems: 'center' }}>
                                        {role.title} до {formatDate(new Date(role.expires))}
                                    </dt>
                                    <dd css={ddStyles}>
                                        <Button
                                            Icon={TrashIcon}
                                            type="button"
                                            theme="ghost"
                                            hidden
                                            onClick={() => {
                                                removePopupDispatch({
                                                    type: ActionType.Edit,
                                                    payload: { roleId: role.id },
                                                });
                                            }}
                                        >
                                            удалить
                                        </Button>
                                    </dd>
                                </Fragment>
                            ))}
                        </dl>
                    </Block.Body>
                </Block>
            </Layout.Item>
            <Popup
                isOpen={isAddUserRoleOpen}
                onRequestClose={() => {
                    setIsAddUserRoleOpen(false);
                }}
                title="Добавление роли"
                popupCss={{ minWidth: scale(75) }}
            >
                <LoadWrapper
                    isLoading={isLoadingAddRole || isLoading}
                    error={addRoleError || error ? JSON.stringify(addRoleError || error) : undefined}
                >
                    <Form
                        onSubmit={addRoleForUserSubmit}
                        initialValues={{
                            role: '',
                        }}
                    >
                        <Layout cols={2}>
                            {rolesData && (
                                <Layout.Item col={2}>
                                    <Form.Field name="role" label="Роль">
                                        <Select items={rolesData} />
                                    </Form.Field>
                                </Layout.Item>
                            )}
                            <Layout.Item col={2}>
                                <Form.Field name="expires">
                                    <CalendarInput label="Время жизни роли" />
                                </Form.Field>
                            </Layout.Item>
                            <Layout.Item col={{ xxxl: 1, sm: 2 }}>
                                <Button type="submit" theme="primary">
                                    Сохранить
                                </Button>
                            </Layout.Item>
                        </Layout>
                    </Form>
                </LoadWrapper>
            </Popup>

            <Popup
                isOpen={Boolean(removePopup.open)}
                onRequestClose={() => removePopupDispatch({ type: ActionType.Close })}
                title="Вы уверены, что хотите удалить роль пользователя?"
                popupCss={{ minWidth: scale(60) }}
            >
                <LoadWrapper
                    isLoading={isLoadingRoleRemove}
                    error={removeRoleError ? JSON.stringify(removeRoleError) : undefined}
                >
                    <Form onSubmit={() => removeRoleForUserSubmit(removePopup.roleId)} initialValues={{}}>
                        <Button type="submit">Удалить</Button>
                    </Form>
                </LoadWrapper>
            </Popup>
        </>
    );
};

export default UserRolesContainer;
