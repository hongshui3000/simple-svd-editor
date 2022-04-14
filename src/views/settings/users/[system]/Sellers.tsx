import { useMemo, useState } from 'react';
import { Button, scale } from '@scripts/gds';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';
import * as Yup from 'yup';

import LoadWrapper from '@components/controls/LoadWrapper';
import Pagination from '@components/controls/Pagination';
import Block from '@components/Block';
import OldTable, { TableRowProps } from '@components/OldTable';

import { LIMIT_PAGE } from '@scripts/constants';
import { ActionType } from '@scripts/enums';
import { Flatten, getObjectWithoutEmptyFields, getTotalPages } from '@scripts/helpers';

import { CommonResponse } from '@api/common/types';
import {
    usePostSellerUser as useCreateUser,
    useDeleteSellerUser as useDeleteUser,
    useGetSellerUsers as useUsers,
    SellerUserFilter,
    SellerUser,
} from '@api/units';
import TrashIcon from '@icons/small/trash.svg';
import { useSelectedRowsData } from '@scripts/hooks';
import {
    getRemoveBtnName,
    COLUMNS,
    State,
    emptyInitialAddUserValues,
    SYSTEMS,
    validationForAddUser,
    FORM_FIELDS,
    formValuesToApiFormat,
} from './scripts';
import RemoveUserPopup from './RemoveUserPopup';
import AddOrChangeUserPopup from './AddOrChangeUserPopup';
import UsersFilters from './Filters';

interface SellerUserFilterUrl {
    email?: string;
    phone?: string;
    id?: number;
    login?: string;
    active?: boolean;
    full_name?: string;
    role?: string;
}

interface SellersContainerProps {
    filterValues: SellerUserFilterUrl;
    removePopup: State;
    onSubmitFilters: (filters: SellerUserFilter) => void;
    onResetFilters: () => void;
    deleteRowHandler: (columnsData: SellerUser[], row?: TableRowProps) => void;
    onSubmitRemove: (removeUser: (id: number) => Promise<CommonResponse<null>>) => void;
    removePopupDispatch: (props: { type: ActionType; payload?: State }) => void;
}

const SellersContainer = ({
    filterValues,
    removePopup,
    onSubmitFilters,
    onResetFilters,
    deleteRowHandler,
    onSubmitRemove,
    removePopupDispatch,
}: SellersContainerProps) => {
    const { query } = useRouter();
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const activePage = +(query?.page || 1);

    const {
        data: apiData,
        isLoading,
        error,
    } = useUsers({
        filter: getObjectWithoutEmptyFields({
            id: Number(filterValues.id) || undefined,
            full_name: filterValues.full_name,
            email: filterValues.email,
            phone: filterValues.phone,
            login: filterValues.login,
            active: filterValues.active,
            role: filterValues.role,
        }),
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });
    const columnsData = useMemo(() => (apiData ? apiData.data : []), [apiData]);
    const [ids, setIds, selectedRows] = useSelectedRowsData<Flatten<typeof columnsData>>(columnsData);
    const totalPages = getTotalPages(apiData);

    const { mutateAsync: addUser, isLoading: isLoadingAdd, error: addError } = useCreateUser();
    const { mutateAsync: removeUser, isLoading: isLoadingRemove, error: removeError } = useDeleteUser();

    const onSubmitAdd = async (values: FormikValues) => {
        delete values[FORM_FIELDS.PASSWORD_CONFIRM];
        const apiValues = formValuesToApiFormat(values);
        await addUser(getObjectWithoutEmptyFields(apiValues));
        setIsAddUserOpen(false);
    };

    return (
        <LoadWrapper isLoading={isLoading} error={error ? JSON.stringify({ error }) : undefined}>
            <Block css={{ marginBottom: scale(2) }}>
                <Block.Body>
                    <UsersFilters initialValues={filterValues} onSubmit={onSubmitFilters} onReset={onResetFilters} />
                </Block.Body>
            </Block>
            <Block>
                <Block.Header>
                    <div css={{ display: 'flex' }}>
                        <Button theme="primary" css={{ marginRight: scale(2) }} onClick={() => setIsAddUserOpen(true)}>
                            Добавить пользователя
                        </Button>
                        {ids.length ? (
                            <Button
                                Icon={TrashIcon}
                                onClick={() =>
                                    removePopupDispatch({
                                        type: ActionType.Edit,
                                        payload: {
                                            tableData: selectedRows,
                                        },
                                    })
                                }
                            >
                                {getRemoveBtnName(ids.length)}
                            </Button>
                        ) : null}
                    </div>
                </Block.Header>
                {columnsData.length ? (
                    <Block.Body>
                        <OldTable
                            columns={COLUMNS}
                            data={columnsData}
                            deleteRow={row => deleteRowHandler(columnsData, row)}
                            onRowSelect={setIds}
                        />
                        <Pagination pages={totalPages} css={{ marginTop: scale(2) }} />
                    </Block.Body>
                ) : (
                    <p css={{ padding: scale(2) }}>Пользователи не найдены</p>
                )}
            </Block>
            <AddOrChangeUserPopup
                isLoading={isLoadingAdd}
                isOpen={isAddUserOpen}
                error={addError ? JSON.stringify(addError) : undefined}
                onSubmit={onSubmitAdd}
                closePopup={() => setIsAddUserOpen(false)}
                initialValues={emptyInitialAddUserValues[SYSTEMS.SELLERS]}
                validation={Yup.object().shape(validationForAddUser[SYSTEMS.SELLERS])}
            />
            <RemoveUserPopup
                isLoading={isLoadingRemove}
                popup={removePopup}
                popupDispatch={removePopupDispatch}
                error={removeError ? JSON.stringify(removeError) : undefined}
                onSubmit={() => onSubmitRemove(removeUser)}
            />
        </LoadWrapper>
    );
};

export default SellersContainer;
