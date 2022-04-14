import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import Image from 'next/image';

import PageWrapper from '@components/PageWrapper';
import OldTable, { TableRowProps } from '@components/OldTable';
import Block from '@components/Block';
import FileInput from '@components/controls/FileInput';

import Pagination from '@components/controls/Pagination';
import Form from '@components/controls/Form';
import Textarea from '@components/controls/Textarea';
import Popup from '@components/controls/Popup';

import { Button, scale, Layout, typography, useTheme, ButtonProps } from '@scripts/gds';
import { ActionType, CELL_TYPES } from '@scripts/enums';
import { usePopupState } from '@scripts/hooks';
import { ErrorMessages, LIMIT_PAGE, ModalMessages } from '@scripts/constants';

import PlusIcon from '@icons/small/plus.svg';
import TrashIcon from '@icons/small/trash.svg';

import { useMutateBrandImage, useBrands, useCreateBrand, useDeleteBrand, useEditBrand } from '@api/catalog';
import { getTotalPages } from '@scripts/helpers';
import { FormikValues, useFormikContext } from 'formik';
import { useError, useSuccess } from '@context/modal';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Логотип',
        accessor: 'file',
        getProps: () => ({ type: CELL_TYPES.PHOTO }),
    },
    {
        Header: 'Название',
        accessor: 'name',
    },
    {
        Header: 'Код',
        accessor: 'code',
    },
    {
        Header: 'Описание',
        accessor: 'description',
    },
];

const initialState = { id: '', name: '', file: '', code: '', description: '', action: ActionType.Close, open: false };

type State = {
    id?: string;
    file?: string;
    code?: string;
    description?: string;
    name?: string;
    action?: ActionType;
    open?: boolean;
};

interface PopupProps {
    popupState: State;
    popupDispatch: (props: { type: ActionType; payload?: State }) => void;
    onSubmit: (values: FormikValues) => void;
}

