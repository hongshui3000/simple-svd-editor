import { Button, scale } from '@scripts/gds';
import Form from '@components/controls/Form';
import LoadWrapper from '@components/controls/LoadWrapper';
import Popup from '@components/controls/Popup';
import OldTable from '@components/OldTable';

import { ActionType } from '@scripts/enums';
import { COLUMNS, getRemoveBtnName, State } from './scripts';

const RemoveUserPopup = ({
    popup,
    popupDispatch,
    isLoading,
    error,
    onSubmit,
}: {
    popup: State;
    error?: string;
    isLoading: boolean;
    popupDispatch: (props: { type: ActionType; payload?: State }) => void;
    onSubmit: () => void;
}) => (
    <Popup
        isOpen={Boolean(popup.open)}
        onRequestClose={() => popupDispatch({ type: ActionType.Close })}
        title={getRemoveBtnName(popup.tableData?.length || 0)}
        popupCss={{ minWidth: scale(60) }}
    >
        <LoadWrapper isLoading={isLoading} error={error}>
            <Form onSubmit={onSubmit} initialValues={{}}>
                <div
                    css={{
                        maxHeight: scale(40),
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    <OldTable
                        columns={COLUMNS}
                        data={popup.tableData || []}
                        needCheckboxesCol={false}
                        needSettingsColumn={false}
                        css={{ marginBottom: scale(2) }}
                    />
                </div>

                <Button type="submit">Удалить</Button>
            </Form>
        </LoadWrapper>
    </Popup>
);

export default RemoveUserPopup;
