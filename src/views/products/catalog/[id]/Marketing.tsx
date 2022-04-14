import Form from '@components/controls/Form';
import { useFormikContext } from 'formik';
import { Button, scale } from '@scripts/gds';

import Switcher from '@components/controls/Switcher';

const FormChildren = () => {
    const {
        dirty,
        values: { globalSettings },
    } = useFormikContext<{ globalSettings: boolean }>();

    return (
        <>
            <Form.Field name="globalSettings" css={{ marginBottom: scale(2) }}>
                <Switcher>Использовать глобальные настройки</Switcher>
            </Form.Field>
            <Form.Field
                name="maxPercent"
                label="Максимальный процент от единицы товара, который можно оплатить бонусами"
                type="number"
                disabled={globalSettings}
                css={{ maxWidth: '50%', marginBottom: scale(2) }}
            />
            <div css={{ display: 'flex' }}>
                <Form.Reset theme="outline" css={{ marginRight: scale(2) }}>
                    Отменить
                </Form.Reset>
                <Button type="submit" theme="primary" disabled={!dirty}>
                    Сохранить
                </Button>
            </div>
        </>
    );
};

const Marketing = () => (
    <Form initialValues={{ globalSettings: true, maxPercent: '' }} onSubmit={values => console.log(values)}>
        <FormChildren />
    </Form>
);

export default Marketing;
