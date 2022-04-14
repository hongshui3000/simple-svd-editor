import { FC } from 'react';
import { Button, scale, Layout } from '@scripts/gds';
import { FormikValues } from 'formik';
import * as Yup from 'yup';

import LoadWrapper from '@components/controls/LoadWrapper';
import Popup from '@components/controls/Popup';
import Form from '@components/controls/Form';

import { FORM_FIELDS } from './scripts';
import Fields from './Fields';

interface AddOrChangeUserPopupProps {
    isLoading: boolean;
    isOpen: boolean;
    error?: string;
    initialValues: { [key in FORM_FIELDS]?: string | boolean };
    validation: Yup.AnyObjectSchema;
    isChangeUser?: boolean;
    onSubmit: (values: FormikValues) => void;
    closePopup: () => void;
}

const AddOrChangeUserPopup: FC<AddOrChangeUserPopupProps> = ({
    isLoading,
    isOpen,
    error,
    initialValues,
    validation,
    isChangeUser,
    onSubmit,
    closePopup,
}) => (
    <Popup
        isOpen={isOpen}
        onRequestClose={closePopup}
        title={isChangeUser ? 'Редактирование пользователя' : `Добавление пользователя`}
        popupCss={{ minWidth: scale(75), overflow: 'auto' }}
    >
        <LoadWrapper isLoading={isLoading} error={error}>
            <Form onSubmit={onSubmit} initialValues={initialValues} validationSchema={validation} enableReinitialize>
                <Layout cols={2}>
                    <Fields initialValues={initialValues} />
                    <Layout.Item col="1">
                        <Button type="submit" theme="primary">
                            Сохранить
                        </Button>
                    </Layout.Item>
                </Layout>
            </Form>
        </LoadWrapper>
    </Popup>
);

export default AddOrChangeUserPopup;
