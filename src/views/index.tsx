import Block from '@components/Block';
import { NodeDetails } from '@components/NodeDetails';
import PageWrapper from '@components/PageWrapper';
import {
    Cell,
    ExtendedColumn,
    getSelectColumn,
    getSettingsColumn,
} from '@components/Table';
import { scale } from '@scripts/gds';
import { parseXML, SVDRootObject } from '@scripts/xml';

const SVD_PATH =
    'https://raw.githubusercontent.com/ARM-software/CMSIS/master/CMSIS/SVD/ARM_Example.svd';

fetch(SVD_PATH)
    .then(resp => resp.text())
    .then(txt => {
        const parsed = parseXML<SVDRootObject>(txt);
        const { peripherals } = parsed.device;
        console.log('Peripherals:', peripherals);
        console.log('p0 registers:', peripherals.peripheral.map(e => e.registers)[0]);
        console.log('p0 reg0 fields', peripherals.peripheral[0].registers.register[0].fields.field)
    });

const cols: ExtendedColumn[] = [
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

enum Access {
    READ = 'read',
    READ_WRITE = 'read-write',
    WRITE = 'write',
}

export default function Home() {
    return (
        <PageWrapper title="Главная страница">
            <Block>
                <Block.Body>
                    <NodeDetails
                        childrenData={[
                            {
                                id: 1,
                                name: 'CR',
                                description: 'Control Register',
                                addressOffset: '0x00',
                                size: 32,
                                access: Access.READ_WRITE,
                                resetValue: '0x00000000',
                                resetMask: '0x1337F7F',
                            },
                        ]}
                        childrenFields={cols}
                        nodeFields={[
                            {
                                name: 'test',
                                type: 'array',
                                value: [
                                    {
                                        label: 'Привет',
                                        value: 'privet',
                                    },
                                    {
                                        label: 'Пока',
                                        value: 'poka',
                                    },
                                ],
                                defaultValue: 'poka',
                                label: 'Ыыы',
                            },
                            {
                                name: 'freq',
                                type: 'number',
                                value: 100000,
                                label: 'Cpu freq',
                            },
                            {
                                name: 'test2',
                                type: 'array',
                                value: [
                                    {
                                        label: 'lorem',
                                        value: '1',
                                    },
                                    {
                                        label: 'ipsum',
                                        value: '2',
                                    },

                                    {
                                        label: 'dolor',
                                        value: '3',
                                    },
                                ],
                                defaultValue: '2',
                                label: 'фывфыв',
                            },
                        ]}
                        nodeName="controller"
                        labelWidth={scale(15)}
                    />
                </Block.Body>
            </Block>
        </PageWrapper>
    );
}