const EditPopupRemoveBtn = ({ onClick, ...props }: ButtonProps) => {
    const { setFieldValue } = useFormikContext();
    return (
        <Button
            {...props}
            onClick={(e: any) => {
                if (onClick) onClick(e);
                setFieldValue('file', '');
            }}
        />
    );
};
const EditPopup = ({ popupState, popupDispatch, onSubmit }: PopupProps) => {
    const { colors } = useTheme();

    return (
        <Popup
            isOpen={Boolean(popupState.open && popupState.action !== ActionType.Delete)}
            onRequestClose={() => popupDispatch({ type: ActionType.Close })}
            isCloseButton
            className="brands-popup"
            isFullscreen={false}
            popupCss={{ maxWidth: 'initial', width: scale(55), padding: 0 }}
            scrollInside
        >
            <Block>
                <Form
                    initialValues={{
                        name: popupState.name,
                        code: popupState.code,
                        description: popupState.description,
                        file: popupState.file,
                    }}
                    validationSchema={Yup.object({}).shape({
                        name: Yup.string().required(ErrorMessages.REQUIRED),
                        code: Yup.string().required(ErrorMessages.REQUIRED),
                        description: Yup.string().required(ErrorMessages.REQUIRED),
                        file: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                    onSubmit={onSubmit}
                >
                    <Block.Header>
                        <h3 css={{ ...typography('h3'), paddingRight: 20 }}>
                            {popupState.action === ActionType.Add && 'Добавление нового бренда'}
                            {popupState.action === ActionType.Edit && 'Редактирование бренда'}
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

                            <Layout.Item col={1}>
                                <Form.Field name="description" label="Описание">
                                    <Textarea rows={3} />
                                </Form.Field>
                            </Layout.Item>

                            <Layout.Item col={1}>
                                {popupState.file ? (
                                    <div css={{ display: 'flex', alignItems: 'center' }}>
                                        <Image
                                            width={scale(15)}
                                            height={scale(15)}
                                            src={popupState.file}
                                            css={{ background: colors?.grey200 }}
                                        />
                                        <EditPopupRemoveBtn
                                            Icon={TrashIcon}
                                            type="button"
                                            theme="ghost"
                                            hidden
                                            css={{ marginLeft: scale(2) }}
                                            onClick={() =>
                                                popupDispatch({ type: ActionType.Edit, payload: { file: '' } })
                                            }
                                        >
                                            Удалить файл
                                        </EditPopupRemoveBtn>
                                    </div>
                                ) : (
                                    <Form.Field name="file" type="file" label="Изображение бренда">
                                        <FileInput accept="image/jpg,image/webp,image/png,image/svg+xml" />
                                    </Form.Field>
                                )}
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
                            <Button onClick={() => popupDispatch({ type: ActionType.Close })} theme="secondary">
                                Отмена
                            </Button>
                            <Button type="submit" css={{ marginLeft: scale(2) }}>
                                Сохранить
                            </Button>
                        </div>
                    </Block.Footer>
                </Form>
            </Block>
        </Popup>
    );
};

const DeletePopup = ({ popupState, popupDispatch, onSubmit }: PopupProps) => (
    <Popup
        isOpen={Boolean(popupState.open && popupState.action === ActionType.Delete)}
        onRequestClose={() => popupDispatch({ type: ActionType.Close })}
        isCloseButton
        className="brands-popup"
        isFullscreen={false}
        popupCss={{ maxWidth: 'initial', width: scale(55), padding: 0 }}
    >
        <Block>
            <Form initialValues={{ id: popupState.id }} onSubmit={onSubmit}>
                <Block.Header>
                    <h3 css={typography('h3')}>Вы уверены, что хотите удалить бренд?</h3>
                </Block.Header>
                <Block.Body>
                    <p>ID: {popupState.id}</p>
                    <p>Название: {popupState.name}</p>
                    <p>Описание: {popupState.description}</p>
                </Block.Body>
                <Block.Footer>
                    <div css={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => popupDispatch({ type: ActionType.Close })} theme="secondary">
                            Отмена
                        </Button>
                        <Button type="submit" css={{ marginLeft: scale(2) }}>
                            Удалить
                        </Button>
                    </div>
                </Block.Footer>
            </Form>
        </Block>
    </Popup>
);

const Brands = () => {
    const { query, push } = useRouter();
    const activePage = +(query?.page || 1);
    const [popupState, popupDispatch] = usePopupState<State>(initialState);
    const { data, isLoading, isIdle, error } = useBrands({
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });

    const createBrand = useCreateBrand();
    const editBrand = useEditBrand();
    const deleteBrand = useDeleteBrand();
    const editBrandImage = useMutateBrandImage();

    useError(error || createBrand.error || editBrand.error || deleteBrand.error || editBrandImage.error);

    useSuccess(
        createBrand.status === 'success' || editBrand.status === 'success' || deleteBrand.status === 'success'
            ? ModalMessages.SUCCESS_UPDATE
            : ''
    );

    const totalPages = getTotalPages(data);
    const tableData = useMemo(() => data?.data.map(d => ({ ...d, file: d.file?.url })) || [], [data?.data]);

    const onEdit = useCallback(
        async (values: FormikValues) => {
            const { name, code, description, file: image } = values;
            const formData = new FormData();
            if (image) formData.append('file', image);

            if (name && code && description) {
                try {
                    if (popupState.action === ActionType.Add) {
                        createBrand.mutateAsync({ name, code, description }).then(res => {
                            if (image) editBrandImage.mutate({ id: res.data.id, file: formData });
                        });
                    } else if (popupState.action === ActionType.Edit && popupState.id) {
                        editBrand.mutate({ id: +popupState.id, name, code, description });
                        if (image && image !== popupState?.file)
                            editBrandImage.mutate({ id: +popupState.id, file: formData });
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            popupDispatch({ type: ActionType.Close });
        },
        [createBrand, editBrand, editBrandImage, popupDispatch, popupState.action, popupState?.file, popupState.id]
    );

    const onDelete = async (values: FormikValues) => {
        await deleteBrand.mutateAsync(values.id);
        popupDispatch({ type: ActionType.Close });

        /** перелистнем страницу назад, если нет */
        if (activePage !== 1 && tableData.length === 1)
            push({ pathname: '/products/directories/brands', query: { page: activePage - 1 } });
    };

    const onRowChange = (type: ActionType, row?: TableRowProps) => {
        popupDispatch({
            type,
            payload: {
                id: row?.id,
                name: row?.name,
                file: row?.file,
                code: row?.code,
                description: row?.description,
            },
        });
    };

    return (
        <PageWrapper h1="Бренды" isLoading={isLoading || isIdle}>
            <>
                <Button
                    css={{ marginBottom: scale(2) }}
                    onClick={() => popupDispatch({ type: ActionType.Add })}
                    Icon={PlusIcon}
                >
                    Добавить бренд
                </Button>

                <Block>
                    <Block.Body>
                        {tableData.length > 0 ? (
                            <OldTable
                                columns={COLUMNS}
                                data={tableData}
                                needCheckboxesCol={false}
                                editRow={row => onRowChange(ActionType.Edit, row)}
                                deleteRow={row => onRowChange(ActionType.Delete, row)}
                                needSettingsBtn={false}
                            >
                                <colgroup>
                                    <col width="10%" />
                                    <col width="20%" />
                                    <col width="20%" />
                                    <col width="20%" />
                                    <col width="20%" />
                                    <col width="10%" />
                                </colgroup>
                            </OldTable>
                        ) : (
                            <p css={typography('bodyMd')}>Ни одного бренда не найдено.</p>
                        )}
                        <Pagination pages={totalPages} />
                    </Block.Body>
                </Block>

                <EditPopup popupState={popupState} popupDispatch={popupDispatch} onSubmit={onEdit} />
                <DeletePopup popupState={popupState} popupDispatch={popupDispatch} onSubmit={onDelete} />
            </>
        </PageWrapper>
    );
};

export default Brands;
