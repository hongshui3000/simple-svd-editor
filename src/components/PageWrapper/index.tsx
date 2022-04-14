import { ReactNode } from 'react';
import Head from 'next/head';
import { scale, typography, useTheme, VisuallyHidden } from '@scripts/gds';
import LoadWrapper from '@components/controls/LoadWrapper';

type PageWrapperProps = {
    h1?: string;
    title?: string;
    error?: string;
    isLoading?: boolean;
    children: ReactNode;
    className?: string;
};

const PageWrapper = ({ h1, title, isLoading = false, error, children, className }: PageWrapperProps) => {
    const { colors } = useTheme();
    return (
        <>
            <Head>
                <title>{title || h1}</title>
            </Head>
            <LoadWrapper isLoading={isLoading} error={error}>
                <main
                    css={{
                        padding: `${scale(2)}px ${scale(3)}px`,
                        background: colors?.grey200,
                        height: '100%',
                    }}
                    className={className}
                >
                    {h1 ? (
                        <h1 css={{ ...typography('h1'), marginBottom: scale(2), marginTop: 0 }}>{h1}</h1>
                    ) : (
                        <VisuallyHidden>
                            <h1>{title}</h1>
                        </VisuallyHidden>
                    )}

                    {children}
                </main>
            </LoadWrapper>
        </>
    );
};

export default PageWrapper;
