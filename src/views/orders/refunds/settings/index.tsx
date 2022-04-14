import { useCallback, useMemo, useState } from 'react';
import PageWrapper from '@components/PageWrapper';
import Block from '@components/Block';
import { Button, scale } from '@scripts/gds';
import PlusIcon from '@icons/plus.svg';
import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';
import * as Yup from 'yup';
import { ErrorMessages, ModalMessages } from '@scripts/constants';
import { RefundReason, useCreateRefundReasons, useRefundReasons, usePatchRefundReasons } from '@api/orders';
import { useError, useSuccess } from '@context/modal';
import Textarea from '@components/controls/Textarea';
import Table, {
    Cell,
    ExtendedColumn,
    getSettingsColumn,
    TableHeader,
    TooltipContentProps,
    Data,
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
        accessor: 'description',
        Header: 'Описание',
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
    { ...getSettingsColumn({ columnsToDisable: [] }) },
];

export default function RefundSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeRow, setActiveRow] = useState<RefundReason | null>(null);
    const closePopup = useCallback(() => {
        setIsOpen(false);
        // чтобы не портить анимацию
        setTimeout(() => setActiveRow(null), 300);
    }, []);

    const { data, error } = useRefundReasons();
    const createReason = useCreateRefundReasons();
    const updateReason = usePatchRefundReasons();
    useError(error);
    useError(createReason.error);
    useError(updateReason.error);
    useError(createReason.error);
    useSuccess(createReason.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');
    useSuccess(updateReason.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');

    const editRow = useCallback((row: Data | Data[] | undefined) => {
        if (row && !Array.isArray(row)) {
            setActiveRow(row as RefundReason);
            setIsOpen(true);
        }
    }, []);

    const tooltipContent: TooltipContentProps[] = useMemo(
        () => [
            {
                type: 'edit',
                text: 'Изменить причину',
                action: editRow,
            },
        ],
        [editRow]
    );

    const initialValues = useMemo(
        () => ({
            code: activeRow?.code || '',
            name: activeRow?.name || '',
            description: activeRow?.description || '',
        }),
        [activeRow]
    );

    return (
        <PageWrapper h1="Настройка причин возврата">
            <Block css={{ marginLeft: -scale(3), marginRight: -scale(3), width: `calc(100% + ${scale(6)}px)` }}>
                <Table
                    renderHeader={() => (
                        <TableHeader css={{ justifyContent: 'space-between' }}>
                            <span>Всего причин: {data?.data.length}</span>
                            <Button Icon={PlusIcon} onClick={() => setIsOpen(true)}>
                                Добавить причину
                            </Button>
                        </TableHeader>
                    )}
                    columns={columns}
                    data={data?.data || []}
                    disableSortBy
                    allowRowSelect={false}
                    tooltipContent={tooltipContent}
                    onRowClick={editRow}
                />
            </Block>
            <Popup
                title={`${activeRow ? 'Редактирование' : 'Создание'} причины возврата`}
                onRequestClose={closePopup}
                isOpen={isOpen}
            >
                <Form
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        code: Yup.string().required(ErrorMessages.REQUIRED),
                        name: Yup.string().required(ErrorMessages.REQUIRED),
                    })}
                    onSubmit={({ code, name, description }) => {
                        const newData = {
                            code: (code as string).toUpperCase(),
                            name,
                            description: description || null,
                        };
                        if (activeRow) {
                            updateReason.mutate({ id: activeRow.id, ...newData });
                        } else {
                            createReason.mutate(newData);
                        }
                        closePopup();
                    }}
                >
                    <Popup.Body>
                        <Form.FastField
                            name="name"
                            label="Название причины возврата"
                            css={{ marginBottom: scale(2) }}
                        />
                        <Form.FastField
                            name="code"
                            label="Символьный код причины возврата"
                            css={{ marginBottom: scale(2) }}
                        />
                        <Form.FastField name="description" label="Детальное описание причины возврата">
                            <Textarea minRows={2} />
                        </Form.FastField>
                    </Popup.Body>
                    <Popup.Footer>
                        <Button theme="secondary" onClick={closePopup}>
                            Отменить
                        </Button>
                        <Button type="submit">{activeRow ? 'Обновить' : 'Создать'}</Button>
                    </Popup.Footer>
                </Form>
            </Popup>
        </PageWrapper>
    );
}
