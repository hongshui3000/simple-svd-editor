import { FormikValues } from 'formik';
import { scale, Layout } from '@scripts/gds';

import Form from '@components/controls/Form';
import Checkbox from '@components/controls/Checkbox';
import Select from '@components/controls/Select';
import Password from '@components/controls/Password';
import Mask from '@components/controls/Mask';
import { maskPhone } from '@scripts/mask';

import { infoForFieldMap, FIELD_TYPES, FORM_FIELDS } from './scripts';

const Fields = ({
    initialValues,
    additionalValues,
}: {
    initialValues: FormikValues;
    additionalValues?: FormikValues;
}) => (
    <>
        {Object.keys(initialValues).map(filterValueItem => {
            const filterValue = filterValueItem as FORM_FIELDS;
            const infoForFilter = infoForFieldMap.get(filterValue);
            if (!infoForFilter) return;

            const { label, type = FIELD_TYPES.TEXT } = infoForFilter || {};
            let { options } = infoForFilter || {};

            if (options?.length === 0 && additionalValues) {
                options = additionalValues[filterValue];
            }
            return (
                <Layout.Item col={1} key={label}>
                    {[FIELD_TYPES.BOOL, FIELD_TYPES.SELECT, FIELD_TYPES.PHONE, FIELD_TYPES.PASSWORD].includes(type) ? (
                        <Form.Field name={filterValue} label={label}>
                            {type === FIELD_TYPES.BOOL && <Checkbox css={{ marginBottom: scale(2) }} />}
                            {type === FIELD_TYPES.SELECT && options && <Select items={options} />}
                            {type === FIELD_TYPES.PHONE && <Mask mask={maskPhone} />}
                            {type === FIELD_TYPES.PASSWORD && <Password />}
                        </Form.Field>
                    ) : (
                        <Form.Field name={filterValue} label={label} type={type} />
                    )}
                </Layout.Item>
            );
        })}
    </>
);

export default Fields;
