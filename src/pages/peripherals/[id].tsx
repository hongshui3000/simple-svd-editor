import { getXML } from '@api/xml/api';
import Block from '@components/Block';
import { NodeDetails } from '@components/NodeDetails';
import { NodeFieldProps } from '@components/NodeDetails/Field';
import PageWrapper from '@components/PageWrapper';
import {
    Cell,
    Data,
    ExtendedColumn,
    getSelectColumn,
    getSettingsColumn,
} from '@components/Table';
import { useCommon } from '@context/common';
import { ACCESS_TYPE_OPTIONS } from '@scripts/constants';
import getTotalPageData, {
    SVD_PATH,
    TotalPageDataProps,
} from '@scripts/getTotalPageData';
import { Peripheral } from '@scripts/xml';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { dehydrate, QueryClient } from 'react-query';

const childrenCols: ExtendedColumn[] = [
    getSelectColumn(),
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Название',
        accessor: 'name',
        Cell: props => <Cell type="string" {...props} />,
        // disableSortBy: true,
    },
    {
        Header: 'Описание',
        accessor: 'description',
    },
    {
        Header: 'Смещ. адреса',
        accessor: 'addressOffset',
        Cell: props => <Cell type="binary" {...props} />,
    },
    {
        Header: 'Размер',
        accessor: 'size',
        Cell: props => <Cell type="int" {...props} />,
    },
    {
        Header: 'Доступ',
        accessor: 'access',
        Cell: props => <Cell type="enum" {...props} />,
    },
    {
        Header: 'Нач. значение',
        accessor: 'resetValue',
        Cell: props => <Cell type="binary" {...props} />,
    },
    {
        Header: 'Нач. маска',
        accessor: 'resetMask',
        Cell: props => <Cell type="binary" {...props} />,
    },
    getSettingsColumn(),
];

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;
type ExtendedFieldProps = Partial<NodeFieldProps> & {
    valueFunction?: (val: any) => any;
};

const EDITABLE_FIELDS: PartialRecord<keyof Peripheral, ExtendedFieldProps> = {
    description: {
        label: 'Описание',
        type: 'textarea',
    },
    access: {
        label: 'Доступ',
        type: 'array',
        value: ACCESS_TYPE_OPTIONS,
        initialValue: 'read-write',
    },
    baseAddress: {
        label: 'Баз. адрес',
        type: 'binary',
        valueFunction: value => (value ? `0x${value}` : ''),
    },
    groupName: { label: 'Название группы', type: 'string' },
    resetMask: {
        label: 'Reset mask',
        type: 'binary',
        valueFunction: value => (value ? `0x${value}` : ''),
    },
    resetValue: {
        label: 'Reset value',
        type: 'binary',
        valueFunction: value => (value ? `0x${value}` : ''),
    },
    size: {
        label: 'Размер',
        type: 'number',
        initialValue: 8,
        min: 0,
    },
    version: { label: 'Версия', type: 'string' },
    addressBlock: {
        type: 'nested',
        label: 'Блок адреса',
        value: [
            { name: 'offset', type: 'number', label: 'Offset' },
            { name: 'size', type: 'number', label: 'Size' },
            { name: 'usage', type: 'string', label: 'Usage' },
        ],
    },
};

const ControllerNode = () => {
    const {
        query: { id },
    } = useRouter();
    const parsedId = +`${id}`;
    const { xmlData } = useCommon();

    const fields = useMemo(() => {
        const peripherals = xmlData?.device?.peripherals?.peripheral
            ? xmlData.device.peripherals.peripheral
            : [];
        const peripheral = peripherals[parsedId] as Peripheral | undefined;

        const entries = Object.entries(EDITABLE_FIELDS) as [keyof Peripheral, any][];

        const convert = (
            key: string,
            svdData: any,
            initialFieldProps: ExtendedFieldProps
        ) => ({
            name: key,
            value: initialFieldProps.initialValue || '',
            ...(svdData && {
                value: svdData,
            }),
            ...initialFieldProps,
            ...(initialFieldProps.valueFunction && {
                value: initialFieldProps.valueFunction(svdData),
            }),
        });

        return entries
            .map<NodeFieldProps | null>(entry => {
                const key = entry[0];

                const svdData = peripheral?.[key];
                const initialFieldProps = entry[1];
                const res = convert(key, svdData, initialFieldProps);
                if (initialFieldProps.type === 'nested') {
                    console.log(
                        'key',
                        key,
                        'peripheral',
                        peripheral,
                        'svdData',
                        svdData,
                        'initial',
                        initialFieldProps
                    );
                    res.value = res.value.map((e: any) =>
                        convert(e.name, (svdData as any)[e.name], e)
                    );
                }

                delete res.valueFunction;
                return res;
            })
            .filter(Boolean) as NodeFieldProps[];
    }, [parsedId, xmlData]);

    // console.log(fields);

    const childrenData = useMemo(() => {
        if (!xmlData) return [];
        const { device } = xmlData;
        if (!device.peripherals) return [];
        const { peripheral } = device.peripherals;

        return peripheral.map<Data>((p, i) => ({
            id: i,
            name: p.name,
            description: p.description,
            addressOffset: `0x${p.baseAddress}`,
            size: p.size,
            access: p.access,
            resetValue: p.resetValue,
            resetMask: p.resetMask,
        }));
    }, [xmlData]);

    return (
        <NodeDetails
            childrenData={childrenData}
            childrenFields={childrenCols}
            nodeFields={fields}
            nodeName={`Peripheral ${parsedId}`}
        />
    );
};

export async function getServerSideProps(data: TotalPageDataProps) {
    const queryClient = new QueryClient();

    const { xmlData, ...totalData } = await getTotalPageData({
        ...data,
        queryClient,
    });

    const { fetch: fetchXML, key: keyXML } = getXML({ path: SVD_PATH });

    await Promise.all([queryClient.prefetchQuery(keyXML, fetchXML)]);

    return {
        props: {
            ...totalData,
            xmlData,
            dehydratedState: dehydrate(queryClient),
        },
    };
}

export default function PeripheryPage() {
    return (
        <PageWrapper title="PeripheryPage">
            <Block>
                <Block.Body>
                    <ControllerNode />
                </Block.Body>
            </Block>
        </PageWrapper>
    );
}
