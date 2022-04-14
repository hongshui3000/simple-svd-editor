import Block from '@components/Block';
import Checkbox from '@components/controls/Checkbox';
import Form from '@components/controls/Form';
import Textarea from '@components/controls/Textarea';

import { scale, Layout } from '@scripts/gds';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';

export const Comments = () => {
    const { values, setFieldValue } = useFormikContext<{ is_problem: boolean }>();

    useEffect(() => {
        if (!values.is_problem) setFieldValue('problems_comment', '');
    }, [setFieldValue, values.is_problem]);

    return (
        <Block css={{ padding: scale(3) }}>
            <Layout cols={1}>
                <Layout.Item col={1}>
                    <Form.FastField label="Комментарий клиента" name="client_comment">
                        <Textarea minRows={5} />
                    </Form.FastField>
                </Layout.Item>
                <Layout.Item col={1}>
                    <Form.FastField name="is_problem">
                        <Checkbox>Есть проблема</Checkbox>
                    </Form.FastField>
                </Layout.Item>
                {values.is_problem && (
                    <Layout.Item col={1}>
                        <Form.FastField label="Проблемы" name="problem_comment">
                            <Textarea minRows={5} />
                        </Form.FastField>
                    </Layout.Item>
                )}
            </Layout>
        </Block>
    );
};
