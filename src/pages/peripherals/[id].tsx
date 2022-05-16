import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { QueryClient, dehydrate } from 'react-query';

import { getXML } from '@api/xml/api';

import { useCommon } from '@context/common';
import { SaveBeforeExitProvider, useSaveBeforeExit } from '@context/saveBeforeExit';

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
import { getCopyableColumn } from '@components/Table/columns/getCopyableColumn';

import { ACCESS_TYPE_OPTIONS } from '@scripts/constants';
import { Button, scale, typography, useTheme } from '@scripts/gds';
import getTotalPageData, {
    SVD_PATH,
    TotalPageDataProps,
} from '@scripts/getTotalPageData';
import { useLinkCSS, usePrevious } from '@scripts/hooks';
import { Peripheral, Register } from '@scripts/xml';

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

const ControllerNode = ({ setLoading }: { setLoading: (b: boolean) => void }) => {
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

        return entries
            .map<NodeFieldProps | null>(entry => {
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
            })
            .filter(Boolean) as NodeFieldProps[];
    }, [parsedId, xmlData]);

    // console.log(fields);

    const childrenData = useMemo(() => {
        if (!xmlData) return [];
        const { device } = xmlData;
        if (!device.peripherals) return [];
        const { peripheral } = device.peripherals;
        const peripheralArray = Array.isArray(peripheral) ? peripheral : [peripheral];

        const currentPeripheral = peripheralArray[parsedId];
        const { register } = currentPeripheral.registers || {};
        if (!register) return [];

        const registerArray = Array.isArray(register) ? register : [register];

        return registerArray.map<Data>((p, i) => ({
            id: i,
            name: p.name,
            description: p.description,
            addressOffset: p.addressOffset,
            size: p.size,
            access: p.access,
            resetValue: p.resetValue,
            resetMask: p.resetMask,
        }));
    }, [parsedId, xmlData]);

    const pasteToColumn = useCallback(
        (col: string, val: any) => {
            const column = col as keyof Register;

            setXmlData({
                ...xmlData!,
                device: {
                    ...xmlData!.device,
                    peripherals: {
                        peripheral: xmlData!.device.peripherals!.peripheral.map(
                            (e, i) => ({
                                ...e,
                                ...(i === parsedId && {
                                    registers: {
                                        register: e.registers.register.map(r => ({
                                            ...r,
                                            [column]: val,
                                        })),
                                    },
                                }),
                            })
                        ),
                    },
                },
            });
        },
        [parsedId, setXmlData, xmlData]
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
                accessor: 'addressOffset',
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
                Header: 'Доступ',
                accessor: 'access',
                Cell: props => <Cell type="enum" {...props} />,
            },
            getCopyableColumn({
                accessor: 'resetValue',
                Header: 'Нач. значение',
                type: 'binary',
                cellType: 'binary',
                pasteToColumn,
            }),
            {
                Header: 'Нач. маска',
                accessor: 'resetMask',
                Cell: props => <Cell type="binary" {...props} />,
            },
            getSettingsColumn(),
        ],
        [pasteToColumn]
    );

    const { push } = useRouter();
    const { isDirty, setGoingToLink, setDirty, shouldSave } = useSaveBeforeExit();

    const prevShouldSave = usePrevious(shouldSave);

    useEffect(() => {
        if (prevShouldSave === shouldSave) return;
        if (!shouldSave) return;

        console.log(
            'done a large save operation! setDirty = true because form will be reinitialized'
        );

        setLoading(true);
        setTimeout(() => {
            setDirty(false);
            setLoading(false);
        }, 2000);
    }, [shouldSave, prevShouldSave, setDirty, setLoading]);

    const linkCSS = useLinkCSS('blue');
    const { colors } = useTheme();

    return (
        <Block>
            <Block.Header>
                <div css={{ display: 'flex', alignItems: 'center', gap: scale(2) }}>
                    <h1 css={{ ...typography('h1') }}>Элемент периферии #{parsedId}</h1>
                    <Link href="/controller" passHref>
                        <a
                            css={linkCSS}
                            {...(isDirty && {
                                onClick: e => {
                                    e.preventDefault();
                                    setGoingToLink('/controller');
                                },
                            })}
                        >
                            {'<'} К контроллеру
                        </a>
                    </Link>
                </div>
                {isDirty && (
                    <div>
                        <p css={{ color: colors?.danger }}>
                            Есть несохраненные изменения!
                        </p>
                    </div>
                )}
            </Block.Header>
            <Block.Body>
                <NodeDetails
                    childrenData={childrenData}
                    childrenFields={childrenCols}
                    nodeFields={fields}
                    nodeName={`Peripheral ${parsedId}`}
                    onGoToDetails={({ id }) => {
                        const link = `/registers/${id}`;
                        if (isDirty) setGoingToLink(link);
                        else push(link);
                    }}
                    onDirty={setDirty}
                />
            </Block.Body>
            <Block.Footer>
                <Button>Сохранить</Button>
                {isDirty && (
                    <div>
                        <p css={{ color: colors?.danger }}>
                            Есть несохраненные изменения!
                        </p>
                    </div>
                )}
            </Block.Footer>
        </Block>
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
    const [isLoading, setLoading] = useState(false);

    return (
        <PageWrapper title="PeripheryPage" isLoading={isLoading}>
            <SaveBeforeExitProvider>
                <ControllerNode setLoading={setLoading} />
            </SaveBeforeExitProvider>
        </PageWrapper>
    );
}
