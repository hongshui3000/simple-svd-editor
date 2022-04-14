import { SelectProps } from './types';
import { SelectSimple } from './SelectSimple';
import { SelectSearch } from './SelectSearch';

export default function SelectComponent({ simple, ...props }: SelectProps) {
    return simple ? <SelectSimple {...props} /> : <SelectSearch {...props} />;
}

export * from './types';
