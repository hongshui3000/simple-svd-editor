import { Column } from 'react-table';
import { Data } from '@components/Table/types';
import { FC, HTMLProps, useMemo } from 'react';
import Table, { TableHeader } from '@components/Table';
import { scale, typography } from '@scripts/gds';
import Form from '@components/controls/Form';
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
    labelWidth = scale(12),
    ...props
}) => {
    const initialValues = useMemo(
        () =>
            nodeFields.reduce((data, field) => {
                const val = field.type === 'array' ? field.defaultValue : field.value;
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
                    maxWidth: '70%',
                }}
            >
                {nodeFields.map(field => (
                    <div
                        css={{
                            marginTop: scale(2),
                        }}
                        key={field.name}
                    >
                        <NodeField
                            {...field}
                            readOnly={readOnly}
                            className={field.className}
                            css={{
                                display: 'grid',
                                gridTemplateColumns: `${labelWidth}px 1fr`,
                                alignItems: 'start',
                            }}
                        />
                    </div>
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
