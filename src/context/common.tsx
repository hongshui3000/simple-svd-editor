import { useContext, createContext, ReactNode, ReactNodeArray, Dispatch, SetStateAction, useState, FC } from 'react';

type IsOpen = boolean;

export interface CommonContextProps {
    isSidebarOpen: IsOpen;
    setIsSidebarOpen: Dispatch<SetStateAction<IsOpen>>;
    isOverlayOpen: IsOpen;
    setIsOverlayOpen: Dispatch<SetStateAction<IsOpen>>;
}

const CommonContext = createContext<CommonContextProps | null>(null);
CommonContext.displayName = 'CommonContext';

export const CommonProvider: FC<{ children: ReactNode | ReactNodeArray }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    return (
        <CommonContext.Provider value={{ isSidebarOpen, setIsSidebarOpen, isOverlayOpen, setIsOverlayOpen }}>
            {children}
        </CommonContext.Provider>
    );
};

export const useCommon = () => {
    const context = useContext(CommonContext);

    if (!context) {
        throw new Error(`Hook useCommon must be used within CommonProvider`);
    }

    return context;
};
