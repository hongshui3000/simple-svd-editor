import Table, { TableHeader } from '@components/Table';
import { Data } from '@components/Table/types';
import Form from '@components/controls/Form';
import { scale, typography } from '@scripts/gds';
import { FC, HTMLProps, useMemo } from 'react';
import { Column } from 'react-table';
import { NodeField, NodeFieldProps } from './Field';

export interface NodeDetailsProps extends HTMLProps<HTMLDivElement> {
    nodeName: string;
    nodeFields: NodeFieldProps[];
    childrenFields: Column<Data>[];
    childrenData: Data[];
    readOnly?: boolean;
    labelWidth?: number;
}

export const NodeDetails: FC<NodeDetailsProps> = ({
    nodeName,
    nodeFields,
    childrenFields,
    childrenData,
    readOnly = false,
    ...props
}) => {
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
    );

    return (
        <div {...props}>
            <h4 css={{ ...typography('h3') }}>Node name: {nodeName}</h4>
            <Form
                initialValues={initialValues}
                enableReinitialize
                onSubmit={vals => {
                    console.log(vals);
                }}
                css={{
                    maxWidth: '75%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    columnGap: scale(2),
                }}
            >
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
            </Form>
            <Table
                allowRowSelect
                expandable={false}
                disableSortBy
                tooltipContent={[
                    {
                        type: 'edit',
                        text: 'Редактировать биты',
                        action: row => alert(JSON.stringify(row)),
                    },
                ]}
                onRowClick={() => {}}
                onRowContextMenu={() => {}}
                onDoubleClick={() => {}}
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
