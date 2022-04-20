import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const parser = new XMLParser({
    allowBooleanAttributes: true,
    // ignoreAttributes: false,
    // attributeNamePrefix: '@_',
});
const builder = new XMLBuilder({
    format: true,
    attributeNamePrefix: '@_',
    ignoreAttributes: false,
});

export const parseXML = <T>(xml: string | Buffer) =>
    parser.parse(xml, {
        allowBooleanAttributes: true,
    }) as T;

export const buildXML = <T>(data: T) => builder.build(data) as string;

export interface Cpu {
    name: string;
    revision: string;
    endian: string;
    mpuPresent: boolean;
    fpuPresent: boolean;
    nvicPrioBits: number;
    vendorSystickConfig: boolean;
}

export interface AddressBlock {
    offset: number;
    size: number;
    usage: string;
}

export interface Interrupt {
    name: string;
    value: number;
}

export interface EnumeratedValue {
    name: string;
    description: string;
    value: number;
}

export interface EnumeratedValues {
    enumeratedValue: EnumeratedValue[];
}

export interface Field {
    name: string;
    description: string;
    bitRange: string;
    access: string;
    enumeratedValues: EnumeratedValues;
}

export interface Fields {
    field: Field[];
}

export interface Register {
    name: string;
    description: string;
    addressOffset: number;
    size: number;
    access: string;
    resetValue: number;
    resetMask: any;
    fields: Fields;
    dim?: number;
    dimIncrement?: number;
    dimIndex: string;
}

export interface Registers {
    register: Register[];
}

export interface Peripheral {
    name: string;
    version: number;
    description: string;
    groupName: string;
    baseAddress: number;
    size: number;
    access: string;
    addressBlock: AddressBlock;
    interrupt: Interrupt;
    registers: Registers;
}

export interface Peripherals {
    peripheral: Peripheral[];
}

export interface Device {
    vendor: string;
    vendorID: string;
    name: string;
    series: string;
    version: number;
    description: string;
    licenseText: string;
    cpu: Cpu;
    addressUnitBits: number;
    width: number;
    size: number;
    access: string;
    resetValue: number;
    resetMask: number;
    peripherals: Peripherals;
}

export interface SVDRootObject {
    device: Device;
}
