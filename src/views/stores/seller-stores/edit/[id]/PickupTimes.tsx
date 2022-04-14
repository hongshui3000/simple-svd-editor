import { useMemo } from 'react';
import { CSSObject } from '@emotion/core';
import { useFormikContext, FieldArray } from 'formik';

import Block from '@components/Block';
import { Layout, VisuallyHidden } from '@scripts/gds';

import Form from '@components/controls/Form';

import { daysValues } from '@scripts/enums';
import TableHead from './TableHead';

const PickupTimes = ({ lineCSS }: { lineCSS: CSSObject }) => {
    const {
        values: { pickupTimes },
    } =
        useFormikContext<{
            pickupTimes: {
                delivery_service_name: string;
                pickupTimes: {
                    pickup_time_code: string;
                    pickup_time_start: string;
                    pickup_time_end: string;
                    cargo_export_time: string;
                    store_id: string;
                    day: number;
                }[];
            }[];
        }>();

    const columns = useMemo(
        () => [
            {
                Header: 'Логистический оператор',
                accessor: 'logisticName',
                type: 'string',
            },
            ...Object.values(daysValues).map((day, index) => ({
                Header: day,
                accessor: `day-${index}`,
                type: 'interval',
            })),
        ],
        []
    );

    return (
        <>
            <Block>
                <Block.Body>
                    <VisuallyHidden>
                        <h2>График отгрузки</h2>
                    </VisuallyHidden>

                    <table width="100%" css={{ borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                {columns.map(({ Header, accessor }) => (
                                    <TableHead key={accessor} Header={Header} lineCSS={lineCSS} />
                                ))}
                            </tr>
                            {pickupTimes?.map((pickupTime, pickupTimeIndex) => (
                                <tr key={pickupTime.delivery_service_name}>
                                    <FieldArray name={`pickupTimes[${pickupTimeIndex}]`}>
                                        {() =>
                                            columns.map((column, columnIndex) => {
                                                switch (column.type) {
                                                    case 'interval': {
                                                        return (
                                                            <td css={lineCSS} key={column.accessor}>
                                                                <Layout cols={2}>
                                                                    <Layout.Item col={2}>
                                                                        <Form.FastField
                                                                            name={`pickupTimes[${pickupTimeIndex}].pickupTimes[${
                                                                                columnIndex - 1
                                                                            }].cargo_export_time`}
                                                                            label="Время выгрузки информации о грузе"
                                                                            type="time"
                                                                        />
                                                                    </Layout.Item>
                                                                    <Layout.Item col={1}>
                                                                        <Form.FastField
                                                                            name={`pickupTimes[${pickupTimeIndex}].pickupTimes[${
                                                                                columnIndex - 1
                                                                            }].pickup_time_start`}
                                                                            label="Отгрузка товара от"
                                                                            type="time"
                                                                        />
                                                                    </Layout.Item>
                                                                    <Layout.Item col={1}>
                                                                        <Form.FastField
                                                                            name={`pickupTimes[${pickupTimeIndex}].pickupTimes[${
                                                                                columnIndex - 1
                                                                            }].pickup_time_end`}
                                                                            label="Отгрузка товара до"
                                                                            type="time"
                                                                        />
                                                                    </Layout.Item>
                                                                    <Layout.Item col={2}>
                                                                        <Form.FastField
                                                                            name={`pickupTimes[${pickupTimeIndex}].pickupTimes[${
                                                                                columnIndex - 1
                                                                            }].pickup_time_code`}
                                                                            label="Код времени отгрузки у службы доставки"
                                                                        />
                                                                    </Layout.Item>
                                                                </Layout>
                                                            </td>
                                                        );
                                                    }
                                                    case 'string':
                                                    default: {
                                                        return (
                                                            <th
                                                                css={{ ...lineCSS, textAlign: 'left' }}
                                                                key={column.accessor}
                                                            >
                                                                {pickupTime.delivery_service_name}
                                                            </th>
                                                        );
                                                    }
                                                }
                                            })
                                        }
                                    </FieldArray>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Block.Body>
            </Block>
        </>
    );
};

export default PickupTimes;
