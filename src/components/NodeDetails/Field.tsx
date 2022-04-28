import Form from '@components/controls/Form';
import { FormFieldProps } from '@components/controls/Form/Field';
import Legend from '@components/controls/Legend';
import Mask from '@components/controls/Mask';
import Select, { SelectItemProps } from '@components/controls/Select';
import Textarea from '@components/controls/Textarea';
import { CSSObject } from '@emotion/core';
import {
    scale,
    /* useTheme */
    typography,
} from '@scripts/gds';

export interface NodeFieldProps extends Omit<FormFieldProps, 'value' | 'css'> {
    type: 'string' | 'number' | 'array' | 'binary' | 'textarea' | 'nested';
    value: string | number | any[];
    initialValue?: any;
    fieldCSS?: CSSObject;
    
};

export const NodeField = ({
    name,
    type,
    value,
    readOnly,
    fieldCSS,
    ...props
}: NodeFieldProps) => {
    // const { colors } = useTheme();
    delete props.initialValue;

    if (type === 'nested' && Array.isArray(value)) {
        return (
            <div>
                <h4
                    css={{
                        ...typography('h3'),
                    }}
                >
                    {props.label}
                </h4>
                {(value as NodeFieldProps[]).map(subField => (
                    <NodeField
                        key={`${name}_${subField.name}`}
                        {...subField}
                        readOnly={readOnly}
                        name={`${name}.${subField.name}`}
                        className={`${subField.className} ${props.className || ''}`}
                    />
                ))}
            </div>
        );
    }

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
                <>
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
                </>
            );

        case 'textarea':
            return (
                <>
                    {!readOnly && (
                        <Form.Field
                            {...props}
                            name={name}
                            css={{
                                ...fieldCSS,
                            }}
                        >
                            <Textarea />
                        </Form.Field>
                    )}
                    {readOnly && (
                        <div className={props.className} css={{ ...fieldCSS }}>
                            <Legend label={props.label} />
                            {value}
                        </div>
                    )}
                </>
            );

        case 'binary':
            return (
                <>
                    {!readOnly && (
                        <Form.Field
                            {...props}
                            name={name}
                            css={{
                                ...fieldCSS,
                            }}
                        >
                            <Mask mask="\0x00000000" />
                        </Form.Field>
                    )}
                    {readOnly && (
                        <p>0x{parseInt(`${value}`, 16).toString(16).padStart(8, '0')}</p>
                    )}
                </>
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
