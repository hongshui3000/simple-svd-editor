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
    TotalPageDataProps,
    SVD_PATH,
} from '@scripts/getTotalPageData';
import { Device } from '@scripts/xml';
import { useMemo } from 'react';
import { QueryClient, dehydrate } from 'react-query';

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

const ControllerNode = () => {
    const { xmlData } = useCommon();

    const fields = useMemo(() => {
        if (!xmlData) return [];
        const { device } = xmlData;

        const EDITABLE_FIELDS: PartialRecord<
            keyof Device,
            Partial<NodeFieldProps> & {
                valueFunction?: (val: any) => any;
            }
        > = {
            access: {
                label: 'Доступ',
                type: 'array',
                value: ACCESS_TYPE_OPTIONS,
                initialValue: 'read-write',
            },
            addressUnitBits: {
                label: 'Адрес юнит битс',
                type: 'number',
                initialValue: 8,
                min: 0,
            },
            // TODO
            // cpu: { label: 'ЦПУ' },
            description: { label: 'Описание', type: 'textarea' },
            licenseText: { label: 'Текст лицензии', type: 'textarea' },
            name: { label: 'Имя', type: 'string' },
            resetMask: {
                label: 'Reset mask',
                type: 'binary',
                valueFunction: value => `0x${value}`,
            },
            resetValue: {
                label: 'Reset value',
                type: 'binary',
                valueFunction: value => `0x${value}`,
            },
            series: { label: 'Серия', type: 'string' },
            size: { label: 'Размер', type: 'number', initialValue: 8, min: 0 },
            vendor: { label: 'Поставщик', type: 'string' },
            vendorID: { label: 'ID поставщика', type: 'string' },
            version: { label: 'Версия', type: 'string' },
            width: { label: 'Ширина', type: 'number', initialValue: 8, min: 0 },
        };

        const entries = Object.entries(EDITABLE_FIELDS) as [keyof Device, any][];

        return entries
            .map<NodeFieldProps | null>(entry => {
                const key = entry[0];

                const data = device[key];

                const initialFieldProps = entry[1];

                return {
                    name: key,
                    ...(data && {
                        value: data,
                    }),
                    ...initialFieldProps,
                    ...(initialFieldProps.valueFunction && {
                        value: initialFieldProps.valueFunction(data),
                    }),
                };
            })
            .filter(Boolean) as NodeFieldProps[];
    }, [xmlData]);

    const childrenData = useMemo(() => {
        if (!xmlData) return [];
        const { device } = xmlData;
        if (!device.peripherals) return [];
        const { peripheral } = device.peripherals;

        console.log(peripheral);

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
            nodeName="controller"
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

export default function Controller() {
    return (
        <PageWrapper title="Главная страница">
            <Block>
                <Block.Body>
                    <ControllerNode />
                </Block.Body>
            </Block>
        </PageWrapper>
    );
}
