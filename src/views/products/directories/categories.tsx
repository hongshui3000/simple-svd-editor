import { useMemo } from 'react';
import * as Yup from 'yup';

import { Button, scale } from '@scripts/gds';

import PageWrapper from '@components/PageWrapper';
import OldTable from '@components/OldTable';
import Block from '@components/Block';

import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import Popup from '@components/controls/Popup';
import LoadWrapper from '@components/controls/LoadWrapper';

import { usePopupState } from '@scripts/hooks/usePopupState';
import { ActionType } from '@scripts/enums';
import { ErrorMessages, LIMIT_PAGE, ModalMessages } from '@scripts/constants';
import { getNestedData, INestedRow } from '@scripts/helpers';

import PlusIcon from '@icons/small/plus.svg';

import { useCategories, useCategoryCreate, useCategoryUpdate, useCategoryDelete } from '@api/catalog';
import { useError, useSuccess } from '@context/modal';
import { useActivePage } from '@scripts/hooks';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Название категории',
        accessor: 'name',
    },
    {
        Header: 'Код',
        accessor: 'code',
    },
];

const initialState = {
    id: '',
    name: '',
    code: '',
    parent_id: null,
    action: ActionType.Close,
    open: false,
};

type State = {
    id?: string;
    name?: string;
    parent_id?: number | null;
    code?: string;
    action?: ActionType;
    open?: boolean;
};

const ProductDirectoriesCategories = () => {
    const activePage = useActivePage();
    const [popupState, popupDispatch] = usePopupState<State>(initialState);
    const [popupDeleteState, popupDeleteDispatch] = usePopupState<INestedRow>({ id: 0 });
    const {
        data: apiData,
        isLoading,
        error,
    } = useCategories({
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });
    const createCategory = useCategoryCreate();
    const updateCategory = useCategoryUpdate();
    const deleteCategory = useCategoryDelete();

    const tableData = useMemo(() => (apiData ? getNestedData(apiData.data) : []), [apiData]);

    const selectCategories = useMemo(
        () => [
            { value: null, label: 'Нет' },
            ...(apiData?.data?.map(category => ({ value: category.id, label: category.name })) || []),
        ],
        [apiData?.data]
    );

    useError(error);
    useError(createCategory.error);
    useError(updateCategory.error);
    useError(deleteCategory.error);

    useSuccess(createCategory.isSuccess ? ModalMessages.SUCCESS_SAVE : '');
    useSuccess(updateCategory.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(deleteCategory.isSuccess ? ModalMessages.SUCCESS_DELETE : '');

    return (
        <PageWrapper h1="Категории" isLoading={isLoading}>
            <Button
                css={{ marginBottom: scale(2) }}
                Icon={PlusIcon}
                onClick={() => popupDispatch({ type: ActionType.Add })}
            >
                Создать категорию
            </Button>
            <Block>
                <Block.Body>
                    <OldTable
                        columns={COLUMNS}
                        data={tableData}
                        needCheckboxesCol={false}
                        needSettingsBtn={false}
                        expandable
                        deleteRow={row => {
                            if (!row) return;
                            popupDeleteDispatch({
                                type: ActionType.Edit,
                                payload: {
                                    id: row.id,
                                    code: row.code,
                                    name: row.name,
                                    parent_id: +row.parent_id,
                                    subRows: row.subRows,
                                },
                            });
                        }}
                        editRow={row => {
                            if (!row) return;
                            popupDispatch({
                                type: ActionType.Edit,
                                payload: {
                                    id: row.id,
                                    code: row.code,
                                    name: row.name,
                                    parent_id: +row.parent_id,
                                },
                            });
                        }}
                    >
                        <colgroup>
                            <col width="5%" />
                            <col width="40%" />
                            <col width="30%" />
                            <col width="15%" />
                            <col width="10%" />
                        </colgroup>
                    </OldTable>
                </Block.Body>
            </Block>
            <Popup
                isOpen={Boolean(popupState.open)}
                onRequestClose={() => popupDispatch({ type: ActionType.Close })}
                title={`${popupState.action === ActionType.Edit ? 'Редактировать' : 'Создать новую'} категорию`}
                popupCss={{ minWidth: scale(50) }}
            >
                <LoadWrapper isLoading={createCategory.isLoading || updateCategory.isLoading}>
                    {/* TODO provide right type for values */}
                    <Form<any>
                        initialValues={{
                            id: popupState.id,
                            code: popupState.code,
                            name: popupState.name,
                            parent_id: popupState.parent_id,
                        }}
                        onSubmit={async values => {
                            const commonProps = {
                                name: values.name,
                                code: values.code,
                                parent_id: values.parent_id,
                            };
                            if (popupState.action === ActionType.Edit) {
                                await updateCategory.mutateAsync({
                                    id: +values.id,
                                    ...commonProps,
                                });
                            } else if (popupState.action === ActionType.Add) {
                                await createCategory.mutateAsync(commonProps);
                            }
                            popupDispatch({ type: ActionType.Close });
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required(ErrorMessages.REQUIRED),
                            code: Yup.string().required(ErrorMessages.REQUIRED),
                            parent_id: Yup.string().nullable(),
                        })}
                        enableReinitialize
                    >
                        <Form.FastField name="name" label="Название категории" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="code" label="Символьный код" css={{ marginBottom: scale(2) }} />
                        <Form.Field name="parent_id" label="Родительская категория" css={{ marginBottom: scale(2) }}>
                            <Select
                                items={
                                    popupState.action === ActionType.Edit
                                        ? selectCategories.filter(
                                              cat => cat.value?.toString() !== popupState.id?.toString()
                                          )
                                        : selectCategories
                                }
                            />
                        </Form.Field>
                        <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Form.Reset
                                theme="fill"
                                css={{ marginRight: scale(2) }}
                                onClick={() => popupDispatch({ type: ActionType.Close })}
                            >
                                Отменить
                            </Form.Reset>
                            <Button type="submit">Сохранить</Button>
                        </div>
                    </Form>
                </LoadWrapper>
            </Popup>
            <Popup
                isOpen={Boolean(popupDeleteState.open)}
                onRequestClose={() => popupDeleteDispatch({ type: ActionType.Close })}
                title="Удалить категорию?"
                popupCss={{ minWidth: scale(50) }}
            >
                <LoadWrapper isLoading={deleteCategory.isLoading}>
                    <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            theme="secondary"
                            onClick={() => popupDeleteDispatch({ type: ActionType.Close })}
                            css={{ marginRight: scale(2) }}
                        >
                            Отменить
                        </Button>
                        <Button
                            onClick={async () => {
                                if (popupDeleteState.id) {
                                    await deleteCategory.mutateAsync(popupDeleteState.id);
                                }
                                popupDeleteDispatch({ type: ActionType.Close });
                            }}
                        >
                            Удалить
                        </Button>
                    </div>
                </LoadWrapper>
            </Popup>
        </PageWrapper>
    );
};

export default ProductDirectoriesCategories;
