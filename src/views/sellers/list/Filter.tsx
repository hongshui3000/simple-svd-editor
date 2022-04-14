import { FormikValues } from 'formik';
import { maskPhone } from '@scripts/mask';
import { Button, scale, Layout, typography } from '@scripts/gds';

import Block from '@components/Block';
import Form from '@components/controls/Form';
import MultiSelect, { SelectItemProps } from '@components/controls/MultiSelect';

import CalendarRange from '@components/controls/CalendarRange';
import Mask from '@components/controls/Mask';

const Filter = ({
    onSubmit,
    onReset,
    className,
    statusForSelect,
    managersForSelect,
    initialValues,
    emptyInitialValues,
    total,
}: {
    onSubmit: (vals: FormikValues) => void;
    onReset: (vals: FormikValues) => void;
    className?: string;
    emptyInitialValues: FormikValues;
    initialValues: FormikValues;
    statusForSelect: SelectItemProps[];
    managersForSelect: SelectItemProps[];
    total: number;
}) => (
    <Block className={className}>
        <Form initialValues={initialValues} onSubmit={onSubmit} onReset={onReset}>
            <Block.Body>
                <Layout cols={4}>
                    <Layout.Item col={2}>
                        <CalendarRange label="Дата регистрации" nameFrom="created_at_from" nameTo="created_at_to" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.FastField name="status" label="Статус">
                            <MultiSelect items={statusForSelect} />
                        </Form.FastField>
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.FastField name="id" label="ID" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.FastField name="organizationName" label="Название организации" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.FastField name="contactName" label="ФИО" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.FastField name="email" label="Email" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.FastField name="phone" label="Телефон">
                            <Mask mask={maskPhone} />
                        </Form.FastField>
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.FastField name="manager" label="Менеджер">
                            <MultiSelect items={managersForSelect} />
                        </Form.FastField>
                    </Layout.Item>
                </Layout>
            </Block.Body>
            <Block.Footer>
                <div css={typography('bodySm')}>Всего {total} </div>
                <div>
                    <Form.Reset theme="secondary" type="button" initialValues={emptyInitialValues}>
                        Сбросить
                    </Form.Reset>
                    <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                        Применить
                    </Button>
                </div>
            </Block.Footer>
        </Form>
    </Block>
);

export default Filter;
