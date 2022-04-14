import { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider, theme } from '@scripts/gds';

import { ModalProvider } from '@context/modal';
import { CommonProvider } from '@context/common';
import { AuthProvider } from '@context/auth';
import { STALE_TIME } from '@scripts/constants';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIME,
            retry: 0,
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        },
    },
});

const AppProviders = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
            <CommonProvider>
                <ModalProvider>
                    <AuthProvider>{children}</AuthProvider>
                </ModalProvider>
            </CommonProvider>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
    </ThemeProvider>
);

export default AppProviders;
