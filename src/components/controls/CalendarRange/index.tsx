import { FC, useRef } from 'react';
import CalendarInput from '@components/controls/CalendarInput';
import { Layout, scale } from '@scripts/gds';
import { useFormikContext } from 'formik';
import Form from '@components/controls/Form';
import { useMedia } from '@scripts/hooks';

interface CalendarRangeProps {
    label?: string;
    nameFrom: string;
    nameTo: string;
}

const CalendarRange: FC<CalendarRangeProps> = ({ nameFrom, nameTo, label }) => {
    const { values } = useFormikContext<Record<string, string>>();
    const startDate = values[nameFrom] ? +values[nameFrom] : NaN;
    const endDate = values[nameTo] ? +values[nameTo] : NaN;
    const { md, xxl, xl, xs } = useMedia();

    const endRef = useRef<HTMLDivElement>(null);

    return (
        <Layout cols={{ xxxl: 2, xxs: 1 }}>
            <Layout.Item col={1}>
                <Form.Field name={nameFrom}>
                    <CalendarInput
                        label={label}
                        placeholder="От"
                        maxDate={endDate}
                        calendarProps={{
                            selectedFrom: startDate,
                            selectedTo: endDate,
                        }}
                        onChange={() => {
                            setTimeout(() => {
                                if (endRef?.current && !endDate) {
                                    endRef?.current?.click();
                                    endRef?.current?.focus();
                                }
                            }, 0);
                        }}
                    />
                </Form.Field>
            </Layout.Item>
            <Layout.Item
                col={1}
                align="end"
                css={{
                    position: 'relative',
                    '&::before': {
                        content: "'–'",
                        position: 'absolute',
                        left: -15,
                        bottom: scale(1),
                        [xxl]: {
                            left: -scale(3, true),
                        },
                        [xl]: {
                            left: -15,
                        },
                        [md]: {
                            left: -scale(3, true),
                        },
                        [xs]: {
                            content: 'none',
                        },
                    },
                }}
            >
                <Form.Field name={nameTo}>
                    <CalendarInput
                        placeholder="До"
                        minDate={startDate}
                        calendarProps={{
                            selectedFrom: startDate,
                            selectedTo: endDate,
                        }}
                        placement="bottom-end"
                        ref={endRef}
                    />
                </Form.Field>
            </Layout.Item>
        </Layout>
    );
};
export default CalendarRange;
