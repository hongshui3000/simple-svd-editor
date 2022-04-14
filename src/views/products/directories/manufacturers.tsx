import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Button, scale, Layout, typography } from '@scripts/gds';

import PageWrapper from '@components/PageWrapper';
import OldTable from '@components/OldTable';
import Block from '@components/Block';

import Pagination from '@components/controls/Pagination';
import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import LoadWrapper from '@components/controls/LoadWrapper';

import { CELL_TYPES } from '@scripts/enums';
import { ErrorMessages, LIMIT_PAGE, ModalMessages } from '@scripts/constants';
import { getTotalPages } from '@scripts/helpers';

import PlusIcon from '@icons/small/plus.svg';

import { useManufacturers, useManufacturerCreate, useManufacturerChange, useManufacturerRemove } from '@api/catalog';
import { useError, useSuccess } from '@context/modal';

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

const Manufacturers = () => {
    const { query } = useRouter();
    const activePage = +(query?.page || 1);
    const [selectedRow, setSelectedRow] = useState<{ id?: number; name?: string; code?: string } | null>(null);

    const { data, isLoading, error } = useManufacturers({
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });
    const totalPages = getTotalPages(data);

    const columnsData = useMemo(() => data?.data || [], [data]);

    const createManufacturer = useManufacturerCreate();
    const updateManufacturer = useManufacturerChange();
    const deleteManufacturer = useManufacturerRemove();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupChangeOpen, setIsPopupChangeOpen] = useState(false);
    const [isPopupRemoveOpen, setIsPopupRemoveOpen] = useState(false);

    useError(createManufacturer.error);
    useError(updateManufacturer.error);
    useError(deleteManufacturer.error);

    useSuccess(createManufacturer.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(updateManufacturer.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(deleteManufacturer.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');

    return (
        <PageWrapper h1="Производители" isLoading={isLoading} error={error ? JSON.stringify(error) : undefined}>
            <>
                <div css={{ display: 'flex', marginBottom: scale(2) }}>
                    <Button onClick={() => setIsPopupOpen(true)} Icon={PlusIcon}>
                        Добавить производителя
                    </Button>
                </div>
                <Block>
                    <Block.Body>
                        {columnsData.length > 0 ? (
                            <OldTable
                                columns={COLUMNS}
                                data={columnsData}
                                needSettingsBtn={false}
                                needCheckboxesCol={false}
                                editRow={row => {
                                    if (row) {
                                        setSelectedRow(row);
                                        setIsPopupChangeOpen(true);
                                    }
                                }}
                                deleteRow={row => {
                                    if (row) {
                                        setSelectedRow(row);
                                        setIsPopupRemoveOpen(true);
                                    }
                                }}
                            >
                                <colgroup>
                                    <col width="10%" />
                                    <col width="20%" />
                                    <col width="25%" />
                                    <col width="25%" />
                                    <col width="10%" />
                                </colgroup>
                            </OldTable>
                        ) : (
                            <p>Производители не найдены</p>
                        )}
                        <Pagination pages={totalPages} />
                    </Block.Body>
                </Block>

                <Popup
                    popupCss={{ minWidth: scale(50), padding: 0 }}
                    isOpen={isPopupOpen}
                    onRequestClose={() => setIsPopupOpen(false)}
                    isCloseButton
                    isFullscreen={false}
                >
                    <LoadWrapper isLoading={createManufacturer.isLoading}>
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
                                onSubmit={async values => {
                                    await createManufacturer.mutateAsync({ name: values.name, code: values.code });
                                    setIsPopupOpen(false);
                                }}
                            >
                                <Block.Header>
                                    <h3 css={{ ...typography('h3'), paddingRight: scale(3) }}>
                                        Добавление нового производителя
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
                                        <Button onClick={() => setIsPopupOpen(false)} theme="secondary">
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
                    isOpen={isPopupChangeOpen}
                    onRequestClose={() => setIsPopupChangeOpen(false)}
                    title="Редактировать производителя"
                    popupCss={{ minWidth: scale(60) }}
                >
                    <LoadWrapper isLoading={updateManufacturer.isLoading}>
                        {/* TODO provide right type for values */}
                        <Form<any>
                            onSubmit={async values => {
                                if (selectedRow?.id) {
                                    await updateManufacturer.mutateAsync({
                                        id: selectedRow.id,
                                        name: values.name,
                                        code: values.code,
                                    });
                                }

                                setIsPopupChangeOpen(false);
                            }}
                            initialValues={{
                                name: selectedRow ? selectedRow.name : '',
                                code: selectedRow ? selectedRow.code : '',
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
                            <div
                                css={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        setIsPopupChangeOpen(false);
                                    }}
                                    theme="secondary"
                                >
                                    Отмена
                                </Button>
                                <Button css={{ marginLeft: scale(2) }} type="submit">
                                    Сохранить
                                </Button>
                            </div>
                        </Form>
                    </LoadWrapper>
                </Popup>

                <Popup
                    isOpen={isPopupRemoveOpen}
                    onRequestClose={() => {
                        setIsPopupRemoveOpen(false);
                    }}
                    title="Удалить производителя?"
                    popupCss={{ minWidth: scale(60) }}
                >
                    <LoadWrapper isLoading={deleteManufacturer.isLoading}>
                        <div
                            css={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                onClick={() => {
                                    setIsPopupRemoveOpen(false);
                                }}
                                theme="secondary"
                            >
                                Отменить
                            </Button>
                            <Button
                                css={{ marginLeft: scale(2) }}
                                onClick={async () => {
                                    if (selectedRow?.id) {
                                        await deleteManufacturer.mutateAsync(selectedRow?.id);

                                        setIsPopupRemoveOpen(false);
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

export default Manufacturers;
