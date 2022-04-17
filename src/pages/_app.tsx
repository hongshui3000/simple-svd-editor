import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';

import AppProviders from '@components/AppProviders';

import '@components/controls/Popup/styles.scss';

const AppContent: FC<AppProps> = ({ Component, pageProps }) => (
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

        <Component {...pageProps} />
    </>
);
function MyApp(props: AppProps) {
    return (
        <AppProviders>
            <AppContent {...props} />
        </AppProviders>
    );
}
export default MyApp;
