import { useState, useEffect, useCallback } from 'react';
import { useFormikContext, FieldArray } from 'formik';

import Block from '@components/Block';

import Form from '@components/controls/Form';
import Select from '@components/controls/Select';
import CheckboxGroup from '@components/controls/CheckboxGroup';
import Checkbox from '@components/controls/Checkbox';

import { Button, scale, Layout, useTheme, typography } from '@scripts/gds';
import { debounce } from '@scripts/helpers';
import { usePrevious } from '@scripts/hooks';

import TrashIcon from '@icons/small/trash.svg';
import { ATTR_PROPS, ATTR_TYPES, DirectoryValueItem, getEmptyValue } from '../../../scripts';

const attrTypes = [
    { label: 'Строка', value: ATTR_TYPES.STRING },
    { label: 'Целое число', value: ATTR_TYPES.INTEGER },
    { label: 'Вещественное число', value: ATTR_TYPES.DOUBLE },
    { label: 'Дата и время', value: ATTR_TYPES.DATETIME },
    { label: 'Ссылка', value: ATTR_TYPES.DATETIME },
    { label: 'Справочник', value: ATTR_TYPES.DIRECTORY },
];

interface AdditionalAttributeItemProps {
    isColorField: boolean;
    index: number;
    remove: (i: number) => void;
}

interface FormValuesTypes {
    attrType: string;
    attrProps: string[];
    productNameForAdmin: string;
    productNameForPublic: string;
    additionalAttributes: DirectoryValueItem[];
}

const AdditionalAttributeItem = ({ isColorField, index, remove }: AdditionalAttributeItemProps) => {
    const {
        setFieldValue,
        values: { additionalAttributes },
    } = useFormikContext<FormValuesTypes>();

    const currentColorValue = additionalAttributes[index].code;
    const prevCurrentValue = usePrevious(currentColorValue);
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        if (prevCurrentValue !== currentColorValue) {
            setColor(currentColorValue);
        }
    }, [prevCurrentValue, currentColorValue]);

    const changeColor = useCallback(
        debounce((e: any) => {
            const colorValue = e?.target?.value;
            setFieldValue(`additionalAttributes[${index}].code`, colorValue);
        }, 300),
        [index]
    );

    return (
        <li css={{ marginBottom: scale(2) }}>
            <Layout cols={5}>
                {isColorField ? (
                    <>
                        <Layout.Item col={2}>
                            <Form.FastField
                                label={`Возможное значение ${index + 1}`}
                                name={`additionalAttributes[${index}].value`}
                            />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.Field label="Код цвета" name={`additionalAttributes[${index}].code`} />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <input
                                name={`additionalAttributes[${index}].code`}
                                type="color"
                                value={color}
                                onChange={e => {
                                    changeColor(e);
                                    setColor(e.target.value);
                                }}
                                css={{ width: '100%', height: scale(7, true), marginTop: scale(3) }}
                            />
                        </Layout.Item>
                    </>
                ) : (
                    <Layout.Item col={3}>
                        <Form.FastField
                            label={`Возможное значение ${index + 1}`}
                            name={`additionalAttributes[${index}].value`}
                        />
                    </Layout.Item>
                )}
                <Layout.Item col={1}>
                    <Button
                        theme="outline"
                        disabled={additionalAttributes.length < 3}
                        title="Удалить атрибут"
                        onClick={() => remove(index)}
                        css={{ marginTop: scale(3) }}
                    >
                        <TrashIcon />
                    </Button>
                </Layout.Item>
            </Layout>
        </li>
    );
};

const FormChildren = ({ forCreate, removeAttribute }: { forCreate?: boolean; removeAttribute?: () => void }) => {
    const {
        dirty,
        values: { attrType, attrProps, additionalAttributes },
        setFieldValue,
    } = useFormikContext<FormValuesTypes>();
    const { colors } = useTheme();
    const isColorField = attrProps ? attrProps.some(i => i === 'color') : false;
    useEffect(() => {
        if (attrType !== ATTR_TYPES.DIRECTORY && isColorField) {
            setFieldValue(
                'attrProps',
                attrProps.filter(i => i !== 'color')
            );
        }
    }, [attrProps, attrType, isColorField, setFieldValue]);

    return (
        <Block>
            <Block.Body>
                <h2 css={{ ...typography('h3'), marginBottom: scale(2) }}>Общие параметры товарного атрибута: </h2>
                <Layout cols={2}>
                    <Layout.Item>
                        <Form.FastField
                            name="productNameForPublic"
                            label="Название атрибута для публичной части сайта"
                        />
                    </Layout.Item>
                    <Layout.Item>
                        <Form.FastField
                            name="productNameForAdmin"
                            label="Название атрибута для административного раздела"
                        />
                    </Layout.Item>
                    <Layout.Item>
                        <Form.FastField name="attrType">
                            <Select label="Тип атрибута" items={attrTypes} />
                        </Form.FastField>
                    </Layout.Item>
                    <Layout.Item>
                        <Form.Field name="attrProps">
                            <CheckboxGroup>
                                <Checkbox
                                    value={ATTR_PROPS.COLOR}
                                    checked={attrProps && attrProps.some(prop => prop === ATTR_PROPS.COLOR)}
                                    disabled={attrType !== ATTR_TYPES.DIRECTORY}
                                >
                                    Атрибут хранит цвет
                                </Checkbox>
                                <Checkbox value={ATTR_PROPS.FILTER}>Выводить атрибут в фильтр товаров</Checkbox>
                                <Checkbox value={ATTR_PROPS.FEW_VALUES}>Атрибут хранит несколько значений</Checkbox>
                            </CheckboxGroup>
                        </Form.Field>
                    </Layout.Item>
                    {/* Актуальные категории убраны, подробнее в #77533 */}
                    <Layout.Item>
                        <h2 css={{ ...typography('h3'), marginBottom: scale(2) }}>Атрибут может принимать значения:</h2>
                        {attrType === ATTR_TYPES.DIRECTORY ? (
                            <>
                                <p css={{ marginBottom: scale(2) }}>
                                    Укажите не менее двух возможных значений для атрибута:
                                </p>
                                <FieldArray
                                    name="additionalAttributes"
                                    render={({ push, remove }) => (
                                        <>
                                            <ul>
                                                {additionalAttributes.map((atr, index) => (
                                                    <AdditionalAttributeItem
                                                        index={index}
                                                        remove={remove}
                                                        isColorField={isColorField}
                                                        key={atr.name}
                                                    />
                                                ))}
                                            </ul>
                                            <Button onClick={() => push(getEmptyValue())}>Добавить значение</Button>
                                        </>
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                <p css={{ marginBottom: scale(2), color: colors?.success }}>
                                    Атрибут может принимать любые значения
                                </p>
                                <p css={{ marginBottom: scale(2) }}>
                                    Чтобы установить жестко заданные варианты, выберите тип &ldquo;Справочник&rdquo;
                                </p>
                            </>
                        )}
                    </Layout.Item>
                </Layout>
            </Block.Body>
            <Block.Footer css={{ justifyContent: 'flex-end' }}>
                {removeAttribute && (
                    <Button type="button" css={{ marginRight: scale(2) }} onClick={removeAttribute}>
                        Удалить товарный атрибут
                    </Button>
                )}
                <Button type="submit" disabled={!dirty}>
                    {forCreate ? 'Создать' : 'Изменить'} товарный атрибут
                </Button>
            </Block.Footer>
        </Block>
    );
};

export default FormChildren;
