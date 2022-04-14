import { useEffect, useRef } from 'react';

export function useDidUpdateEffect(fn: any, inputs: any[]) {
    const fncRef = useRef<any>();
    fncRef.current = fn;
    const didMountRef = useRef(false);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
        } else {
            return fncRef?.current && fncRef?.current();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, inputs);
}
