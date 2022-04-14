import { useTheme } from '@scripts/gds';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export interface SkeletonProps {
    height: number;
    width?: number;
    count?: number;
    duration?: number;
    circle?: boolean;
}

const LoadingSkeleton = ({ height, width, count, duration, circle }: SkeletonProps) => {
    const { colors } = useTheme();

    return (
        <SkeletonTheme color={colors?.grey900} highlightColor={colors?.grey600}>
            <Skeleton height={height} width={width} count={count} duration={duration} circle={circle} />
        </SkeletonTheme>
    );
};

export default LoadingSkeleton;
