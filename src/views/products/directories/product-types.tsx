import { useMemo } from 'react';
import * as Yup from 'yup';
import { Button, scale, Layout, typography } from '@scripts/gds';

import PageWrapper from '@components/PageWrapper';
import OldTable, { TableRowProps } from '@components/OldTable';
import Block from '@components/Block';

import Pagination from '@components/controls/Pagination';
import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import LoadWrapper from '@components/controls/LoadWrapper';

import {
    useProductTypes,
    useProductTypeCreate,
    useProductTypeUpdate,
    useProductTypeDelete,
    ProductType,
} from '@api/catalog';
import { ErrorMessages, LIMIT_PAGE, ModalMessages } from '@scripts/constants';
import { CELL_TYPES, ActionType } from '@scripts/enums';
import { usePopupState } from '@scripts/hooks/usePopupState';

import PlusIcon from '@icons/small/plus.svg';
import { getTotalPages } from '@scripts/helpers';
import { useError, useSuccess } from '@context/modal';
import { useActivePage } from '@scripts/hooks';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Дата создания',
        accessor: 'created_at',
        getProps: () => ({ type: CELL_TYPES.DATE }),
    },
    {
        Header: 'Название',
        accessor: 'name',
    },
    {
        Header: 'Код',
        accessor: 'code',
    },
];

type State = {
    tableData?: ProductType;
    action?: ActionType;
    open?: boolean;
};

const initialState = { action: ActionType.Close, open: false };

