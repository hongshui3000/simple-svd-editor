import { useCallback, useMemo, useState } from 'react';
import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';
import { Button, scale, typography } from '@scripts/gds';
import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';
import * as Yup from 'yup';
import { ErrorMessages, ModalMessages } from '@scripts/constants';
import {
    useBasketsSettings,
    useOmsSettings,
    useUpdateOMSSettings,
    useUpdateBasketsSettings,
    OMSSettings,
} from '@api/orders';
import { useError, useSuccess } from '@context/modal';
import Table, {
    Cell,
    Data,
    ExtendedColumn,
    getSettingsColumn,
    TableHeader,
    TooltipContentProps,
} from '@components/Table';

const columns: ExtendedColumn[] = [
    {
        accessor: 'id',
        Header: 'ID',
    },
    {
        accessor: 'code',
        Header: 'Символьный код',
    },
    {
        accessor: 'name',
        Header: 'Название',
    },
    {
        accessor: 'value',
        Header: 'Значение',
    },
    {
        accessor: 'created_at',
        Header: 'Дата создания',
        Cell: ({ value }) => <Cell value={value} type="datetime" />,
    },
    {
        accessor: 'updated_at',
        Header: 'Дата изменения',
        Cell: ({ value }) => <Cell value={value} type="datetime" />,
    },
];

export default function OrdersSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeRow, setActiveRow] = useState<OMSSettings | null>(null);
    const [activeTable, setActiveTable] = useState<'settings' | 'basket' | null>(null);
    const closePopup = useCallback(() => {
        setIsOpen(false);
        setActiveTable(null);
        // чтобы не портить анимацию
        setTimeout(() => setActiveRow(null), 300);
    }, []);

    const { data, error } = useOmsSettings();
    const { data: basketsData, error: basketsError } = useBasketsSettings();
    const updateSettings = useUpdateOMSSettings();
    const updateBasketSettings = useUpdateBasketsSettings();
    useError(error);
    useError(basketsError);
    useError(updateSettings.error);
    useError(updateBasketSettings.error);
    useSuccess(updateSettings.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(updateBasketSettings.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');

    const editRowSettings = useCallback((row: Data | Data[] | undefined) => {
        if (!Array.isArray(row)) {
            setActiveRow(row as OMSSettings);
            setIsOpen(true);
            setActiveTable('settings');
        }
    }, []);
    const tooltipContentSettings: TooltipContentProps[] = useMemo(
        () => [
            {
                type: 'edit',
                text: 'Изменить параметр',
                action: editRowSettings,
            },
        ],
        [editRowSettings]
    );
    const editRowBasket = useCallback((row: Data | Data[] | undefined) => {
        if (!Array.isArray(row)) {
            setActiveRow(row as OMSSettings);
            setIsOpen(true);
            setActiveTable('basket');
        }
    }, []);
    const tooltipContentBasket: TooltipContentProps[] = useMemo(
        () => [
            {
                type: 'edit',
                text: 'Изменить параметр',
                action: editRowBasket,
            },
        ],
        [editRowBasket]
    );

    const initialValues = useMemo(
        () => ({
            id: activeRow?.id || '',
            name: activeRow?.name || '',
            value: activeRow?.value || '',
        }),
        [activeRow]
    );

    return (
        <PageWrapper h1="Настройка oms">
            <h2 css={{ ...typography('h2'), marginBottom: scale(2) }}>Общие параметры</h2>
            <Block
                css={{
                    marginLeft: -scale(3),
                    marginRight: -scale(3),
                    width: `calc(100% + ${scale(6)}px)`,
                    marginBottom: scale(4),
                }}
            >
                <Table
                    renderHeader={() => (
                        <TableHeader css={{ justifyContent: 'space-between' }}>
                            <span>Всего: {data?.data.length}</span>
                        </TableHeader>
                    )}
                    columns={[...columns, getSettingsColumn({ name: 'settings', columnsToDisable: [] })]}
                    data={data?.data || []}
                    disableSortBy
                    allowRowSelect={false}
                    tooltipContent={tooltipContentSettings}
                    onRowClick={editRowSettings}
                />
            </Block>
            <h2 css={{ ...typography('h2'), marginBottom: scale(2) }}>Параметры корзины</h2>
            <Block css={{ marginLeft: -scale(3), marginRight: -scale(3), width: `calc(100% + ${scale(6)}px)` }}>
                <Table
                    renderHeader={() => (
                        <TableHeader css={{ justifyContent: 'space-between' }}>
                            <span>Всего: {basketsData?.data.length}</span>
                        </TableHeader>
                    )}
                    columns={[...columns, getSettingsColumn({ name: 'basket', columnsToDisable: [] })]}
                    data={basketsData?.data || []}
                    disableSortBy
                    allowRowSelect={false}
                    tooltipContent={tooltipContentBasket}
                    onRowClick={editRowBasket}
                />
            </Block>
            <Popup title="Редактирование параметра" onRequestClose={closePopup} isOpen={isOpen}>
                <Form
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required(ErrorMessages.REQUIRED),
                        value: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                    onSubmit={({ id, name, value }) => {
                        const newData = {
                            id,
                            name,
                            value,
                        };

                        if (activeTable === 'settings') {
                            updateSettings.mutate([newData]);
                        }

                        if (activeTable === 'basket') {
                            updateBasketSettings.mutate([newData]);
                        }

                        closePopup();
                    }}
                >
                    <Popup.Body>
                        <Form.FastField name="name" label="Название" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="value" label="Значение" css={{ marginBottom: scale(2) }} />
                    </Popup.Body>
                    <Popup.Footer>
                        <Button theme="secondary" onClick={closePopup}>
                            Отменить
                        </Button>
                        <Button type="submit">Обновить</Button>
                    </Popup.Footer>
                </Form>
            </Popup>
        </PageWrapper>
    );
}
