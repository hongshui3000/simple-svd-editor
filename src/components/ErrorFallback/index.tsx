import { scale, useTheme, typography } from '@scripts/gds';

function ErrorFallback({ error }: any) {
    const { colors } = useTheme();

    return (
        <div role="alert" css={{ padding: scale(3), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p css={{ ...typography('h1'), marginBottom: scale(3) }}>Что-то пошло не так</p>
            <pre css={{ color: colors?.danger, marginBottom: scale(3) }}>{error.message}</pre>
        </div>
    );
}

export default ErrorFallback;
