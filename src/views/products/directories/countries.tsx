import { useState, useMemo } from 'react';
import { Button, scale, Layout, typography } from '@scripts/gds';
import { useRouter } from 'next/router';

import PageWrapper from '@components/PageWrapper';
import OldTable, { TableRowProps } from '@components/OldTable';
import Block from '@components/Block';

import Pagination from '@components/controls/Pagination';
import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import LoadWrapper from '@components/controls/LoadWrapper';

import PlusIcon from '@icons/small/plus.svg';

import { usePostCountry, useGetCountries, usePutCountry, useRemoveCountry, Country, CountryData } from '@api/catalog';
import { LIMIT_PAGE, ModalMessages } from '@scripts/constants';
import { FormikValues } from 'formik';
import { CELL_TYPES } from '@scripts/enums';
import { getTotal } from '@scripts/helpers';

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

const Countries = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    const [activeRow, setActiveRow] = useState<Country | null>(null);
    const { query } = useRouter();
    const activePage = +(query?.page || 0);
    const { data, isLoading, error } = useGetCountries({
        pagination: {
            limit: LIMIT_PAGE,
            type: 'offset',
            offset: (activePage - 1) * LIMIT_PAGE,
        },
    });
    const countries = useMemo(() => data?.data || [], [data?.data]);

    const totalCount = getTotal();

    const createCountry = usePostCountry();
    const updateCountry = usePutCountry();
    const removeCountry = useRemoveCountry();

    const close = () => {
        setIsDeletePopupOpen(false);
        setIsPopupOpen(false);
        setActiveRow(null);
    };

    const handlerSaveCountry = (vals: FormikValues) => {
        const val: CountryData = {
            name: vals.name,
            code: vals.code,
        };

        if (activeRow?.id) {
            updateCountry.mutate({ ...val, id: activeRow.id });
        } else {
            createCountry.mutate(val);
        }
        close();
    };

    const editRowHandler = (row?: TableRowProps) => {
        if (row) {
            setIsPopupOpen(true);
            setActiveRow({
                id: row.id,
                name: row.name,
                code: row.code,
            });
        }
    };

    const deleteRowHandler = (row?: TableRowProps) => {
        if (row) {
            setIsDeletePopupOpen(true);
            setActiveRow({
                id: row.id,
                name: row.name,
                code: row.code,
            });
        }
    };

    useError(error || createCountry.error || updateCountry.error || removeCountry.error);

    useSuccess(createCountry.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(updateCountry.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(removeCountry.isSuccess ? ModalMessages.SUCCESS_UPDATE : '');
    return (
        <PageWrapper h1="Страны">
            <>
                <Button css={{ marginBottom: scale(2) }} onClick={() => setIsPopupOpen(true)} Icon={PlusIcon}>
                    Добавить страну
                </Button>
                <LoadWrapper isLoading={isLoading || removeCountry.isLoading}>
                    <Block>
                        <Block.Body>
                            {countries.length > 0 ? (
                                <OldTable
                                    columns={COLUMNS}
                                    data={countries}
                                    needCheckboxesCol={false}
                                    needSettingsBtn={false}
                                    editRow={editRowHandler}
                                    deleteRow={deleteRowHandler}
                                >
                                    <colgroup>
                                        <col width="10%" />
                                        <col width="30%" />
                                        <col width="40%" />
                                        <col width="10%" />
                                        <col width="5%" />
                                    </colgroup>
                                </OldTable>
                            ) : (
                                <p>Страны не найдены</p>
                            )}

                            <Pagination pages={Math.ceil(totalCount / LIMIT_PAGE)} />
                        </Block.Body>
                    </Block>
                </LoadWrapper>
                <Popup
                    popupCss={{ minWidth: scale(50), padding: 0 }}
                    isOpen={isPopupOpen}
                    onRequestClose={close}
                    isCloseButton
                    isFullscreen={false}
                >
                    <LoadWrapper isLoading={createCountry.isLoading || updateCountry.isLoading}>
                        <Block>
                            <Form
                                initialValues={{
                                    name: activeRow?.name,
                                    code: activeRow?.code,
                                }}
                                onSubmit={handlerSaveCountry}
                                enableReinitialize
                            >
                                <Block.Header>
                                    <h3 css={{ ...typography('h3'), paddingRight: 20 }}>Добавление новой страны</h3>
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
                                            Отменить
                                        </Button>
                                        <Button type="submit" css={{ marginLeft: scale(2) }}>
                                            Сохранить
                                        </Button>
                                    </div>
                                </Block.Footer>
                            </Form>
                        </Block>
                    </LoadWrapper>
                </Popup>
                <Popup
                    popupCss={{ minWidth: scale(50), padding: 0 }}
                    isOpen={isDeletePopupOpen}
                    onRequestClose={() => setIsDeletePopupOpen(false)}
                    isCloseButton
                    isFullscreen={false}
                >
                    <LoadWrapper isLoading={removeCountry.isLoading}>
                        <Block>
                            <Block.Header>
                                <h3 css={{ ...typography('h3'), paddingRight: 20 }}>Удалить страну?</h3>
                            </Block.Header>

                            <Block.Body>
                                <div
                                    css={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Button onClick={close} theme="secondary">
                                        Отменить
                                    </Button>
                                    <Button
                                        css={{ marginLeft: scale(2) }}
                                        onClick={async () => {
                                            if (activeRow?.id) {
                                                await removeCountry.mutateAsync(activeRow?.id);
                                            }
                                            close();
                                        }}
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            </Block.Body>
                        </Block>
                    </LoadWrapper>
                </Popup>
            </>
        </PageWrapper>
    );
};

export default Countries;
