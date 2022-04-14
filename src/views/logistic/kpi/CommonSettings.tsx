import * as Yup from 'yup';
import { FormikValues } from 'formik';

import { Button, scale, Layout } from '@scripts/gds';
import { ErrorMessages } from '@scripts/constants';

import Form from '@components/controls/Form';

const CommonSettings = ({
    initialValues,
    onSubmit,
}: {
    initialValues: FormikValues;
    onSubmit: (values: FormikValues) => void;
}) => (
    <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
            rtg: Yup.number().min(0, `${ErrorMessages.GREATER_OR_EQUAL} 0`).integer(`${ErrorMessages.INTEGER}`),
            ct: Yup.number().min(0, `${ErrorMessages.GREATER_OR_EQUAL} 0`).integer(`${ErrorMessages.INTEGER}`),
            ppt: Yup.number().min(0, `${ErrorMessages.GREATER_OR_EQUAL} 0`).integer(`${ErrorMessages.INTEGER}`),
        })}
        enableReinitialize
    >
        <Layout cols={3}>
            <Layout.Item col={1}>
                <Form.FastField
                    label="RTG (мин)"
                    hint="Ready-To-Go time - время для проверки заказа АОЗ до его передачи в MAS"
                    name="rtg"
                    type="number"
                    min={0}
                />
            </Layout.Item>
            <Layout.Item col={1} row="2/3">
                <Form.FastField
                    label="CT (мин)"
                    hint="Confirmation Time - время перехода Отправления из статуса “Ожидает подтверждения” в статус “На комплектации”"
                    name="ct"
                    type="number"
                    min={0}
                />
            </Layout.Item>
            <Layout.Item col={1} row="2/3">
                <Form.FastField
                    label="PPT (мин)"
                    hint="Planned Processing Time - плановое время для прохождения Отправлением статусов от “На комплектации” до “Готов к передаче ЛО”"
                    name="ppt"
                    type="number"
                    min={0}
                />
            </Layout.Item>
            <Layout.Item col={1} row="3/4">
                <Form.Reset theme="fill" css={{ marginRight: scale(2) }}>
                    Сбросить
                </Form.Reset>
                <Button type="submit">Сохранить</Button>
            </Layout.Item>
        </Layout>
    </Form>
);

export default CommonSettings;
