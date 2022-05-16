import { FormikProps } from 'formik';
import { HTMLProps, useEffect, useMemo } from 'react';
import { Column } from 'react-table';

import Table, { TableHeader } from '@components/Table';
import { Data } from '@components/Table/types';
import Form from '@components/controls/Form';

import { scale } from '@scripts/gds';

import { NodeField, NodeFieldProps } from './Field';

export interface NodeDetailsProps<T> extends Omit<HTMLProps<HTMLDivElement>, 'onSubmit'> {
    nodeName: string;
    nodeFields: NodeFieldProps[];
    childrenFields: Column<Data>[];
    childrenData: Data[];
    readOnly?: boolean;
    labelWidth?: number;
    onGoToDetails?: (row: Data) => void;
    onFieldsChange?: (val: Record<keyof T, any>) => void;
    onDirty?: (val: boolean) => void;
    onTableChange?: () => void;
}

const NodeDetailsForm = <T,>({
    onFieldsChange,
    onDirty,
    readOnly,
    nodeFields,
    ...formProps
}: FormikProps<T> & {
    onFieldsChange: NodeDetailsProps<T>['onFieldsChange'];
    onDirty: NodeDetailsProps<T>['onDirty'];
    nodeFields: NodeDetailsProps<T>['nodeFields'];
    readOnly: NodeDetailsProps<T>['readOnly'];
}) => {
    useEffect(() => {
        if (onDirty) onDirty(formProps.dirty);
    }, [formProps.dirty, onDirty]);

    useEffect(() => {
        if (onFieldsChange && formProps.dirty) {
            onFieldsChange(formProps.values);
        }
    }, [formProps.values, onFieldsChange, formProps.dirty]);

    return (
        <>
            {nodeFields.map(field => (
                <NodeField
                    key={field.name}
                    {...field}
                    readOnly={readOnly}
                    className={field.className}
                    css={{
                        marginBottom: scale(2),
                    }}
                />
            ))}
        </>
    );
};

export const NodeDetails = <T,>({
    // nodeName,
    nodeFields,
    childrenFields,
    childrenData,
    readOnly = false,
    onGoToDetails,
    onFieldsChange,
    onDirty,
    ...props
}: NodeDetailsProps<T>) => {
    const initialValues = useMemo(
        () =>
            nodeFields.reduce((data, field) => {
                let val = field.value;
                if (field.type === 'array') val = field.initialValue;
                if (field.type === 'nested' && Array.isArray(field.value))
                    val = field.value.reduce((obj, subData) => {
                        obj[subData.name] = subData.value;
                        return obj;
                    }, {});
                return { ...data, [field.name]: val || '' };
            }, {}),
        [nodeFields]
    ) as T;

    return (
        <div {...props}>
            <Form
                initialValues={initialValues}
                enableReinitialize
                onSubmit={() => {}}
                css={{
                    maxWidth: '75%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: scale(2),
                }}
            >
                {formProps => (
                    <NodeDetailsForm<T>
                        onFieldsChange={onFieldsChange}
                        onDirty={onDirty}
                        readOnly={readOnly}
                        nodeFields={nodeFields}
                        {...formProps}
                    />
                )}
            </Form>
            <Table
                allowRowSelect
                expandable={false}
                disableSortBy
                tooltipContent={[
                    {
                        type: 'edit',
                        text: 'Редактировать биты',

                        action: row => {
                            if (onGoToDetails && !Array.isArray(row)) {
                                alert(JSON.stringify(row));
                                onGoToDetails(row);
                            }
                        },
                    },
                ]}
                onRowClick={() => {}}
                onRowContextMenu={() => {}}
                onDoubleClick={() => {
                    // if (data && onRowDoubleClick) onRowDoubleClick(data);
                }}
                data={childrenData}
                columns={childrenFields}
                renderHeader={selectedRows => (
                    <TableHeader>
                        Шапка таблицы{' '}
                        {selectedRows.length > 0 && (
                            <>Выбрано {selectedRows.length} рядов</>
                        )}
                    </TableHeader>
                )}
            />
        </div>
    );
};
