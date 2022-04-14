import { useState, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            if (item) return JSON.parse(item);
            // @ts-ignore
            return typeof initialValue === 'function' ? initialValue() : initialValue;
        } catch (error) {
            // If error also return initialValue
            // @ts-ignore
            return typeof initialValue === 'function' ? initialValue() : initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            window.localStorage.setItem(
                key,
                typeof valueToStore === 'string' ? valueToStore : JSON.stringify(valueToStore)
            );
        } catch (error) {
            // A more advanced implementation would handle the error case
        }
    };

    return [storedValue, setValue];
}
