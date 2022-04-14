import { CSSObject } from '@emotion/core';
import { useFormikContext } from 'formik';

import Block from '@components/Block';
import { scale, useTheme, Layout, VisuallyHidden } from '@scripts/gds';

import Form from '@components/controls/Form';
import Checkbox from '@components/controls/Checkbox';

import { Days, daysValues } from '@scripts/enums';
import { WorkingItem } from './types';
import TableHead from './TableHead';

const columnsschedule = [
    {
        Header: 'Выбран',
        accessor: 'check',
    },
    {
        Header: 'День недели',
        accessor: 'day',
    },
    {
        Header: 'Время работы',
        accessor: 'time',
    },
];

const TableRow = ({ index, item, lineCSS }: { lineCSS: CSSObject; index: number; item: { day: Days } }) => {
    const { values } = useFormikContext<{ workings: WorkingItem[] }>();
    const isChecked = values.workings[index].active;
    const { colors } = useTheme();
    return (
        <tr>
            <td css={{ width: '10%', ...lineCSS }}>
                <Form.FastField name={`workings[${index}].active`}>
                    <Checkbox />
                </Form.FastField>
            </td>
            <td css={{ ...lineCSS, color: isChecked ? 'inherin' : colors?.grey600 }}>{daysValues[`${item.day}`]}</td>
            <td css={{ width: '60%', ...lineCSS }}>
                <Layout cols={2}>
                    <Layout.Item col={1}>
                        <Form.Field
                            name={`workings[${index}].working_start_time`}
                            disabled={!isChecked}
                            type="time"
                            label="От"
                        />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field
                            name={`workings[${index}].working_end_time`}
                            disabled={!isChecked}
                            type="time"
                            label="До"
                        />
                    </Layout.Item>
                </Layout>
            </td>
        </tr>
    );
};

const Workings = ({ lineCSS }: { lineCSS: CSSObject }) => {
    const {
        values: { workings },
    } = useFormikContext<{ workings: WorkingItem[] }>();

    return (
        <>
            <Block css={{ maxWidth: scale(128) }}>
                <Block.Body>
                    <VisuallyHidden>
                        <h2>График работы</h2>
                    </VisuallyHidden>
                    <table width="100%" css={{ borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                {columnsschedule.map(({ accessor, Header }) => (
                                    <TableHead key={accessor} Header={Header} lineCSS={lineCSS} />
                                ))}
                            </tr>
                            {workings.map((item, index) => (
                                <TableRow lineCSS={lineCSS} item={item} index={index} key={item.day} />
                            ))}
                        </tbody>
                    </table>
                </Block.Body>
            </Block>
        </>
    );
};

export default Workings;
