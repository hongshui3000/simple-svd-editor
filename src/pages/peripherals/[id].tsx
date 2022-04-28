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
import { useCallback, useMemo } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { getCopyableColumn } from '@components/Table/columns/getCopyableColumn';

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
    const { xmlData, setXmlData } = useCommon();

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
            ...(svdData !== undefined &&
                svdData !== null && {
                value: svdData,
            }),
            ...initialFieldProps,
            ...(initialFieldProps.valueFunction && {
                value: initialFieldProps.valueFunction(svdData),
            }),
        });

        return entries.map<NodeFieldProps | null>(entry => {
            const key = entry[0];

            const svdData = peripheral?.[key];

            console.log('svdData:', svdData);

            if (!svdData) {
                return null;
            }

            const initialFieldProps = entry[1];
            const res = convert(key, svdData, initialFieldProps);
            if (initialFieldProps.type === 'nested') {
                res.value = res.value.map((e: any) => {
                    console.log('e=', e, 'svdData=', svdData);
                    return convert(e.name, (svdData as any)[e.name], e);
                });
            }

            delete res.valueFunction;
            return res as NodeFieldProps;
        }).filter(Boolean) as NodeFieldProps[];
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
            baseAddress: p.baseAddress,
            size: p.size,
            access: p.access,
            resetValue: p.resetValue,
            resetMask: p.resetMask,
        }));
    }, [xmlData]);

    const pasteToColumn = useCallback(
        (col: string, val: any) => {
            const column = col as keyof Peripheral;

            setXmlData({
                ...xmlData!,
                device: {
                    ...xmlData!.device,
                    peripherals: {
                        peripheral: xmlData!.device.peripherals!.peripheral.map(e => ({
                            ...e,
                            [column]: val,
                        })),
                    },
                },
            });
        },
        [setXmlData, xmlData]
    );

    const childrenCols: ExtendedColumn[] = useMemo(
        () => [
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
            getCopyableColumn({
                accessor: 'baseAddress',
                Header: 'Смещ. адреса',
                type: 'binary',
                cellType: 'binary',
                pasteToColumn,
            }),
            getCopyableColumn({
                accessor: 'size',
                Header: 'Размер',
                type: 'number',
                cellType: 'int',
                pasteToColumn,
            }),
            {
                Header: ({ data }) => (
                    <button
                        type="button"
                        onDoubleClick={() => alert(`copied!${JSON.stringify(data)}`)}
                    >
                        Размер
                    </button>
                ),
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
        ],
        [pasteToColumn]
    );

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
