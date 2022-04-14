import { useContext, createContext, ReactNode, ReactNodeArray, Dispatch, SetStateAction } from 'react';
import { AuthLocalStorageKeys } from '@api/auth/helpers';
import { useLocalStorage } from '@scripts/hooks';

export interface AuthContextProps {
    user: string;
    setUser: Dispatch<SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextProps | null>(null);
AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode | ReactNodeArray }) => {
    const [user, setUser] = useLocalStorage(AuthLocalStorageKeys.TOKEN, '');

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(`Hook useAuth must be used within AuthProvider`);
    }

    return context;
};
