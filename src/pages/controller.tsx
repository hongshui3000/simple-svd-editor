import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
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

import { ACCESS_TYPE_OPTIONS } from '@scripts/constants';
import { Button, typography, useTheme } from '@scripts/gds';
import getTotalPageData, {
    SVD_PATH,
    TotalPageDataProps,
} from '@scripts/getTotalPageData';
import { usePrevious } from '@scripts/hooks';
import { Device, buildXML } from '@scripts/xml';

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

const ControllerNode = ({ setLoading }: { setLoading: (b: boolean) => void }) => {
    const { xmlData, setXmlData } = useCommon();
    const { push } = useRouter();
    const { colors } = useTheme();

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

                const res = {
                    name: key,
                    ...(data && {
                        value: data,
                    }),
                    ...initialFieldProps,
                    ...(initialFieldProps.valueFunction && {
                        value: initialFieldProps.valueFunction(data),
                    }),
                };

                delete res.valueFunction;

                return res;
            })
            .filter(Boolean) as NodeFieldProps[];
    }, [xmlData]);

    const childrenData = useMemo(() => {
        if (!xmlData) return [];
        const { device } = xmlData;
        if (!device.peripherals) return [];
        const { peripheral } = device.peripherals;

        const peripheralArray = Array.isArray(peripheral) ? peripheral : [peripheral];

        return peripheralArray.map<Data>((p, i) => ({
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

    const actualXML = useMemo(() => {
        console.log(xmlData?.device.resetMask);
        return buildXML(xmlData);
    }, [xmlData]);

    return (
        <>
            <Block>
                <Block.Header>
                    <h1 css={{ ...typography('h1') }}>Элемент &quot;Контроллер&quot;</h1>
                    {isDirty && (
                        <div>
                            <p css={{ color: colors?.danger }}>
                                Есть несохраненные изменения!
                            </p>
                        </div>
                    )}
                </Block.Header>
                <Block.Body>
                    <NodeDetails<Device>
                        childrenData={childrenData}
                        childrenFields={childrenCols}
                        nodeFields={fields}
                        onGoToDetails={({ id }) => {
                            const link = `/peripherals/${id}`;
                            if (isDirty) setGoingToLink(link);
                            else push(link);
                        }}
                        onDirty={setDirty}
                        onFieldsChange={vals => {
                            const newXmlData = {
                                device: {
                                    ...xmlData!.device,
                                    ...vals,
                                },
                            };
                            setXmlData(newXmlData);
                        }}
                        nodeName="controller"
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

            <div
                css={{
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    width: 400,
                    height: '100vh',
                    overflow: 'scroll',
                    background: '#000',
                    color: 'lime',
                }}
            >
                <pre>{actualXML}</pre>
            </div>
        </>
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
    const [isLoading, setLoading] = useState(false);

    return (
        <PageWrapper title="Главная страница" isLoading={isLoading}>
            <SaveBeforeExitProvider>
                <ControllerNode setLoading={setLoading} />
            </SaveBeforeExitProvider>
        </PageWrapper>
    );
}
