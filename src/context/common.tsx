import { parseXML, SVDRootObject } from '@scripts/xml';
import { CommonComponentDataProps } from '@scripts/getTotalPageData';
import {
    useContext,
    createContext,
    ReactNode,
    ReactNodeArray,
    Dispatch,
    SetStateAction,
    useState,
    FC,
} from 'react';

export interface CommonContextProps {
    xmlData: SVDRootObject | null;
    setXmlData: Dispatch<SetStateAction<SVDRootObject | null>>;
}

const CommonContext = createContext<CommonContextProps | null>(null);
CommonContext.displayName = 'CommonContext';

export const CommonProvider: FC<{
    state: CommonComponentDataProps;
    children: ReactNode | ReactNodeArray;
}> = ({ state, children }) => {
    const [xmlData, setXmlData] = useState<SVDRootObject | null>(
        parseXML<SVDRootObject>(state.xmlData)
    );

    return (
        <CommonContext.Provider
            value={{
                xmlData,
                setXmlData,
            }}
        >
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
