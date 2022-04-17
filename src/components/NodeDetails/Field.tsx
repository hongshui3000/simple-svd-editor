import Form from '@components/controls/Form';
import { FormFieldProps } from '@components/controls/Form/Field';
import Legend from '@components/controls/Legend';
import Select, { SelectItemProps } from '@components/controls/Select';
import { CSSObject } from '@emotion/core';

import { scale /* useTheme */ } from '@scripts/gds';

export interface NodeFieldProps extends Omit<FormFieldProps, 'value' | 'css'> {
    type: 'string' | 'number' | 'array';
    value: string | number | SelectItemProps[];
    defaultValue?: any;
    fieldCSS?: CSSObject;
}

export const NodeField = ({
    name,
    type,
    value,
    readOnly,
    fieldCSS,
    ...props
}: NodeFieldProps) => {
    // const { colors } = useTheme();

    switch (type) {
        case 'array':
            return (
                <>
                    {!readOnly && (
                        <Form.Field
                            {...props}
                            className={props.className}
                            name={name}
                            css={{
                                ...fieldCSS,
                            }}
                        >
                            <Select items={value as SelectItemProps[]} simple />
                        </Form.Field>
                    )}
                    {readOnly && (
                        <div className={props.className} css={{ ...fieldCSS }}>
                            <Legend label={props.label} />
                            <ul
                                css={{
                                    paddingLeft: scale(2),
                                    li: {
                                        listStyle: 'disc',
                                        ':not:first-of-type': { marginTop: scale(1) },
                                    },
                                }}
                            >
                                {Array.isArray(value) &&
                                    value.map(
                                        ({ label, value }) =>
                                            value && (
                                                <li key={value.toString()}>
                                                    {label} = {value}
                                                </li>
                                            )
                                    )}
                            </ul>
                        </div>
                    )}
                </>
            );

        case 'string':
        case 'number':
            return (
                <p>
                    {!readOnly && (
                        <Form.Field
                            {...props}
                            name={name}
                            type={type === 'number' ? 'number' : 'string'}
                            css={{
                                ...fieldCSS,
                            }}
                        />
                    )}
                    {readOnly && (
                        <div className={props.className} css={{ ...fieldCSS }}>
                            <Legend label={props.label} />
                            {value}
                        </div>
                    )}
                </p>
            );

        // case 'enum': {
        //     if (!value) return '-';
        //     if (typeof value === 'string') return value;
        //     return JSON.stringify(value);
        // }

        default:
            return <p>-</p>;
    }
};
