import Popup from '@components/controls/Popup';

import { Button, Layout, scale } from '@scripts/gds';

export interface DirtyConfirmModalProps {
    isOpen: boolean;
    onSave: () => void;
    onReset: () => void;
    onClose: () => void;
}

const DirtyConfirmModal = ({
    isOpen,
    onReset,
    onSave,
    onClose,
}: DirtyConfirmModalProps) => (
    <Popup isOpen={isOpen} title="Несохраненные изменения" onRequestClose={onClose}>
        <Popup.Body>
            <p>У вас есть несохраненные изменения.</p>
        </Popup.Body>
        <Popup.Footer>
            <Layout cols={2} gap={scale(1)}>
                <Layout.Item>
                    <Button onClick={onSave}>Сохранить и продолжить</Button>
                </Layout.Item>
                <Layout.Item>
                    <Button onClick={onReset} theme="dangerous">
                        Не сохранять и продолжить
                    </Button>
                </Layout.Item>
            </Layout>
        </Popup.Footer>
    </Popup>
);

export default DirtyConfirmModal;