const ProductTypes = () => {
    const activePage = useActivePage();
    const [addPopup, addPopupDispatch] = usePopupState<State>(initialState);
    const [changePopup, changePopupDispatch] = usePopupState<State>(initialState);
    const [removePopup, removePopupDispatch] = usePopupState<State>(initialState);

    const {
        data: apiData,
        isLoading,
        error,
    } = useProductTypes({
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });
    const createPT = useProductTypeCreate();
    const updatePT = useProductTypeUpdate();
    const deletePT = useProductTypeDelete();

    const columnsData = useMemo<ProductType[]>(() => (apiData ? apiData.data : []), [apiData]);

    const totalPages = getTotalPages(apiData);

    const changeRowHandler = (type: 'edit' | 'delete', row?: TableRowProps) => {
        if (row) {
            const editableRowFromData = columnsData.find(dataRow => dataRow.id === +row.id);
            const popupParams = { type: ActionType.Edit, payload: { tableData: editableRowFromData } };

            if (type === 'edit') {
                changePopupDispatch(popupParams);
            } else if (type === 'delete') {
                removePopupDispatch(popupParams);
            }
        }
    };

    useError(error);
    useError(createPT.error);
    useError(updatePT.error);
    useError(deletePT.error);

    useSuccess(createPT.isSuccess ? ModalMessages.SUCCESS_SAVE : '');
    useSuccess(updatePT.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(deletePT.isSuccess ? ModalMessages.SUCCESS_DELETE : '');

    return (
        <PageWrapper h1="Типы товаров" isLoading={isLoading} error={error ? JSON.stringify(error) : undefined}>
            <>
                <div css={{ display: 'flex', marginBottom: scale(2) }}>
                    <Button onClick={() => addPopupDispatch({ type: ActionType.Add })} Icon={PlusIcon}>
                        Добавить тип товара
                    </Button>
                </div>
                <Block>
                    <Block.Body>
                        <OldTable
                            columns={COLUMNS}
                            data={columnsData}
                            editRow={row => changeRowHandler('edit', row)}
                            deleteRow={row => changeRowHandler('delete', row)}
                            needCheckboxesCol={false}
                            needSettingsBtn={false}
                        >
                            <colgroup>
                                <col width="10%" />
                                <col width="20%" />
                                <col width="25%" />
                                <col width="25%" />
                                <col width="10%" />
                            </colgroup>
                        </OldTable>
                        <Pagination pages={totalPages} />
                    </Block.Body>
                </Block>

                <Popup
                    popupCss={{ minWidth: scale(50), padding: 0 }}
                    isOpen={Boolean(addPopup.open)}
                    onRequestClose={() => addPopupDispatch({ type: ActionType.Close })}
                    isCloseButton
                    isFullscreen={false}
                >
                    <LoadWrapper isLoading={createPT.isLoading}>
                        <Block>
                            <Form
                                initialValues={{
                                    name: '',
                                    code: '',
                                }}
                                validationSchema={Yup.object().shape({
                                    name: Yup.string().required(ErrorMessages.REQUIRED),
                                    code: Yup.string().required(ErrorMessages.REQUIRED),
                                })}
                                onSubmit={values => {
                                    createPT.mutate({ name: values.name, code: values.code });
                                    addPopupDispatch({ type: ActionType.Close });
                                }}
                            >
                                <Block.Header>
                                    <h3 css={{ ...typography('h3'), paddingRight: scale(3) }}>
                                        Добавление нового типа товара
                                    </h3>
                                </Block.Header>

                                <Block.Body>
                                    <Layout cols={1}>
                                        <Layout.Item col={1}>
                                            <Form.Field name="name" label="Название" />
                                        </Layout.Item>

                                        <Layout.Item col={1}>
                                            <Form.Field name="code" label="Код" />
                                        </Layout.Item>
                                    </Layout>
                                </Block.Body>

                                <Block.Footer>
                                    <div
                                        css={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <Button
                                            onClick={() => addPopupDispatch({ type: ActionType.Close })}
                                            theme="secondary"
                                        >
                                            Отмена
                                        </Button>
                                        <Button css={{ marginLeft: scale(2) }} type="submit">
                                            Сохранить
                                        </Button>
                                    </div>
                                </Block.Footer>
                            </Form>
                        </Block>
                    </LoadWrapper>
                </Popup>

                <Popup
                    isOpen={Boolean(changePopup.open)}
                    onRequestClose={() => changePopupDispatch({ type: ActionType.Close })}
                    title="Редактировать тип товара"
                    popupCss={{ minWidth: scale(60) }}
                >
                    <LoadWrapper isLoading={updatePT.isLoading}>
                        <Form
                            onSubmit={async values => {
                                if (changePopup.tableData && changePopup.tableData.id) {
                                    await updatePT.mutateAsync({
                                        id: changePopup.tableData.id,
                                        name: values.name,
                                        code: values.code,
                                    });
                                }
                                changePopupDispatch({ type: ActionType.Close });
                            }}
                            initialValues={{
                                name: changePopup?.tableData?.name || '',
                                code: changePopup?.tableData?.code || '',
                            }}
                            enableReinitialize
                        >
                            <Layout cols={1} css={{ marginBottom: scale(2) }}>
                                <Layout.Item col={1}>
                                    <Form.Field name="name" label="Название" />
                                </Layout.Item>

                                <Layout.Item col={1}>
                                    <Form.Field name="code" label="Код" />
                                </Layout.Item>
                            </Layout>
                            <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    theme="secondary"
                                    css={{ marginRight: scale(2) }}
                                    onClick={() => changePopupDispatch({ type: ActionType.Close })}
                                >
                                    Отменить
                                </Button>
                                <Button type="submit" theme="primary">
                                    Сохранить
                                </Button>
                            </div>
                        </Form>
                    </LoadWrapper>
                </Popup>

                <Popup
                    isOpen={Boolean(removePopup.open)}
                    onRequestClose={() => removePopupDispatch({ type: ActionType.Close })}
                    title="Удалить тип товара?"
                    popupCss={{ minWidth: scale(60) }}
                >
                    <LoadWrapper isLoading={deletePT.isLoading}>
                        <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button theme="secondary" css={{ marginRight: scale(2) }}>
                                Отменить
                            </Button>

                            <Button
                                onClick={async () => {
                                    if (removePopup?.tableData?.id) {
                                        await deletePT.mutateAsync(removePopup.tableData.id);
                                        removePopupDispatch({ type: ActionType.Close });
                                    }
                                }}
                            >
                                Удалить
                            </Button>
                        </div>
                    </LoadWrapper>
                </Popup>
            </>
        </PageWrapper>
    );
};

export default ProductTypes;
