import { ElementType, ComponentPropsWithRef } from 'react';

export type MergeElementProps<T extends ElementType, P extends object = {}> = Omit<ComponentPropsWithRef<T>, keyof P> &
    P;
