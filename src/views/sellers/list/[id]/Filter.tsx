import { Button, scale, Layout } from '@scripts/gds';
import { FormikValues } from 'formik';

import Block from '@components/Block';

import Select, { SelectItemProps } from '@components/controls/Select';
import Form from '@components/controls/Form';

import CalendarRange from '@components/controls/CalendarRange';

interface FilterProps {
    className?: string;
    onSubmit: (vals: FormikValues) => void;
    onReset?: (vals: FormikValues) => void;
    emptyInitialValues: FormikValues;
    initialValues: FormikValues;
    statuses: SelectItemProps[];
}

const Filters = ({ className, onSubmit, onReset, emptyInitialValues, initialValues, statuses }: FilterProps) => (
    <Block className={className}>
        <Form initialValues={initialValues} onSubmit={onSubmit} onReset={onReset}>
            <Block.Body>
                <Layout cols={4}>
                    <Layout.Item col={1}>
                        <Form.Field name="id" label="ID" type="number" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="code" label="Код" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="sellerId" label="Идентификатор продавца" type="number" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="discountId" label="Идентификатор скидки" type="number" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="status" label="Статус">
                            <Select items={statuses} />
                        </Form.Field>
                    </Layout.Item>
                    <Layout.Item col={2}>
                        <CalendarRange
                            label="Введите период действия"
                            nameFrom="activePeriodDate_from"
                            nameTo="activePeriodDate_to"
                        />
                    </Layout.Item>

                    <Layout.Item col={4} justify="end">
                        <Form.Reset
                            theme="secondary"
                            css={{ marginRight: scale(2) }}
                            type="button"
                            initialValues={emptyInitialValues}
                        >
                            Очистить
                        </Form.Reset>
                        <Button theme="primary" type="submit">
                            Применить
                        </Button>
                    </Layout.Item>
                </Layout>
            </Block.Body>
        </Form>
    </Block>
);

export default Filters;
