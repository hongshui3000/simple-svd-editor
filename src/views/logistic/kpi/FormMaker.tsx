import { Fragment, FC } from 'react';
import * as Yup from 'yup';
import { useFormikContext, FieldArray, FormikValues } from 'formik';

import Form from '@components/controls/Form';
import Tooltip from '@components/controls/Tooltip';
import Select, { SelectProps, getLabel } from '@components/controls/Select';

import { Button, scale, Layout, typography } from '@scripts/gds';
import { ErrorMessages } from '@scripts/constants';

import TipIcon from '@icons/small/status/tip.svg';
import PlusIcon from '@icons/small/plus.svg';
import TrashIcon from '@icons/small/trash.svg';
import Autocomplete, { SearchItem } from '@components/controls/Autocomplete';

interface FormMakerFormValues {
    /** select value */
    select?: { value: string; label: string };
    /** field value */
    field?: number;
    /** list array values */
    list: {
        /** list array item name */
        name: string;
        /** list array item value */
        value: number;
        id: number;
    }[];
}

interface FormChildrenProps {
    selectProps?: SelectProps;
    loadSuggestions?: (val: string) => Promise<SearchItem[]>;
}

const FormChildren: FC<FormChildrenProps> = ({ selectProps, loadSuggestions }) => {
    const {
        values: { list, select, field },
        setFieldValue,
    } = useFormikContext<FormMakerFormValues>();

    return (
        <>
            <FieldArray
                name="list"
                render={({ remove, push }) => (
                    <>
                        {list.map((item, index) => (
                            <Fragment key={item.name}>
                                <Layout.Item col={1}>{item.name}</Layout.Item>
                                <Layout.Item col={1}>
                                    <Form.Field
                                        isLegend
                                        type="number"
                                        name={`list[${index}].value`}
                                        min={0}
                                        css={{ marginRight: scale(1) }}
                                    />
                                </Layout.Item>
                                <Layout.Item col={1}>
                                    <Button theme="fill" Icon={TrashIcon} onClick={() => remove(index)}>
                                        Удалить
                                    </Button>
                                </Layout.Item>
                            </Fragment>
                        ))}
                        <Layout.Item col={1}>
                            <Form.Field name="select">
                                {selectProps && <Select {...selectProps} />}
                                {loadSuggestions && <Autocomplete searchAsyncFunc={loadSuggestions} />}
                            </Form.Field>
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Form.FastField name="field" type="number" min={0} css={{ marginRight: scale(2) }} />
                        </Layout.Item>
                        <Layout.Item col={1}>
                            <Button
                                Icon={PlusIcon}
                                onClick={() => {
                                    if (select) {
                                        let name = '';
                                        if (select && selectProps?.items) {
                                            name = getLabel(selectProps.items.find(i => i.value === select.value));
                                        }

                                        push({
                                            name,
                                            value: field,
                                            id: +select.value,
                                        });
                                        setFieldValue('select', null);
                                        setFieldValue('field', 0);
                                    }
                                }}
                                disabled={!select}
                            >
                                Добавить
                            </Button>
                        </Layout.Item>
                    </>
                )}
            />
            <Layout.Item col={1}>
                <Button type="submit" theme="primary">
                    Сохранить
                </Button>
            </Layout.Item>
        </>
    );
};

interface FormMakerProps {
    /** left column name */
    name: string;
    /** right column name */
    value: string;
    /** tooltip text */
    tooltipText?: string;
    /** options for select to add FormArray item */
    selectProps?: SelectProps;
    /** initial values of form */
    initialValues?: FormMakerFormValues;
    /** on submit handler */
    onSubmit: (vals: FormikValues) => void;
    /** search async function */
    loadSuggestions?: (val: string) => Promise<SearchItem[]>;
}

const FormMaker = ({
    name,
    value,
    tooltipText,
    selectProps,
    initialValues,
    onSubmit,
    loadSuggestions,
}: FormMakerProps) => (
    <Form
        initialValues={{ select: '', field: 0, list: [], ...initialValues }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
            select: Yup.string().nullable(),
            field: Yup.number().min(0, `${ErrorMessages.GREATER_OR_EQUAL} 0`).integer(`${ErrorMessages.INTEGER}`),
        })}
        enableReinitialize
    >
        <Layout cols={3}>
            <Layout.Item col={1}>
                <p css={typography('bodyMdBold')}>{name}</p>
            </Layout.Item>
            <Layout.Item col={2}>
                <p css={typography('bodyMdBold')}>
                    {value}{' '}
                    {tooltipText ? (
                        <Tooltip content={tooltipText} arrow maxWidth={scale(30)}>
                            <button type="button" css={{ verticalAlign: 'middle' }}>
                                <TipIcon />
                            </button>
                        </Tooltip>
                    ) : null}
                </p>
            </Layout.Item>
            <FormChildren selectProps={selectProps} loadSuggestions={loadSuggestions} />
        </Layout>
    </Form>
);

export default FormMaker;
