/* eslint-disable no-void */
import { useCallback, useRef, useReducer, useLayoutEffect, Dispatch } from 'react';

function useSafeDispatch<T>(dispatch: Dispatch<T>) {
    const mounted = useRef<any>(null);
    useLayoutEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    return useCallback(action => (mounted.current ? dispatch(action) : void 0), [dispatch]);
}

// Example usage:
// const {data, error, status, run} = useAsync()
// useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])
export interface InitState {
    status: 'idle' | 'pending' | 'rejected' | 'resolved';
    data: any;
    error: Error | null;
}

const defaultInitialState = { status: 'idle', data: null, error: null };
function useAsync(initialState: any) {
    const initialStateRef = useRef({
        ...defaultInitialState,
        ...initialState,
    });
    const [{ status, data, error }, setState] = useReducer(
        (s: any, a: any) => ({ ...s, ...a }),
        initialStateRef.current
    );

    const safeSetState = useSafeDispatch(setState);

    const setData = useCallback(data => safeSetState({ data, status: 'resolved' }), [safeSetState]);
    const setError = useCallback(error => safeSetState({ error, status: 'rejected' }), [safeSetState]);
    const reset = useCallback(() => safeSetState(initialStateRef.current), [safeSetState]);

    const run = useCallback(
        promise => {
            if (!promise || !promise.then) {
                throw new Error(
                    `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
                );
            }
            safeSetState({ status: 'pending' });
            return promise.then(
                (res: any) => {
                    setData(res);
                    return res;
                },
                (err: any) => {
                    setError(err);
                    return Promise.reject(err);
                }
            );
        },
        [safeSetState, setData, setError]
    );

    return {
        // using the same names that react-query uses for convenience
        isIdle: status === 'idle',
        isLoading: status === 'pending',
        isError: status === 'rejected',
        isSuccess: status === 'resolved',

        setData,
        setError,
        error,
        status,
        data,
        run,
        reset,
    };
}

export { useAsync };
