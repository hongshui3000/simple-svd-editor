import { HTMLProps, ReactNode } from 'react';
import { scale, useTheme, typography } from '@scripts/gds';
import Loader from '@components/controls/Loader';

export interface LoadWrapperProps extends HTMLProps<HTMLDivElement> {
    /** Wrapped component */
    children: ReactNode;
    /** Loading state */
    isLoading: boolean;
    /** Error text */
    error?: string | undefined;
    /** Empty result state */
    isEmpty?: boolean;
    /** Empty result text */
    emptyMessage?: ReactNode;
}

const LoadWrapper = ({ children, isLoading, error, isEmpty, emptyMessage, ...props }: LoadWrapperProps) => {
    const { colors } = useTheme();
    return (
        <div {...props} css={{ width: '100%', height: '100%' }}>
            {isLoading && <Loader />}
            {!isLoading && error && (
                <p css={{ padding: `${scale(2)}px ${scale(3)}px 0`, color: colors?.danger, ...typography('bodyMd') }}>
                    Ошибка: {error}
                </p>
            )}
            {!isLoading && !error && isEmpty && emptyMessage}
            {!isEmpty && children}
        </div>
    );
};

export default LoadWrapper;
