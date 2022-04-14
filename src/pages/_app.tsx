import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';

import SidebarContainer from '@containers/Sidebar';
import Header from '@containers/Header';

import Auth from '@components/Auth';
import AppProviders from '@components/AppProviders';

import { AuthLocalStorageKeys, removeAuthInfo } from '@api/auth/helpers';
import { apiClient } from '@api/index';

import { useAuth } from '@context/auth';
import { useMount, useMedia } from '@scripts/hooks';
import { useModalsContext } from '@context/modal';

import '@components/controls/Popup/styles.scss';
import { scale } from '@scripts/gds';

const AppContent: FC<AppProps> = ({ Component, pageProps }) => {
    const { user, setUser } = useAuth();
    const { appendModal } = useModalsContext();
    const { md } = useMedia();

    useMount(() => {
        const token = localStorage.getItem(AuthLocalStorageKeys.TOKEN) || '';
        setUser(token);
    });

    return (
        <>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                {/* this string is required according to Ensi license */}
                <meta name="generator" content="Ensi Platform" />
            </Head>

            {user ? (
                <div css={{ [md]: { paddingBottom: scale(6) } }}>
                    <Header
                        onLogout={async () => {
                            try {
                                await apiClient.logOut();
                            } catch (error: any) {
                                appendModal({ message: error.message, theme: 'error' });
                            }
                            setUser('');
                            removeAuthInfo();
                        }}
                    />
                    <SidebarContainer>
                        <Component {...pageProps} />
                    </SidebarContainer>
                </div>
            ) : (
                <Auth
                    logIn={async vals => {
                        try {
                            const data = await apiClient.logIn(vals);
                            setUser(data.data.access_token);
                            appendModal({ title: 'Успешно авторизован', theme: 'success' });
                        } catch (error: any) {
                            appendModal({ title: 'Authorization error', message: error.message, theme: 'error' });
                        }
                    }}
                />
            )}
        </>
    );
};

function MyApp(props: AppProps) {
    return (
        <AppProviders>
            <AppContent {...props} />
        </AppProviders>
    );
}
export default MyApp;
