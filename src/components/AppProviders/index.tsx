import { AppProps } from 'next/app';
import { ReactNode, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { CommonProvider } from '@context/common';
import { ModalProvider } from '@context/modal';

import { STALE_TIME } from '@scripts/constants';
import { ThemeProvider, theme } from '@scripts/gds';

interface AppProvidersProps extends AppProps {
    children: ReactNode;
}

const AppProviders = ({ children, pageProps }: AppProvidersProps) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: STALE_TIME,
                        retry: 0,
                        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
                    },
                },
            })
    );

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <CommonProvider state={pageProps}>
                        <ModalProvider>{children}</ModalProvider>
                    </CommonProvider>
                </Hydrate>
                <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
            </QueryClientProvider>
        </ThemeProvider>
    );
};

export default AppProviders;
