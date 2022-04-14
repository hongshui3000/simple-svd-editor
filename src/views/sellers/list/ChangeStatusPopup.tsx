import { Button, scale } from '@scripts/gds';
import { FormikValues } from 'formik';

import Form from '@components/controls/Form';
import Select, { SelectItemProps } from '@components/controls/Select';
import Popup from '@components/controls/Popup';
import { SellerRowData } from '@api/units';

const ChangeStatusPopup = ({
    onSubmit,
    isOpen,
    close,
    selectedRows,
    statuses,
}: {
    onSubmit: (vals: FormikValues) => void;
    isOpen: boolean;
    close: () => void;
    selectedRows: SellerRowData[];
    statuses: SelectItemProps[];
}) => (
    <Popup
        isOpen={isOpen}
        onRequestClose={close}
        title={`Изменить статус продавц${selectedRows.length === 1 ? 'а' : 'ов'}`}
        popupCss={{ minWidth: scale(60) }}
    >
        <Form onSubmit={onSubmit} initialValues={{ status: '' }}>
            <ol css={{ li: { listStyle: 'decimal inside' }, marginBottom: scale(2) }}>
                {selectedRows.map(r => (
                    <li key={r.id}>{r.organizationName.name}</li>
                ))}
            </ol>
            <Form.Field name="status" css={{ marginBottom: scale(2) }}>
                <Select label="Сменить статус" items={statuses} />
            </Form.Field>
            <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" theme="primary">
                    Сохранить
                </Button>
            </div>
        </Form>
    </Popup>
);

export default ChangeStatusPopup;
