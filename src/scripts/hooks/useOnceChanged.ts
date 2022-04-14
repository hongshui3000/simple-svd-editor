import { useEffect, useState } from 'react';

/** Один раз меняет значение возвращаемого параметра при заданном условии */
export const useOnceChanged = (condition: boolean) => {
    const [wasChanged, setWasChanged] = useState(false);

    useEffect(() => {
        if (!wasChanged && condition) {
            setWasChanged(true);
        }
    }, [condition, wasChanged]);

    return wasChanged;
};
