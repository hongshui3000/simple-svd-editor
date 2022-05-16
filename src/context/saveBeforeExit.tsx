import { Router, useRouter } from 'next/router';
import {
    FC,
    ReactNode,
    ReactNodeArray,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import DirtyConfirmModal from '@components/DirtyConfirmModal';

import { usePrevious } from '@scripts/hooks';

// import { CommonComponentDataProps } from '@scripts/getTotalPageData';

export interface SaveBeforeExitContextProps {
    goingToLink: string | null;
    setGoingToLink: (val: string | null) => void;
    isDirty: boolean;
    setDirty: (val: boolean) => void;

    shouldSave: boolean;
    setShouldSave: (val: boolean) => void;

    safePush: Router['push'];
}

const SaveBeforeExitContext = createContext<SaveBeforeExitContextProps | null>(null);
SaveBeforeExitContext.displayName = 'SaveBeforeExitContext';

export const SaveBeforeExitProvider: FC<{
    // state: CommonComponentDataProps;
    children: ReactNode | ReactNodeArray;
}> = ({ children }) => {
    const [goingToLink, setGoingToLink] = useState<any>(null);
    const [isDirty, setDirty] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);
    const { push } = useRouter();

    const prevShouldSave = usePrevious(shouldSave);
    const prevIsDirty = usePrevious(isDirty);

    useEffect(() => {
        if (prevIsDirty && prevShouldSave && !isDirty) {
            setShouldSave(false);

            setGoingToLink(null);
            push(goingToLink);
        }
    }, [goingToLink, isDirty, prevIsDirty, prevShouldSave, push]);

    const safePush: Router['push'] = useCallback(
        (url, as, options) => {
            if (isDirty) {
                setGoingToLink(url);
                return Promise.resolve(true);
            }

            return push(url, as, options);
        },
        [isDirty, push]
    );

    return (
        <SaveBeforeExitContext.Provider
            value={{
                goingToLink,
                setGoingToLink,
                isDirty,
                setDirty,
                shouldSave,
                setShouldSave,
                safePush,
            }}
        >
            <DirtyConfirmModal
                isOpen={!!isDirty && !!goingToLink && !shouldSave}
                onReset={() => {
                    setGoingToLink(null);
                    push(goingToLink);
                }}
                onSave={() => {
                    setShouldSave(true);
                }}
                onClose={() => setGoingToLink(null)}
            />
            {children}
        </SaveBeforeExitContext.Provider>
    );
};

export const useSaveBeforeExit = () => {
    const context = useContext(SaveBeforeExitContext);

    if (!context) {
        throw new Error(
            `Hook useSaveBeforeExit must be used within SaveBeforeExitProvider`
        );
    }

    return context;
};
